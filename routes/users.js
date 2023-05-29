var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const jwt = require('jsonwebtoken');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbdigimon'
});

// metodo de autenticacao 
router.post('/login', (req, res) => {
  const usuario = req.body.usuario;
  const senha = req.body.senha;
  const sql = 'SELECT usuario, senha FROM tbusuario WHERE usuario = ?';
  con.query(sql, [usuario], (erroComandoSQL, result, fields) => {
    if (erroComandoSQL) {
      throw erroComandoSQL;
    } else {
      if (result.length > 0) {
        //const nome = result[0].usuario;
        const token = jwt.sign({usuario: usuario}, senha, {
          expiresIn: 60 * 10, // expires in 5min (300 segundos ==> 5 x 60)
        });
        res.json({ auth: true, token: token });
      } else {
        res.status(403).json({ message: 'Login inválido!' });
      }
    }
  });
});

function verificarToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).json({
      auth: false,
      message: 'Nenhum token de autenticação informado.',
    });
  } else {
    jwt.verify(token, senha, function (err, decoded) {
      if (err) {
        res.status(500).json({ auth: false, message: 'Token inválido.' });
      } else {
        console.log('Metodo acessado por ' + decoded.nome);
        next();
      }
    });
  }
}

router.get('/', verificarToken, function(req, res) {
  con.query('SELECT * FROM tbusuario', 
  function(erroConexaoSQL, result, fields) {
    if (erroConexaoSQL) {
      throw erroConexaoSQL
    }
    res.status(200).send(result);
  });
});

router.post('/', function(req, res) {
  const usuario = req.body.usuario;
  const senha = req.body.senha;
  const email = req.body.email;

  const sql = 'INSERT INTO tbusuario(usuario, email, senha) VALUES (?, ?, ?)'
  con.query(sql, 
    [usuario, email, senha], 
    function(erroConexaoSQL, result, fields) {
      if (erroConexaoSQL) {
        throw erroConexaoSQL;
      }
      if (result.affectedRows > 0) {
        res.status(200).send('Registro incluído com sucesso');
      } else {
        res.status(400).send('Erro ao incluir');
      }
    });
});

router.put('/:idUsuario', verificarToken, function(req, res) {
  const idUsuario = req.params.idUsuario;
  const usuario = req.body.usuario;
  const email = req.body.email;
  const senha = req.body.senha;

  const sql = 'UPDATE tbusuario SET usuario = ?, email = ?, senha = ? WHERE idUsuario = ?';
  con.query(sql, [usuario, email, senha, idUsuario], function(erroConexaoSQL, result, fields) {
    if (erroConexaoSQL) {
      throw erroConexaoSQL;
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Registro atualizado com sucesso');
    } else {
      res.status(404).send('Registro não encontrado')
    }
  });
});

router.delete('/:idUsuario', verificarToken, function(req, res) {
  const idUsuario = req.params.idUsuario;

  const sql = 'DELETE FROM tbusuario WHERE idUsuario = ?';
  con.query(sql, [idUsuario], function(erroConexaoSQL, result, fields) {
    if (erroConexaoSQL) {
      throw erroConexaoSQL;
    }
    if (result.affectedRows > 0) {
      res.status(200).send('Registro excluído com sucesso');
    } else {
      res.status(404).send('Registro não encontrado')
    }
  });
});

module.exports = router;
