const express = require('express');
const bodyParser = require('body-parser');
const {login, logout, token} = require('./services_logic.js');
// const checkOrigin = require('./middleware/checkOrigin.js');
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
// app.use(checkOrigin);

app.use(bodyParser.json());

app.post('/api/login', login);

app.post('/api/token', token);

app.delete('/api/logout', logout);

module.exports = app;
