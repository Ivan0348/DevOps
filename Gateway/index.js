const app = require("./routes/routes.js");
const YAML = require("yamljs");
const swaggerUI = require('swagger-ui-express');
const {SwaggerTheme, SwaggerThemeNameEnum} = require('swagger-themes');
const swaggerJSDocs = YAML.load("./apiDoc.yaml");

const theme = new SwaggerTheme();
const options = {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.GRUVBOX)
};

app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs, options));

app.get('/', (req, res) => {
    res.send('Welkom bij de Gateway! v1');
});

// catch 404 and forward a correct error message
app.use((req, res, next) => {
    res.status(404).send("Not Found");
});

const port = process.env.GATEWAYPORT;
app.listen(port, () => console.log(`Gateway is running on http://localhost:${port}`));