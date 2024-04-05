const messageBus = require('./utils/messageBus.js');
const loginQueue = 'add_user_to_login_queue';

const {User} = require('./dbModels/dbSchemas.js');

async function callback(message) {
    try {
        const jsonObject = JSON.parse(message);

        const user = new User({
            username: jsonObject.username,
            passwordHash: jsonObject.passwordHash,
            email: jsonObject.email,
            role: jsonObject.role,
            isVerified: jsonObject.isVerified,
            verifyToken: jsonObject.verifyToken
        });

        await user.save();
    } catch (error) {
        console.error('Error processing message:', error);
    }
}

module.exports = {messageBus, callback, loginQueue};
