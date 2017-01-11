var rules = require('../data/rules.json')

//When rule is applicable, format the content in client-friendly way
var formatSingleResult = function(rule_definition) {
    rule_definition["rule_id"].pop()
    rule_definition["test"].pop()
    return rule_definition
}
var processRules = function(raw_scores, ruleset_id) {
    var output = []
    var ruleset = rules[ruleset_id] 
    for (var r in ruleset) {
        //Test each rule for truthiness against the scores
        //Note that scores must be in a variable named raw_scores
        //Hacky as hell lol 
        if (eval(ruleset[r].test) == true)
            output.push(formatSingleResult(ruleset[r]))
    }
    return output
}
//
var getOverallAdvice = function(aggregate_score, ruleset_id)
{
    for (var a in rules[ruleset_id].advice) {
        if (eval("("+rules[ruleset_id].advice[a].test+")") == true) {
            return (
            {
                title: rules[ruleset_id].advice[a].summary,
                advice: rules[ruleset_id].advice[a].details
            })
        }
    }
}
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
        //context.ruleset should be a key for one of the rulesets in rules.json  
        results.aggregate_score=getAggregateScore(raw_scores, context.ruleset_id)
        results.advice = getOverallAdvice(results.
aggregate_score, context.ruleset_id)
        //results.score_details= processRules(raw_scores, context.ruleset_id)
        
        //and there we have it. a biased feedback loop of emotional 
        //self awareness. if it causes some cognitive dissonance, good. 
        callback(results)
    }
}
