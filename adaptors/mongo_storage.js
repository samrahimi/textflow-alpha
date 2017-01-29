let config = require('../lib/config')
let MongoClient = require('mongodb').MongoClient
let uuid = require('uuid-v4')
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
    write_data_async: function(json) {
        //Write the data on a separate thread and let the app continue
        //this is for analytics results, which it's fine to be a few seconds delayed
        console.log("Data dump received.")
            connect(null, function(newDb) {
                newDb.collection('RAW_RESULTS').insert(json, function(err, result) {})
            })
    },
    write_data: function(collection, json, callback) {
        //Insert or update. Calls back with (error, data, record_count)
        console.log("Writing to "+collection)
            connect(null, function(newDb) {
                var table = newDb.collection(collection)
                if (json._id)
                {
                    table.update({_id: json._id}, json, {}, function(err, count) {
                        if (err)
                            console.log("Error: "+err)
                        callback(err, json, count)
                    })
                } else {
                    json._id = uuid()
                    table.insert(json, {}, function(err, count){
                        if (err)
                            console.log("Error: "+err)
                        callback(err, json, count)
                    })
                }
            })
    },
    read_data: function(collection, where, callback) {
        //Wrapper for mongo find. Calls back with (err, data, count) 
        //data will be an object if there's only one result, otherwise it will be an array 
        connect(null, function(newDb) {
            db.collection(collection).find(where).toArray(function(err, data) {
                if (err || !data) {
                    callback(err, null, 0)
                } else {
                    //call-back data ;)
                    var cbd;
                    switch (data.length) {
                        case 0:
                            cbd = null
                            break
                        case 1:
                            cbd = data[0]
                            break
                        default:
                            cbd = data
                    }
                    callback(err, data, data.length)
                }    
            })
        })
    },
    delete_data: function(collection, where, callback) {
        console.log("Not implemented!")
        callback(0)
    }
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

