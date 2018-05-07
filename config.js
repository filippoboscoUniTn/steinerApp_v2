module.exports = {
    mongoDB: {
        default: {
            db: 'steinerAPI_dev',
            port: 27017,
            host:'localhost'
        },
        development: {
            db:'steinerAPI_dev'
        },
        testing:{
            db: 'steinerAPI_testing'
        },
        production: {
            db: 'steinerAPI_production',
        }
    },
    sessionStore:{
        default:{
            collection:'Session',
            secret:'steinerAppSecret',
            maxAge:3600000 //maxAge for cookies in ms -> 3600000 = 1 hour
        },
        development:{

        },
        testing:{

        },
        production:{

        }
    },
    various:{
        default:{
           port:5000
        },
        development:{

        },
        testing:{

        },
        production:{

        }
    }
};