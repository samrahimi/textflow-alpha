var linq = require('../linq')

module.exports = {
    totalConfidence: function(confidence, tentative) {
        return confidence - tentative
    },
    jsLinq: function() {
        Enumerable.range(1, 10).select(function (x) {
            return x * x;
        });
    }
}