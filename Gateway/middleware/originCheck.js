const jwt = require('jsonwebtoken');

const gatewaySecret = process.env.GATEWAY_SECRET;
const gatewayLocation = process.env.GATEWAYLOCATION;

function makeJwtOriginCheck(timeout) {
    return jwt.sign({gatewayLocation},
        gatewaySecret,
        {expiresIn: timeout + 100});
}

module.exports = makeJwtOriginCheck;