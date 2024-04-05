const Mongoose = require('mongoose');

const refreshTokenSchema = new Mongoose.Schema({
    username: {type: String, unique: true, required: true},
    refreshToken: {type: String, required: true},
})

const refreshTokens = Mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = refreshTokens;