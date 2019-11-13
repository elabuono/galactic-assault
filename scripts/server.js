var express = require('express');
var app = express();

app.get('/', function (req, res) {

    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: 'galexy2019!',
        server: 'localhost',
    };

         res.setHeader('Access-Control-Allow-Origin', '*');

         // Request methods you wish to allow
         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

         // Request headers you wish to allow
         res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

         // Set to true if you need the website to include cookies in the requests sent
         // to the API (e.g. in case you use sessions)
         res.setHeader('Access-Control-Allow-Credentials', true);

    // connect to your database
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query('select * from q_table.dbo.[Move] where id = 0', function (err, recordset) {

            if (err) console.log(err)

            // send records as a response
            res.send(recordset);

        });
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});