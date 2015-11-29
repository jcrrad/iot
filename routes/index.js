var express = require('express');
var router = express.Router();
var fs = require('fs');
var SerialPort = require("serialport").SerialPort
var previous = [{
    "name": "Sensor 1",
    "data": []
}, {
    "name": "Sensor 2",
    "data": []
}];
/* GET home page. */
router.get('/', function(req, res, next) {
    readXBee();
    res.render('index');
});
var sp = require("serialport");
var SerialPort = sp.SerialPort
var serialPort = new SerialPort("COM12", {
    // var serialPort = new SerialPort("/dev/ttyUSB0", {
    baudrate: 9600,
    parser: sp.parsers.readline("\n")
});

router.get('/previous', function(req, res, next) {
    fs.readFile('previous.json', "utf-8", function(err, data) {
        if (err) {
            res.send(err);
        }
        res.send(data);
    })
})

router.get('/current', function(req, res, next) {
    var time = new Date().getTime();
    fs.readFile('a.json', "utf-8", function(err, a) {
        if (err) {
            res.send(err);
        }
        fs.readFile('b.json', "utf-8", function(err, b) {
            if (err) {
                res.send(err);
            }
            res.send([
                [time, parseFloat(a)],
                [time, parseFloat(b)]
            ]);
        })
    })
})


function readFile(name) {
    fs.readFile(name, "utf-8", function(err, data) {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log(data);
            return JSON.parse(data);
        }
    })
}

function writeFile(name, data) {
    fs.writeFile(name, data, function(err, data) {
        if (err) {
            return err;
        } else
            return data;
    })
}

function convertTemp(number) {
    number = parseFloat(number.substring(1));
    number = cToF(number);
    return number
}

function getFormatedTime() {
    var time = Math.floor(new Date().getTime() / 1000) * 1000;
    return time - (1000 * 60 * 60 * 5);

}

function writeA(number) {
    var date = getFormatedTime()
    number = convertTemp(number);
    previous[0]['data'].push([date, number]);
    writeFile("a.json", number);
}

function writeB(number) {
    var date = getFormatedTime()
    number = convertTemp(number);
    previous[1]['data'].push([date, number]);
    writeFile("b.json", number);
}

function cToF(degree) {
    return degree * 9 / 5 + 32;
}

function readXBee() {
    var temp = "";
    serialPort.on('data', function(temp) {
        //console.log(temp);
        if (temp.indexOf("A"))
            writeA(temp);
        if (temp.indexOf("B"))
            writeB(temp);
        writeFile("previous.json", JSON.stringify(previous));
    });
};
router.get('/clear', function(req, res, next) {
    previous = [{
        "name": "Sensor 1",
        "data": []
    }, {
        "name": "Sensor 2",
        "data": []
    }];
    writeFile("previous.json", JSON.stringify(previous));
    res.redirect('/');
})
module.exports = router;
