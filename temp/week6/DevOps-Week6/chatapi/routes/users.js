var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/slow', function (req, res, next) {
    setTimeout(() => {
        res.send('Slowly respond with a resource');
    }, 3000);
});

module.exports = router;
