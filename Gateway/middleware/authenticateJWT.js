const jwt = require('jsonwebtoken');

const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

function authenticateJWT(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({error: 'Invalid token'});
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({error: 'Unauthorized'});
    }
}

module.exports = authenticateJWT;