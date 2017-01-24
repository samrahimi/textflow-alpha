var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var engine = require('../adaptors/'+config.adaptors.engine)
var storage = require('../adaptors/'+config.adaptors.storage.adaptor)
var slackbot = require('../lib/slackbot')
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
    if (req.body.user_name == config.slack.bot_name)
    {
        res.send({status:'ok', processed:false, reason:'Bot Message'})
    } 
    else
    {
        var message = req.body.text
        var context =   {
                        ruleset_id: 'business',
                        algorithm: 'jung'
                }
        var username = req.body.user_name


        console.log("Message: "+message)
        console.log("User: " +username)

        /* Initialize the low level parsing and emotion analysis engine with credentials */ 
        engine.init(config.credentials[config.adaptors.engine])
        /* Request the low level analysis (note: we may want to group messages and / or cache them, because this request costs a penny each time) */
        engine.evaluate(message, function(msg, raw_scores){
            var module_name = context.algorithm || 'jung' 
            var ai_module = require('../lib/'+module_name)
            ai_module.analyze(msg, raw_scores, context, function(results) {
            
            /* Results will be used in the future for statistical analysis and ML / pattern recognition */
            storage.write_data_async(results, function(err) {
                if (err) console.log(err.toString())
            })
            /* Return results to client */
            results.api_version = config.version //for debugging

            /* This needs to be refactored into a rules DB */
            /* But it's a nice async way of responding */
            if (results.raw_scores.anger.score > 0.5 || results.raw_scores.disgust.score > 0.5) {
                slackbot.sendMessage("Hey there. Take a deep breath. You're getting a little heated.", "@"+username)
            }

            if (results.aggregate_score < 50) {
                slackbot.sendMessage(results.advice.advice, "@"+username)
            }

            
             res.send({status:'ok'}) //So slack knows we responded. 
            })
        })
    }
});

module.exports = router;