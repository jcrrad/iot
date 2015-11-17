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
        //     res.send(data);
        var time = new Date().getTime();
        var a = [];
        var b = [];
        for (var x = 10; x > 0; x--) {
            a.push([time - x * 1000, Math.random() * 10]);
            b.push([time - x * 1000, Math.random() * 10]);
        }
        var ans = [{
            "name": "A",
            "data": a
        }, {
            "name": "B",
            "data": b
        }];
        res.send(ans);
    })
})
router.get('/current', function(req, res, next) {
    var offset = new Date().getTimezoneOffset();
    offset = offset * 1000 * 60 * 60;
    offset = 0;
    var time = new Date().getTime() - offset;
    console.log()
    var ans = [
        [time, Math.random() * 10],
        [time, Math.random() * 10]
    ]
    res.send(ans)
    var xbeeConfig = {
            baudrate: 9600
        }
        //var xbee = new SerialPort("/dev/ttyUSB0", xbeeConfig);

})
module.exports = router;
