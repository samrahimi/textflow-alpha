//Given a JSON post, formats it nicely, saves it as text, and returns the URL to get it.
var express = require('express');
var router = express.Router();
var config = require('../lib/config')
let uuid = require('uuid-v4')
var path = require('path')
router.post('/', function(req, res, next) {
    var jString = JSON.stringify(req.body, null, 3)
    var filename = uuid().toString() + '.json'
    var filepath = 'public/textflow.us/exports/' + filename
    require('fs').writeFileSync(filepath, jString)

    res.send({ url: 'https://textflow.us/datasets/' + filename })
});

module.exports = router