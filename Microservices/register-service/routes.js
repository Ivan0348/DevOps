const express = require('express');
const bodyParser = require('body-parser');
const {register} = require('./services_logic.js');
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

app.post('/api/register', register);

module.exports = app;
