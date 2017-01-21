var config = require('./config')
var request = require('request');

module.exports = {
    sendMessage: function(text, recipient)
    {
        var options = {
        uri: config.slack.incoming_webhook,
        method: 'POST',
            json: {
                "text": text,
                "channel": recipient
            }
        };

        request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("OK") // Print the shortened url.
        } else {
            console.log(error.toString())
        }
        });
    }
}