let DEFAULT_CONTEXT_NAME = "emotional_intelligence"
let DEFAULT_ALGORITHM = "simple"
let DEFAULT_APP_ID = "tijuana_sunrise"

//Main entry point for data ingestion, all sources - uses watson, mongo, and melanie's great new algorithm
//Depends on existence of compatible context in DB (context_name: 'emotional_intelligence')
var express = require('express');
var router = express.Router();
var config = require('../lib/config')
var storage = require('../adaptors/mongo_storage')
var ai_engine = require('../lib/ai/watson')
var rules_engine = require('../lib/algorithms/simple')

//Get a message by id
//Usually will be result.message_id -> message
router.get('/:message_id', function(req, res, next) {
    storage.read_data("RawMessages", { _id: req.params.message_id }, function(err, msg) {
        res.send(msg)
    })
})

router.post('/', function(req, res, next) {
    var d = new Date() //Time msg received


    //Part 1: Add metadata to the message so that it can be easily searched later
    //and so we can figure out which experiment was performed on it.
    var unscored = {
            text: req.body.text,
            algorithm: req.body.algorithm || DEFAULT_ALGORITHM,
            context_name: req.body.context_name || DEFAULT_CONTEXT_NAME,
            client_app_id: req.body.client_app_id || DEFAULT_APP_ID,
            culture: req.body.culture || 'en-us',
            user_id: req.body.user_id,
            thread_id: req.body.thread_id,
            user_is_sender: true,
            date: d,
            absolute_day: parseInt(d.valueOf() / 8640000),
            time_of_day: parseInt(d.getHours()),
            day_of_week: parseInt(d.getDay()),
            day_of_month: parseInt(d.getDate()),
            month: parseInt(d.getMonth()),
            year: parseInt(d.getFullYear())
        }
        //Save the message in an easy to retrieve way
    storage.write_data("RawMessages", unscored, function(err, full_message) {
        //Part 2: load the rules
        storage.read_data("ContextRules", { context_name: full_message.context_name },
            function(err, rulesContext) {
                //Part 3: get raw scores from watson for each of the 15 aspects of the psyche
                ai_engine.init(config.credentials.watson_tone)
                ai_engine.evaluate(full_message.text, function(raw_scores) {

                    //Part 4: Add the raw scores, then get the rules-based tips
                    full_message.raw_scores = raw_scores
                    full_message.user_scores = rules_engine.analyze(full_message, rulesContext)
                    full_message.overall_score = rules_engine.summarize(full_message, rulesContext)
                    full_message.advice = rules_engine.getAdvice(full_message, rulesContext)
                        //full_message.user_results = rules_engine.evaluateScores(raw_scores, rulesContext)  

                    //Part 5: Save it
                    var scored_message = full_message
                    scored_message.message_id = full_message._id
                    delete scored_message._id
                    delete scored_message.text

                    //Save the results - they're linked to messages by id
                    storage.write_data("Results", scored_message, function(err, saved_message) {
                        res.send(saved_message)
                    })
                })
            })
    })
})

module.exports = router;