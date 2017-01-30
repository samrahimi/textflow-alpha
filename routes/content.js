//Creation, scoring, and retrieval of text content being evaluated by the app. 
var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var engine = require('../lib/ai/watson')
var storage = require('../adaptors/mongo_storage')
//Dynamically load the AI library based on context when it is ready to be called: var jung = require('../lib/jung')

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
  var message_text = req.body.message
  var context_name = req.body.context_name
  message.context = context
  //Save message, so it has an _id
  storage.write_data('Messages', {message: message, context:context}, function(err, message_object) {
    console.log("new message id: "+message_object._id)
    console.log("context id: " +context.id)
    
    /* Initialize the low level parsing and emotion analysis engine with credentials */ 
    engine.init(config.credentials[config.adaptors.engine])
    /* Request the low level analysis (note: we may want to group messages and / or cache them, because this request costs a penny each time) */
    engine.evaluate(message_object.message, function(raw_scores){
      var ai_module = require('../lib/algorithms/jung')
      ai_module.analyze(message_object, raw_scores, function(results) {
        results.api_version = config.version //for debugging
        /* Save on a separate thread, no need for user to wait */
        storage.write_data("Scores", results, function(err) {
          if (err) console.log(err.toString())
        })
        /* Return results to client */
        res.send(results)   //everything the UI needs to mess wit yo mind ;)
      })
    })
  })

});

module.exports = router;
