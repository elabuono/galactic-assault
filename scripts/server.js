var express = require('express');
var app = express();
const fs = require('fs')


// config for your database


app.get('/', function (req, res) {
    var sql = require("mssql");

    var config = {
        user: 'sa',
        password: 'galexy2019!',
        server: 'localhost',
    };

    res.setHeader('Access-Control-Allow-Origin', '*');

    // connect to your database
    /*
    async () => {

            // make sure that any items are correctly URL encoded in the connection string
            await sql.connect(config)
            const result = await sql.query `sselect * from q_table.dbo.[Move] where id = 0`
            console.dir(result)

    }*/


     console.log("0")
    sql.connect(config, function (err) {
        console.log("1")
        if (err) console.log(err);
        console.log("2")
        // create Request object
        var request = new sql.Request();
    console.log("3")
        // query to the database and get the records
        request.query('select * from q_table.dbo.[Move]', function (err, recordset) {
             console.log("4")
            if (err) console.log(err)
            // send records as a response
             console.log("5")
            res.send(recordset);
             console.log("6")
            console.log('worked')
        });
    });

});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});

/*
 // Request methods you wish to allow
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

 // Request headers you wish to allow
 res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

 // Set to true if you need the website to include cookies in the requests sent
 // to the API (e.g. in case you use sessions)
 res.setHeader('Access-Control-Allow-Credentials', true);
 */
