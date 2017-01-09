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
  tone_analyzer.tone({ text: message},
    function(err, tone) {
      if (err)
        console.log(err);
      else
        console.log(JSON.stringify(tone, null, 2));
        callback(message, tone)
  });
}

}

