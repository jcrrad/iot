var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

var router = express.Router();
var con = mysql.createConnection({
    host: "192.168.86.63",
    user: "jeff",
    password: "password",
    database: "temperature"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/previous', function (req, res, next) {
    //TODO read from database
    var result = [];
    con.query("SELECT\n" +
        "  temperature,\n" +
        "  sensor,\n" +
        "  timestamp\n" +
        "FROM Temperature", function (err, raw, fields) {
        for (key in raw) {
            result.push([raw[key]['timestamp'], raw[key]['temperature']])
            console.log(raw[key]);
        }

        // res.send([{name:"A",data:result}])
        res.send(result);
    });
})

router.get('/save/:sensor/:temp', function (req, res, next) {
    var sensor = parseFloat(req.params.sensor);
    var temp = parseFloat(req.params.temp);
    //todo write to database
    res.send(200);
});


function convertTemp(number) {
    number = parseFloat(number.substring(1));
    number = cToF(number);
    return number
}

function getFormatedTime() {
    var time = Math.floor(new Date().getTime() / 1000) * 1000;
    return time - (1000 * 60 * 60 * 5);

}


function cToF(degree) {
    return degree * 9 / 5 + 32;
}

module.exports = router;
