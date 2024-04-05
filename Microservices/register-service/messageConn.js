const messageBus = require('./utils/messageBus.js');

const loginQueue = 'add_user_to_login_queue';

function publishMessageForLogin(JSON_message) {
    messageBus.publishMessage(loginQueue, JSON_message, true);
}

module.exports = {messageBus, publishMessageForLogin};
