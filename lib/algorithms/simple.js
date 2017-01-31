/* MVP Algo based on Melanie's revised UX. I have a feeling this is the horn of the Unicorn
   Doesn't fuck around - takes a message and some rules, and spits out the analysis. No callbacks required */
module.exports = {
    analyze: function(scored_message, context_rules) {
        //Fuck the database. Get the info before. Add the alerts. Return.
        //Requires message to have raw_scores attached and context_rules to be pre-loaded
        var d = new Date()

        //Breaking out the date will make it way more efficient 
        //to aggregate results by hour / day / month / year 
        var results = {
            message_id: message._id,
            context_id: context._id,
            context_name: context.context_name,
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
    }
}
