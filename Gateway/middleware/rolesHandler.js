const jwt = require('jsonwebtoken');
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

const ownerRole = 'owner';
const participantRole = 'participant';

function checkRole(role, req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.status(401).json({error: 'Invalid token'});
            }

            if (decoded.role !== role) {
                return res.status(401).json({error: 'your role is not authorized to access this resource'});
            }

            next()
        });
    } else {
        return res.status(401).json({error: 'Unauthorized'});
    }
}

function roleIsOwner(req, res, next) {
    checkRole(ownerRole, req, res, next);
}

function roleIsParticipant(req, res, next) {
    checkRole(participantRole, req, res, next);
}


module.exports = {roleIsOwner, roleIsParticipant};