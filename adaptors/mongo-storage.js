let config = require('../lib/config')
let MongoClient = require('mongodb').MongoClient
let db = null
connect = function(connStr, callback) {
    var s = (connStr || config.credentials.mongodb)
    MongoClient.connect(config.credentials.mongodb, function(err, db) {
        if (err) {
            callback(err)
        }
        else 
        {
            callback(db)
        }
    })
}
module.exports = {
     DB: function(callback) {
        if (db)
            callback(db)
        else 
            connect(null, function(newDb) {
                db = newDb
                callback(db)
            })
     },
    write_data_async: function(json, callback) {
        //var err= new Error("Not Implemented")
        console.log("WARNING: Using dummy storage provider. Data not saved.")
        console.log("DEBUG: no error code will be set, continuing normally.")
        if (typeof callback === 'function')
            callback()
    },
}

/* 
    get: async(function(req,res,next) {
        try
        {
            var id = req.params.id
            var promo= await (tables.promos.get(id))
            promo.promo_rules = await (tables.promo_rules.getByPromoId(promo.id))
            promo.total_usage_count = await (tables.promo_usage_history.getTotalUsageCount(p.id))
            send (res, promo)
        }
        catch(err) {
            next(err)
        }
    }),
 */

