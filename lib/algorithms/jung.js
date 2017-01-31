/* NOT STABLE. DO NOT USE */
var mongo = require('../../adaptors/mongo_storage')


//When rule is applicable, format the content in client-friendly way
var formatSingleResult = function(rule_definition) {
    rule_definition["rule_id"].pop()
    rule_definition["test"].pop()
    return rule_definition
}


//Checks the raw data for conditions that are hypothesized to represent specific patterns of behavior 
//or raise concerns that would not be raised by the scores alone
//The patterns (as shipped with Beta 1) are loosely based on psychological research...
//They can be easily validated by "was this helpful" / "does this make sense" style of feedback request
//for each individual pattern identified.
//
//BTW. These guys are a good candidate for true ML. All of the rules are simple functions of raw scores with arbitrary coefficients
//
//It would be easy to build a module that sets up AB tests by shifting the coefficients 
//and comparing the accuracy via "was this helpful" or other metrics. 
//but not today. We need to launch lol
var processPatterns = function(raw_scores, ruleset) {
    var output =[]

    //If rule_type is specified (e.g patterns) then only thes rules will be tested against the data
    var rules = ruleset.patterns
    for (var r in rules) {
        //Eval-ing strings from the DB. Love AI. Breaks all the rules ;)
        if (eval(rules[r].test) == true)
            output.push(formatSingleResult(rules[r]))
    }
    return output
}
//Gets the summary advice based on aggregate_score and subscores
//Only the most pertinent advice per request will be returned. 
var getOverallAdvice = function(raw_scores, aggregate_score, ruleset)
{
    var adv = ruleset.overall_advice
    for (var a in adv) {
        if (eval("("+adv[a].test+")") == true) {
            return (
            {
                title: adv[a].summary,
                advice: adv[a].details,
                suggested_color: adv[a].graph_color
            })
        }}
}


var getAggregateScore = function(raw_scores, ruleset) {
   var pos = eval("("+ruleset.weights.positive+")")
   var neg = eval("("+ruleset.weights.negative+")")
   var aggregate_raw = pos - neg
   return ((aggregate_raw + 1) / 2 * 100)
}

module.exports = {
    analyze: function(message_object, raw_scores, callback) {
        var d = new Date()
        var message = message_object.message
        var context = message_object.context

        //Breaking out the date will make it way more efficient 
        //to aggregate results by hour / day / month / year 
        var results = {
            message_id: message_object._id,
            context_id: context.id,
            user_id: context.user_id || null,
            group_id: context.group_id || null,
            thread_id: context.thread_id || null,
            source_id: context.source_id || null,
            raw_scores: raw_scores,
            raw_date: d,
            absolute_day: parseInt(d.valueOf() / 8640000),
            hour: parseInt(d.getHours()),
            day_of_week: parseInt(d.getDay()),
            month: parseInt(d.getMonth()),
            year: parseInt(d.getFullYear())
        }

        mongo.DB(function(db) {
                db.collection('ContextRules').find({key:context.id}).toArray(function(err, data) {
                var ruleset= data[0]
                results.result_type = 'detailed'                 //As opposed to aggregate score only 'simple'
                results.aggregate_score=getAggregateScore(raw_scores, ruleset)
                results.advice = getOverallAdvice(raw_scores, results.aggregate_score, ruleset)
                results.alerts = processPatterns(raw_scores, ruleset)
                //Is this message worth notifying the user about
                results.flagged = (results.alerts.count > 0 || results.aggregate_score < 50)
                //Maybe we can define patterns that selectively fuck with trump supporters...
                //and make them lose their minds. They've been doing it to us for years.
                callback(results)
            })
        })        
    }
}

/* The old algorithm - assigning unique weights to each attribute
    Didn't work as reliably 
    Maybe I should just use sentiment-analyzer

var getAggregateScore = function(raw_scores, ruleset_id) {
    //each ruleset should have a list of the attributes being considered in 
    //the calculation, and weighted such that: 
    
    //given ruleset weights W
    //reduced WTA-compatible output (where 0 <= A[k] <= 1]):
    //
    //SUM(W[k]) := 0 and
    //-1 <= SUM(W[k] * A[k]) <= 1 for any values of A
    //
    //To convert to percent:
    //(SUM(W[k]*A[k])+1) / 2 
     
    var aggregate_raw = 0; //Will hold the raw score (see line 30)

    var weights = rules[ruleset_id].weights 
    for (var r in raw_scores) {
        aggregate_raw += (raw_scores[r].score * weights[r])
    }
    return ((aggregate_raw + 1) / 2 * 100)
} */

