const jwt = require('jsonwebtoken');
const {config} = require('../config.js');

const gatewaySecret = config.GATEWAY_SECRET;
const gatewayLocation = config.GATEWAYLOCATION;

const checkOrigin = (req, res, next) => {
    const origin = req.headers.gatewayorigin;

    if (!origin) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    jwt.verify(origin, gatewaySecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Invalid token'});
        }
        if (decoded.gatewayLocation !== gatewayLocation) {
            return res.status(401).json({error: 'Invalid origin'});
        }
        next();
    });
};

module.exports = checkOrigin;