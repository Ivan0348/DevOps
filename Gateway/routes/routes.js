const express = require('express');
const Handler = require('../middleware/locationHandler');
const authenticateJWT = require('../middleware/authenticateJWT');
const correctJsonSyntax = require('../middleware/JsonSyntaxCheck.js');
const cors = require('cors');
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


app.use(cors());
app.use(express.json());
app.use(correctJsonSyntax);


app.post('/api/login', Handler.loginService);
app.post('/api/token', Handler.loginService);
app.post('/api/register', Handler.registerService);
app.delete('/api/logout', authenticateJWT, Handler.loginService);


module.exports = app;
