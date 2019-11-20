var express = require('express');
var app = express();
const fs = require('fs')
var sql = require("mssql");
var sql2 = require("mssql");

var config = {
    user: 'sa',
    password: 'galexy2019!',
    server: 'localhost',
};

// config for your database


app.get('/', function (req, res) {


    res.setHeader('Access-Control-Allow-Origin', '*');

    sql2.connect(config).then(pool => {
        return pool.request().query('select * from q_table.dbo.[Move]')
    }).then(result =>{
        res.send(result);
    }).catch(err => {
        console.log("There was an error")
     })

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
