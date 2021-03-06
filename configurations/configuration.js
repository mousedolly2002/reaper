module.exports = {
    "port": 3000,
    "httpsPort": 4000,
    "socketIoPort": 5000,
    "mongo": {
        "mongoUrl": "mongodb://127.0.0.1/reaper"
    },
    "jwt": {
        "jwtAlgorithm": "HS256",
        "tokenSecret": "reaper",
        "expiresIn": "7d",
        "credentialsRequired": true
    }
};
