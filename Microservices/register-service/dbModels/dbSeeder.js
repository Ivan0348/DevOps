const User = require('./user_model.js');

async function createUser(user) {
    try {
        let newUser = new User(user);
        await newUser.save();
    } catch (error) {
        console.log('Error creating user: ', error);
    }
}

async function dbSeeder() {
    if (!await User.findOne({username: 'owner'})) {
        await createUser({username: 'owner', email: process.env.TEST_MAIL});
    }

    if (!await User.findOne({username: 'participant'})) {
        await createUser({username: 'participant', email: 'test1' + process.env.TEST_MAIL});
    }
    console.log('Database seeded');
}

module.exports = dbSeeder;