var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var mongo = require('../adaptors/mongo_storage')

//Get by name
router.get('/:context_name', function(req, res, next) {
    var query = {context_name:req.params.context_name}

    mongo.read_data('ContextRules', query, function(err,result) {
        res.send(result)
    })
})

//Get by algo
router.get('/algorithm/:algo', function(req, res, next) {
    var query = {algorithm:req.params.algo}

    mongo.read_data('ContextRules', query, function(err,result) {
        res.send(result)
    })
})

//Takes a JS object in /rules/data and uploads it to DB. File extension not required.
router.get('/upload/:mod', function(req, res, next){
    var s = require('../data/rules/'+req.params.mod)
    mongo.write_data("ContextRules", s, function(err, updatedContext) {
        res.send({_id:updatedContext._id})
    })
})

//Insert or update a context
router.post('/', function(req, res, next) {
    var context = JSON.parse(req.body)
    mongo.write_data("ContextRules", context, function(err, updatedContext) {
        res.send({_id:updatedContext._id})
    })
});

module.exports = router