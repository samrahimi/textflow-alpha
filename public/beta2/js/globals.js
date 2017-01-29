//because I don't have time to do it properly.

var $JS_GLOBALS = {
    keyValueToArray: function(obj) {
        var x = []; for (var k in obj) {obj[k].key = k; x.push(obj[k])} return x
    },
    current_context: {
        source_id: 'webapp',
        user_id: "UNKNOWN",
    }
}