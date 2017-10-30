var express = require('express');
var mysql = require('mysql');
var fs = require('fs');

var router = express.Router();
var con = mysql.createConnection({
    host: "192.168.1.4",
    user: "jeff",
    password: "password",
    database: "temperature"
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/previous', function (req, res, next) {
    var result1 = [];
    var result2 = [];
    var query = "SELECT\n" +
        "  sensor,\n" +
        "  avg(Temperature) as temperature,\n" +
        "  date_format(readingTime ,'%m-%d-%y %T')as readingTime\n" +
        "FROM Temperature\n" +
        "group by sensor, readingTime\n" +
        "limit 1000"
    con.query(query, function (err, raw, fields) {
        for (key in raw) {
            console.log(raw[key]);
            if (raw[key]['sensor'] == 1)
                result1.push([new Date(raw[key]['readingTime']), parseFloat(raw[key]['temperature'])])
            if (raw[key]['sensor'] == 2)
                result2.push([new Date(raw[key]['readingTime']), parseFloat(raw[key]['temperature'])])
        }
        res.send([{name: "Inside", data: result1},
            {name: "Outside", data: result2}])
    });
})


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
