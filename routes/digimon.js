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
    con.query('SELECT * FROM tbdigimon', 
    function(erroConexaoSQL, result, fields) {
      if (erroConexaoSQL) {
        throw erroConexaoSQL
      }
      res.status(200).send(result);
    });
  });
  
  router.post('/', function(req, res) {
    const nome_digi = req.body.nome_digi;
    const nivel = req.body.nivel;
    const tipo = req.body.tipo;
    const evolucao = req.body.evolucao;

    const sql = 'INSERT INTO tbdigimon(nome_digi, nivel, tipo, evolucao) VALUES (?, ?, ?, ?)'
    con.query(sql, 
      [nome_digi, nivel, tipo, evolucao],
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
  
  router.put('/:idDigimon', function(req, res) {
    const idDigimon = req.params.idDigimon;
    const nome_digi = req.body.nome_digi;
    const nivel = req.body.nivel;
    const tipo = req.body.tipo;
    const evolucao = req.body.evolucao;
  
    const sql = 'UPDATE tbdigimon SET nome_digi = ?, nivel = ?, tipo = ?, evolucao = ? WHERE idDigimon = ?';
    con.query(sql, [nome_digi, nivel, tipo, evolucao, idDigimon], function(erroConexaoSQL, result, fields) {
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
  
  router.delete('/:idDigimon', function(req, res) {
    const idDigimon = req.params.idDigimon;
  
    const sql = 'DELETE FROM tbdigimon WHERE idDigimon = ?';
    con.query(sql, [idDigimon], function(erroConexaoSQL, result, fields) {
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