var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var mongo = require('../adaptors/mongo_storage')
//Get summary of available contexts
router.get('/', function(req, res, next) {
    mongo.DB(function(db) {
        db.collection('ContextRules').find({}).toArray(function(err, result) {
            var c = result.map(function(r) {return {id: r.key, title: r.title}})
            res.send(c)
        })
    })
})

module.exports = router