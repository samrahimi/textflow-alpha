module.exports = {
    version: '0.2-ALPHA',
    host: 'default',
    port: 3000,
    adaptors: {
        engine: 'watson_tone',
        storage: {adaptor: 'offline-storage'}        
    },
    credentials: {
            watson_tone: {
                "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
                "password": "luBU7QYYbcOv",
                "username": "2441e90e-0bf9-4ab8-83c7-60dfe0f03218"
            }
    },
    user: {
        contexts: [
                {id:'dating', title:'Dating and Relationships'},
                {id:'business', title:'Business Communication'}
        ],
        preferred_context_id: 'business'
    },
    getString: function(key) {
        return JSON.stringify(this[key])
    }
}