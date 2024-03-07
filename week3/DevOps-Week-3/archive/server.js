const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({extended: false}));

// Set up home route
app.get('/', (req, res) => {
    console.log('User entered home page')
    res.send('This is the homepage');
});
// Set up second page
app.get('/second', (req, res) => {
    console.log('User entered second page')
    res.send('This is the second page');
});

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});