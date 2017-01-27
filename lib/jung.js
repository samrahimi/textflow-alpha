var mongo = require('../adaptors/mongo-storage')


//When rule is applicable, format the content in client-friendly way
var formatSingleResult = function(rule_definition) {
    rule_definition["rule_id"].pop()
    rule_definition["test"].pop()
    return rule_definition
}

var processRules = function(raw_scores, ruleset_id, rule_type) {
    var output = {type: rule_type,
                  notifications: []}

    //If rule_type is specified (e.g patterns) then only thes rules will be tested against the data
    var ruleset = rules[ruleset_id][rule_type]
    for (var r in ruleset) {
        //Test each rule for truthiness against the scores
        //Note that scores must be in a variable named raw_scores
        //Hacky as hell lol 
        if (eval(ruleset[r].test) == true)
            output.notifications.push(formatSingleResult(ruleset[r]))
    }
    return output
}
//Gets the summary advice based on aggregate_score and subscores
//Only one advice per request will be returned. 
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
    analyze: function(message, raw_scores, context, callback) {
        var d = new Date()

        //Breaking out the date will make it way more efficient 
        //to aggregate results by hour / day / month / year 
        var results = {
            message: message,
            context_id: context.id,
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
                results.aggregate_score=getAggregateScore(raw_scores, ruleset)
                results.advice = getOverallAdvice(raw_scores, results.aggregate_score, ruleset)
                //and there we have it. a biased feedback loop of emotional 
                //self awareness. if it causes some cognitive dissonance, good. 
                callback(results)
            })
        })        
    }
}

/* Old way - no grouping - see freud.js
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

