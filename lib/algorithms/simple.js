/* MVP Algo based on Melanie's revised UX. I have a feeling this is the horn of the Unicorn
   Doesn't fuck around - takes a message and some rules, and spits out the analysis. No callbacks required */
var getAggregateScore = function(raw_scores, weights) {
   var pos = eval("("+weights.positive+")")
   var neg = eval("("+weights.negative+")")
   var aggregate_raw = pos - neg
   return ((aggregate_raw + 1) / 2 * 100)
}


module.exports = {
    analyze: function(scored_message, context_rules) {
        
        //very simple: we have our thresholds indicating an emotion 
        //is present (and in certain cases if its opposite is present)
        //the thresholds and existence of opposites is defined in the 
        //context files with name "emotional_intelligence" passed in above
        //it would be easy to make a more complex rules files
        //and this would still work. we think. lol. 
        //
        //note that all results are translated regardless of score
        //this is so we can do fun shit like change the names 
        //and make charts


        //fun way of copying the header info for each group 
        //and adding on the results
        var results = context_rules.display.map((x, index) => ({
            title: x.title,
            svg: x.svg, 
            group: index,
            notes:[],
            info:[]
        })) 

        //this to make code more readable
        //index keys, scores by themselves
        //mapping rules, and thresholds
        var emo_names = Object.keys(scored_message.raw_scores)
        //scores and mappings are both keyed on name. for Now
        //we should make it uuid before someone fucks up lol
        var scores = scored_message.raw_scores //keyed by emotion name
        var mappings = context_rules.mappings
        var aggregate_score = getAggregateScore(scores, context_rules.weights)
        //thresholds for displaying and/or sending a push to the user 
        var thresholds = context_rules.thresholds

        //Now go through the score for each
        //check if they break the rules
        //add them to the notes if so
        for (var i = 0; i < emo_names.length; i++) {
            var note= {} //To hold the incident report

            note.emotion = emo_names[i]
            note.display_name = emo_names[i]
            note.group = mappings[note.emotion].group
            note.score = scores[note.emotion].score
            note.category = mappings[note.emotion].category
            note.flagged = false
            if (mappings[note.emotion].display_name) {
                if (mappings[note.emotion].opposite && note.score < 0.5) {
                    note.display_name = mappings[note.emotion].opposite
                } 
                else {
                    note.display_name = mappings[note.emotion].display_name
                }
            }
            //Flagging - we send a push if its REALLY high
            if (note.score > thresholds.app_default.high) {
                note.push_notification = (note.score > thresholds.alerts.high) 
                note.flagged = true
            }

            //We only flag low scores if an opposite emotion 
            //exists. Low openness = closed.
            if (note.score < thresholds.app_default.low && mappings[note.emotion].opposite) {
                note.push_notification = (note.score < thresholds.alerts.low) 
                note.flagged = true
                note.display_name = mappings[note.emotion].opposite
            }

            if (note.flagged)
                results[note.group].notes.push(note)
            
            //All scores for the group go in here in case we want them later
            results[note.group].info.push(note)
        }
        //Sort descending
        results[note.group].info.sort((a, b) => b.score - a.score)

        //Duh
        return results
    }
}
