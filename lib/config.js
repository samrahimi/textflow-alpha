module.exports = {
    version: '0.4-ALPHA-2',
    host: 'default',
    port: 80,
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
                {id:'dating', title:'Personal'},
                {id:'business', title:'Business'}
        ],
        preferred_context_id: 'dating'
    },
    slack: {
        admin_token: 'xoxp-129898488176-130682631748-131306250854-716cb6cbf92886000a4c6972a4a1d30d',
        admin: 'sam',
        bot: 'anger_manager',
        bot_token: 'xoxb-130715568645-uAc2GHV3jBc6WjMkFsQzaBw7',
        incoming_webhook:'https://hooks.slack.com/services/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',
        app: {
            client_id: '129898488176.131323910567',
            client_secret: '9e892b32973971968de4084b8e73c935'
        }
    },
    getString: function(key) {
        return JSON.stringify(this[key])
    }
}