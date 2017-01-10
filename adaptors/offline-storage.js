/* Stub for async storage writer */
module.exports = {
    write_data_async: function(json, callback) {
        var err
        console.log("Warning! Using dummy storage provider. Data not saved.")
        if (typeof callback === 'function')
            callback(err)
    }
}