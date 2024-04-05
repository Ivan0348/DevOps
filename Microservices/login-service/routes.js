const express = require('express');
const bodyParser = require('body-parser');
const {login, logout, token, verifyAccount, getVerifyStatus} = require('./services_logic.js');
const promBundle = require('express-prom-bundle');
const metricMiddleware = promBundle({
    includePath: true,
    includeStatusCode: true,
    normalizePath: true,
    promClient: {
        collectDefaultMetrics: {}
    }
});

const app = express();
app.use(metricMiddleware);

app.use(bodyParser.json());

app.post('/api/login', login);

app.post('/api/token', token);

app.delete('/api/logout', logout);

app.patch('/api/verifyAccount', verifyAccount)

app.get('/api/getVerifyStatus', getVerifyStatus)

module.exports = app;
