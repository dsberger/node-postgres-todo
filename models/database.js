var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE ITEMS(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });
