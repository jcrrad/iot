var express = require('express');
var router = express.Router();
var fs = require('fs');
var SerialPort = require("serialport").SerialPort

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');

});

router.get('/previous/', function(req, res, next) {

    fs.readFile('previous.txt', "utf-8", function(err, data) {
        if (err) {
            res.send(err);
        }
        res.send(data);
    })
})
router.get('/current', function(req, res, next) {
  
    fs.readFile('current.txt', "utf-8", function(err, data) {
        if (err) {
            res.send(err);
        }
        res.send(data);
    })
})
module.exports = router;
