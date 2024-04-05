const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, required: true}
})

const ExistingUser = Mongoose.model('ExistingUsers', userSchema);
module.exports = ExistingUser;