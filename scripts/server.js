var express = require('express');
var app = express();
var sql2 = require("mssql");
const fs = require("fs")

var config = {
    user: 'sa',
    password: 'galexy2019!',
    server: 'localhost',
};

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
