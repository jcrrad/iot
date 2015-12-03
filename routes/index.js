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
var alarms = {
    temperature: [false, false],
    time: false
}
var trigger = false;

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

router.get('/temp/:sensor/:temp', function(req, res, next) {
    var sensor = parseFloat(req.params.sensor);
    var temp = parseFloat(req.params.temp);
    alarms["temperature"][sensor] = temp;
    res.send(200);
});

router.get('/time/:delta', function(req, res, next) {
    var delta = parseFloat(req.params.delta);
    delta = delta * 1000 * 60;
    alarms["time"] = new Date().getTime() + delta;
});

router.get("/alarms", function(req, res, next) {
    console.log(alarms);
    if (trigger) {
        res.send({});
        return;
    }
    if (new Date().getTime() < alarms["time"]) {
        alarms["time"] = false;
        res.send();
        return
    }

    res.sendStatus(500);
});


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
    if (alarms["temperature"][0]) {
        var goal = alarms["temperature"][0];
        if (goal < number)
            trigger = true;
    }
    writeFile("a.json", number);

}

function writeB(number) {
    var date = getFormatedTime()
    number = convertTemp(number);
    previous[1]['data'].push([date, number]);
    if (alarms["temperature"][1]) {
        var goal = alarms["temperature"][1];
        if (goal < number)
            trigger = true;
    }

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
    alarms = {
        temperature: [false, false],
        time: false
    };
    previous = [{
        name: "Sensor 1",
        data: []
    }, {
        name: "Sensor 2",
        data: []
    }];
    writeFile("previous.json", JSON.stringify(previous));
    res.redirect('/');
})
module.exports = router;
