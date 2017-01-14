var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var engine = require('../adaptors/'+config.adaptors.engine)
var storage = require('../adaptors/'+config.adaptors.storage.adaptor)
var jung = require('../lib/jung')

/* Data ingestion and analysis endpont
 * Input parameters should be sent as a JSON object in the POST body (Content-type: application/json)
 * 
 * Input:
 * message: 'a chunk of text or HTML, in any language. max length 128kb'
 * context: {
 *  user_id: unique user identifier in the scope of the client app (could be IMEI, facebook id, or whatever)
 *  client_id: id of the calling application
 *  ruleset_id: id of the ruleset 
 * }
 * 
 * Output:
 * a structured JSON analysis of a message. See README.md */

router.post('/', function(req, res, next) {
  var message = req.body.message
  var context = req.body.context

  console.log("Message: "+message)
  console.log("Context: " +context)
  /* Initialize the AI engine with credentials */ 
  engine.init(config.credentials[config.adaptors.engine])
  /* Request text analysis from AI engine (offsite) */
  engine.evaluate(message, function(msg, raw_scores){
    jung.analyze(msg, raw_scores, context, function(results) {
      
      /* Results will be used in the future for statistical analysis and ML / pattern recognition */
      storage.write_data_async(results, function(err) {
        if (err) console.log(err.toString())
      })
      /* Return results to client */
      res.send(results)   //Full result set for the front end. 
    })
  })
});

module.exports = router;
