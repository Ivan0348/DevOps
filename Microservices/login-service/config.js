let config;

if (process.env.JEST_WORKER_ID !== undefined) {
    config = {
        ACCESS_TOKEN_SECRET: 'test-access-token-secret',
        ACCESS_TOKEN_EXPIRES: '1h',
        REFRESH_TOKEN_SECRET: 'test-refresh-token-secret',
        LOGIN_PORT: '3000',
        MONGODB_LOGIN: 'mongodb://localhost:27017/login-service-test',
        RABBITMQ_URL: 'amqp://test-rabbitmq',
        GATEWAY_SECRET: 'test-gateway-secret',
        GATEWAYLOCATION: 'http://localhost:5000',
    };
} else {
    config = {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        LOGIN_PORT: process.env.LOGINPORT,
        MONGODB_LOGIN: process.env.MONGODBLOGIN,
        RABBITMQ_URL: process.env.RABBITMQ_URL,
        GATEWAY_SECRET: process.env.GATEWAY_SECRET,
        GATEWAYLOCATION: process.env.GATEWAYLOCATION,

    };
}

module.exports = {config};