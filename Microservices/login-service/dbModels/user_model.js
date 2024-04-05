const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    username: {type: String, unique: true, required: true},
    passwordHash: {type: String, unique: true, required: true},
    email: {type: String, unique: false, required: true},
    role: {type: String, required: true},
    isVerified: {type: Boolean, required: true},
    verifyToken: {type: String, required: true}
})

const User = Mongoose.model('User', userSchema);
module.exports = User;