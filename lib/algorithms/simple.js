/* MVP Algo based on Melanie's revised UX. I have a feeling this is the horn of the Unicorn
   Doesn't fuck around - takes a message and some rules, and spits out the analysis. No callbacks required */
var getAggregateScore = function(raw_scores, weights) {
    var pos = eval("(" + weights.positive + ")")
    var neg = eval("(" + weights.negative + ")")
    var aggregate_raw = pos - neg
    return ((aggregate_raw + 1) / 2 * 100)
}


module.exports = {
    getAdvice: function(scored_message, context_rules) {
        var advice = {
            extreme: 0,
            high: 0,
            emotions: { summary: "" },
            persona: { summary: "" },
            intellect: {},
            warnings: [],
            algorithm: "intuition"
        }
        scored_message.user_scores.forEach(function(group) {
            advice.high += group.notes.length
            advice.extreme += group.notes.filter(x => x.push_notification && x.push_notification == true).length
        })
        if (advice.extreme >= 2 || advice.high >= 5 || scored_message.overall_score < context_rules.thresholds.alerts.low) {
            advice.warnings.push("Multiple items flagged. Please review carefully.")
        }
        if (scored_message.raw_scores["anger"].score > context_rules.thresholds.alerts.high) {
            advice.warnings.push("High levels of anger have been identified.")
        }
        if (scored_message.raw_scores["emotional_range"].score > context_rules.thresholds.alerts.high) {
            advice.warnings.push("Sensitivity is wonderful when expressed in the proper context.")
        }


        if (scored_message.raw_scores["sadness"].score > context_rules.thresholds.app_default.high) {
            advice.emotions.summary += "Everything will be okay... "
        } else {
            var u = scored_message.user_scores
            var exp1 = u[0].notes.length > 0
            var exp2 = u[1].notes.length > 0
            if (exp1)
                advice.emotions.summary += "Your message contains a significant amount of " + u[0].notes[0].display_name + ". "
            else
                advice.emotions.summary += "This message is not highly emotional in tone. "

            if (exp2)
                advice.persona.summary += "You may be perceived as " + u[1].notes[0].display_name + " based on the content of this message."
        }

        //Now here we just fuck around. These numbers are in no way scientific.
        var r = scored_message.raw_scores
        advice.emotions.score = 100 * (r.joy.score - Math.max(r.anger.score, r.disgust.score, r.fear.score, r.sadness.score) + 1) / 2
        advice.persona.score = (scored_message.overall_score + advice.emotions.score) / 2
        advice.intellect.score = (scored_message.overall_score * 3) - advice.emotions.score - advice.persona.score
        return advice
    },
    summarize: function(scored_message, context_rules) {
        //Returns a score from 1 to 100 based on a weighted average 
        if (context_rules.weights)
            return getAggregateScore(scored_message.raw_scores, context_rules.weights)
        else
            return 0
    },
    analyze: function(scored_message, context_rules) {

        //a detailed analysis


        //fun way of copying the header info for each group 
        //and adding on the results
        var results = context_rules.display.map((x, index) => ({
            title: x.title,
            svg: x.svg,
            group: index,
            notes: [],
            info: []
        }))

        //this to make code more readable
        //index keys, scores by themselves
        //mapping rules, and thresholds
        var emo_names = Object.keys(scored_message.raw_scores)
            //scores and mappings are both keyed on name. for Now
            //we should make it uuid before someone fucks up lol
        var scores = scored_message.raw_scores //keyed by emotion name
        var mappings = context_rules.mappings
            //thresholds for displaying and/or sending a push to the user 
        var thresholds = context_rules.thresholds

        //Now go through the score for each
        //check if they break the rules
        //add them to the notes if so
        for (var i = 0; i < emo_names.length; i++) {
            var note = {} //To hold the incident report

            note.emotion = emo_names[i]
            note.display_name = emo_names[i]
            note.group = mappings[note.emotion].group
            note.score = scores[note.emotion].score
            note.category = mappings[note.emotion].category
            note.flagged = false

            //If opposite emotion, flip the score and the name here
            //Then we can just test for threshold high
            if (mappings[note.emotion].display_name) {
                if (mappings[note.emotion].opposite && note.score < thresholds.app_default.high) {
                    note.display_name = mappings[note.emotion].opposite
                    note.score = (1 - note.score) //Because low agreeableness is high bitch
                } else {
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

            /*
            if (note.score < thresholds.app_default.low && mappings[note.emotion].opposite) {
                note.push_notification = (note.score < thresholds.alerts.low)
                note.flagged = true
            } */

            if (note.flagged)
                results[note.group].notes.push(note)

            //All scores for the group go in here in case we want them later
            results[note.group].info.push(note)
        }

        //Sort results and return
        results.forEach(function(resultGroup) {
            if (resultGroup.notes.length >= 2) {
                resultGroup.notes.sort((a, b) => b.score - a.score)
            }
            resultGroup.info.sort((a, b) => b.score - a.score)
        })

        //Duh
        return results
    }
}