var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var mongo = require('../adaptors/mongo_storage')

//Get summary of available contexts
router.get('/:context_name', function(req, res, next) {
    var query = {context_name:req.params.context_name}

    mongo.read_data('ContextRules', query, function(err,result) {
        res.send(result)
    })
})

//Insert or update a context
router.post('/', function(req, res, next) {
    var context = req.body
    mongo.write_data("ContextRules", context, function(err, updatedContext) {
        res.send({_id:updatedContext._id})
    })
});

module.exports = router