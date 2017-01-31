module.exports = {
    version: '0.7-ALPHA-STABLE',
    host: 'default',
    port: 4000,
    adaptors: {
        engine: 'watson_tone',
        storage: {adaptor: 'mongo_storage'}        
    },
    credentials: {
            watson_tone: {
                "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
                "password": "luBU7QYYbcOv",
                "username": "2441e90e-0bf9-4ab8-83c7-60dfe0f03218"
            },
            mongodb: 'mongodb://dumb:bitch@ds131729.mlab.com:31729/textflow'
    },
    user: {
        preferred_context_id: 'simple'
    },
    mappings:{
        anger:{group:0, display_name:null,category:'primary_emotion'},
        joy:{group:0, display_name:null,category:'primary_emotion'},
        sadness:{group:0, display_name:null,category:'primary_emotion'},
        fear:{group:0, display_name:null,category:'primary_emotion'},
        anger:{group:0, display_name:null,category:'primary_emotion'},
        disgust:{group:0, display_name:null, category:'primary_emotion'},
        extraversion: {group:1, display_name:'outgoing', opposite:'shy', category:'personality'},
        agreeableness: {group:1, display_name:'cooperative', opposite: 'stubborn', category:'personality'},
        openness: {group:1, display_name:'open', opposite: 'closed', category:'personality'},
        conscientiousness: {group:1, display_name:'detail oriented', opposite:'careless', category:'personality'},
        tentative: {group:1, display_name:'lacking in self-cofidence', category:'emotional_health'},
        confident: {group:1, display_name:'confident', category:'emotional_health'},
        emotional_range: {group:1, display_name:'sensitive', opposite:'resilient', category: 'emotional_health'},
        analytical: {group:1, display_name:'analytical', category: 'practical'},
        contempt: {group:2, display_name:'contemptuous', category:'relationships'},
        stonewalling: {group:2, display_name: 'stonewalling', opposite: 'open-hearted', category:'relationships'},
    },
    mapping_groups: [
        {title: "Your emotions", svg: "emotions.svg.txt"},
        {title: "How others see you", svg: "personality.svg.txt"},
        {title: "How others see you", svg: "personality.svg.txt"}
    ],
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