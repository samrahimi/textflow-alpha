var db = require("../adaptors/mongo_storage")
var rules = require('./context_rules.json')

db.write_data("ContextRules", rules, function(err, results, count) {
  console.log("_id:"+ results._id),
  console.log("records written: "+count)  
})
