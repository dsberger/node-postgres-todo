var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function queryDatabase(res, sqlQuery, sqlArgs){

    var results = [];

    pg.connect(connectionString, function(err, client, done) {
        if(err){
            done();
            console.log(err);
            return res.status(500).json({success: false, data: err});
        }

        if (sqlQuery){
            client.query(sqlQuery, sqlArgs);
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
};

/* CREATE */
router.post('/api/v1/todos', function(req, res){

    var data = {text: req.body.text, complete: false};

    queryDatabase(
            res,
            "INSERT INTO items(text, complete) values($1, $2)",
            [data.text, data.complete]
        );
});

/* READ */
router.get('/api/v1/todos', function(req, res){

    queryDatabase(res);
});

/* UPDATE */
router.put('/api/v1/todos/:todo_id', function(req, res){

    var id = req.params.todo_id;
    var data = {text: req.body.text, complete: req.body.complete};

    queryDatabase(
            res,
            "UPDATE items SET text=($1), complete=($2) WHERE id=($3)",
            [data.text, data.complete, id]
        );
});

/* DELETE */
router.delete('/api/v1/todos/:todo_id', function(req, res){

    var id = req.params.todo_id;

    queryDatabase(
            res,
            "DELETE FROM items WHERE id=($1)",
            [id]
        );
});

module.exports = router;
