const express = require('express');
const bodyParser = require('body-parser');
const {register} = require('./services_logic.js');
const promBundle = require('express-prom-bundle');
const metricMiddleware = promBundle({
    includePath: true,
    includeStatusCode: true,
    normalizePath: true,
    promClient: {
        collectDefaultMetrics: {}
    }
});

const YAML = require("yamljs");
const swaggerUI = require('swagger-ui-express');
const {SwaggerTheme, SwaggerThemeNameEnum} = require('swagger-themes');
const swaggerJSDocs = YAML.load("./apiDoc.yaml");
const theme = new SwaggerTheme();
const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.GRUVBOX)
};

const app = express();

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs, options));


app.use(metricMiddleware);

app.use(bodyParser.json());

app.post('/api/register', register);

module.exports = app;
