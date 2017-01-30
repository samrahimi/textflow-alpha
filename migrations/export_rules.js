var mongo = require("../adaptors/mongo_storage")
var fs = require('fs')


    var mongo = require('../adaptors/mongo_storage')
    //Get summary of available contexts
    mongo.DB(function(db) {
        db.collection('ContextRules').find({}).toArray(function(err, result) {
            var c = JSON.stringify(result, null, 2)
            fs.writeFile('ContextRules.bson', c)
        })
    })
