var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const MinhaSenha = 'ifrn2@23';

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbdigimon'
});

con.connect((erroConexao) => {
  if (erroConexao) {
    throw erroConexao;
  }
});

// metodo de autenticacao
app.post('/login', (req, res) => {
  const idUsuario = req.body.idUsuario;
  const usuario = req.body.usuario;
  const sql = 'SELECT * FROM tbusuario WHERE idUsuario = ? AND usuario = ?';
  con.query(sql, [idUsuario, usuario], (erroComandoSQL, result, fields) => {
    if (erroComandoSQL) {
      throw erroComandoSQL;
    } else {
      if (result.length > 0) {
        //const nome = result[0].usuario;
        const token = jwt.sign({ idUsuario: idUsuario, usuario: usuario }, MinhaSenha, {
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
    jwt.verify(token, MinhaSenha, function (err, decoded) {
      if (err) {
        res.status(500).json({ auth: false, message: 'Token inválido.' });
      } else {
        console.log('Metodo acessado por ' + decoded.nome);
        next();
      }
    });
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
