/* The original weighted algorithm. For comparing against Jung (the latest code)
   Use "engine":"freud" in the request JSON to use this, otherwise Jung will be default */

var rules = require('../data/rules/freud.json')

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
var getOverallAdvice = function(raw_scores, aggregate_score, ruleset_id)
{
    var adv = rules[ruleset_id].overall_advice
    for (var a in adv) {
        if (eval("("+adv[a].test+")") == true) {
            return (
            {
                title: adv[a].summary,
                advice: adv[a].details,
                suggested_color: adv[a].graph_color
            })
        }
    }
}


/* Looks good on paper, but reversion to the mean is a problem. 
   We could define inflection points and project the results onto a 
   curve, but really, who has time? */
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
} 

module.exports = {
    analyze: function(message, raw_scores, context, callback) {
        var results = {
            message: message,
            context: context,
            raw_scores: raw_scores,
        }        
        //context.ruleset_id should be one of the available keys in rules.json (e.g. dating.self)  
        results.aggregate_score=getAggregateScore(raw_scores, context.ruleset_id)
        results.advice = getOverallAdvice(raw_scores, results.
aggregate_score, context.ruleset_id)
        
        //and there we have it. a biased feedback loop of emotional 
        //self awareness. if it causes some cognitive dissonance, good. 
        callback(results)
    }
}
