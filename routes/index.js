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
        data = JSON.parse(data);
        res.send(data);
    })
})
router.get('/current', function(req, res, next) {
    var offset=new Date().getTimezoneOffset();
    offset=offset*1000*60*60;
    var time = new Date().getTime()-offset;

    var ans = [
        [time, Math.random()*10],
        [time, Math.random()*10]
    ]
    res.send(ans)
    var xbeeConfig = {
            baudrate: 9600
        }
        //var xbee = new SerialPort("/dev/ttyUSB0", xbeeConfig);

})
module.exports = router;
