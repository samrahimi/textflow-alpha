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
evaluate: function(message, callback) {
  tone_analyzer.tone({ text: message, sentences: 0},
    function(err, tone) {
      if (err)
        console.log(err);
      else {
        //Simplify the data model
        var rawToneScores = {
          feels: tone.document_tone.tone_categories[0].tones,
          conviction: tone.document_tone.tone_categories[1].tones,
          persona: tone.document_tone.tone_categories[2].tones
        }
        console.log(JSON.stringify(rawToneScores, null, 2));
        callback(message, rawToneScores)
      }
  });
}

}

