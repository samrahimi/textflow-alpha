module.exports = {
    host: 'hostname or ip',
    port: 80,
    adaptors: {
    engine: 'watson_tone',        
    structuredStorage : {
            adaptor: 'mongo',
            connection: 'mongo connection string goes here'
        },
        rawDataStore: {
            adaptor: 'mongo (or better yet set up prediction.io)',
            connection: ''
        }
    },
    credentials: {
        watson_tone: {
            "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
            "password": "luBU7QYYbcOv",
            "username": "2441e90e-0bf9-4ab8-83c7-60dfe0f03218"
        }
    }
}