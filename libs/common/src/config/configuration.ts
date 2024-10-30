export default () => ({
    env_path: {
        prod: '.env',
        dev: '.env.dev',
        local: '.env.local'
    },
    typeorm: {
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: false,
        bigNumberStrings: false
    },
    redis: {
        config: {
            url: process.env.REDIS_URL,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD
        }
    },
    secret: {
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
    }
});
