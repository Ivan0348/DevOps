const User = require('./user_model.js');
const bcrypt = require('bcrypt');

async function createUser(user) {
    try {
        let newUser = new User(user);
        await newUser.save();
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash;
    } catch (error) {
        console.error('Error hashing password:', error);
    }
}

async function dbSeeder() {
    if (!await User.findOne({username: 'owner'})) {
        await createUser({
            username: 'owner',
            passwordHash: await hashPassword('password'),
            email: 'owner@owner',
            role: 'owner',
            isVerified: true,
            verifyToken: 1234
        });
    }

    if (!await User.findOne({username: 'participant'})) {
        await createUser({
            username: 'participant',
            passwordHash: await hashPassword('password'),
            email: 'participant@participant',
            role: 'participant',
            isVerified: false,
            verifyToken: 4321
        });
    }
    console.log('Database seeded');
}

module.exports = dbSeeder;