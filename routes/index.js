var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* create a todo, POST todos */

router.post('/api/v1/todos', function(req, res){
    var results = [];

    var data = {text: req.body.text, complete: false};

    pg.connect(connectionString, function(err, client, done) {
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("INSERT INTO items(text, complete) values($1, $2)", [data.text, data.complete]);

        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        query.on('end', function(){
            done();
            return res.json(results);
        });
    });
});

router.get('/api/v1/todos', function(req, res){
    var results = [];

    pg.connect(connectionString, function(err, client, done) {

        if(err){
            done();
            console.log(err);
            return res.status(500).json({success:false, data: err});
        }

        var query = client.query("SELECT * FROM items ORDER BY id ASC");

        query.on('row', function(row){
            results.push(row);
        });

        query.on('end', function(){
            done();
            return res.json(results);
        });
    });
});

module.exports = router;
