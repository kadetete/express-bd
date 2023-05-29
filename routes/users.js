var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbdigimon'
});

router.get('/', function(req, res) {
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

  const sql = 'INSERT INTO tbusuario(usuario, email, senha) VALUES (?, ?)'
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

router.put('/:idUsuario', function(req, res) {
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

router.delete('/:idUsuario', function(req, res) {
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
