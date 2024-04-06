const jwt = require('jsonwebtoken');

const gatewaySecret = process.env.GATEWAY_SECRET;
const gatewayLocation = process.env.GATEWAYLOCATION;

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