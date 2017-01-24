var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var MongoClient = require('mongodb').MongoClient

//Email collector for public website
router.get('/', function(req, res, next) {
    var email = req.query.email
    MongoClient.connect(config.credentials.mongodb, function(err, db) {
        db.collection('emails').insert({email: email}, function(err, result) {
            res.send({status:'ok'})
        })
    })
})

module.exports = router