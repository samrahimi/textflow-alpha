var rules = require('../data/rules.json')

//When rule is applicable, format the content in client-friendly way
var formatSingleResult = function(rule_definition) {
    rule_definition["rule_id"].pop()
    rule_definition["test"].pop()
    return rule_definition
}
var processRules = function(raw_scores, ruleset_id) {
    var output = []
    var RAWSCORE = raw_scores //The following code is hacky as fuck
    var ruleset = rules[ruleset_id] 
    for (var r in ruleset) {
        //Test each rule for truthiness against the scores 
        if (eval(ruleset[r].test) == true)
            output.push(formatSingleResult(ruleset[r]))
    }
    return output
}

module.exports = {
    analyze: function(message, raw_scores, context, callback) {
        var results = {
            message: message,
            context: context,
            raw_scores: raw_scores,
            analysis: []
        }
        //A context can have as many rulesets as needed. 
        //Todo: nested rulesets 
        for (var r in context.rulesets) {
            results.analysis.push(processRules(raw_scores, context.rulesets[r]))
        }

        //Right now we could do this synchronous, 
        //But soon we'll be hitting databases with all that involves
        callback(results)
    }
}
