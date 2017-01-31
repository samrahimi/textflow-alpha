var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var mongo = require('../adaptors/mongo_storage')

var clipboard

//Post object or string to clipboard
router.post('/', function(req, res, next) {
    clipboard = req.body
})

route.get('/', function(req, res, next) {
    var fmt = req.params.format || 'json'
    res.send(fmt == 'json' ? JSON.stringify(clipboard) : clipboard)
})
