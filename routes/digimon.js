var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbdigimon'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
});

module.exports = router;