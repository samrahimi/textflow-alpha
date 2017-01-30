var credentials;
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var tone_analyzer

module.exports = {
init: function(credentials) {
  try
  {
    tone_analyzer = new ToneAnalyzerV3({
      username: credentials.username,
      password: credentials.password,
      version_date: '2016-05-19'
    });
  }
  catch (ex) {
    return new Error(ex.toString())
  }
},
evaluate: function(message_text, callback) {
  tone_analyzer.tone({ text: message_text, sentences: 0},
    function(err, tone) {
      if (err)
        console.log(err);
      else {
        //console.log(JSON.stringify(tone, null, 2));

        //Fix the most dreadful example of JSON object composition, as sold 
        //to us from Big Blue. I should charge them for wasting my time LOL. 
        var rawToneScores = {}
        for (var c in tone.document_tone.tone_categories) {
          var categoryName = tone.document_tone.tone_categories[c].category_name.split(' ')[0].toLowerCase()
          for (var t in tone.document_tone.tone_categories[c].tones) {
            var el = tone.document_tone.tone_categories[c].tones[t]
            rawToneScores[el.tone_id.replace('_big5','')] = {
              score: el.score,
              friendly_name: el.tone_name.replace('_big5', ''),
              category: categoryName,
            }
          }
        }
        console.log(JSON.stringify(rawToneScores, null, 2));
        callback(rawToneScores)
      }
  });
}

}

