var express = require('express');
var router = express.Router();
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'iot' });
    fs.readFile('data.txt', "utf-8", function(err, data) {
        if (err) {
            res.send(err);
        }
        data=JSON.parse(data);
        console.log(typeof data);
        //res.send(data);
    
    })
});

module.exports = router;
