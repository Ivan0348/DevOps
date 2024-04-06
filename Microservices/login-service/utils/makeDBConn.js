const mongoose = require('mongoose');

async function connectToDb(dbConnection) {
    let isConnected = false;

    while (!isConnected) {
        try {
            await mongoose.connect(dbConnection);
            isConnected = true;
        } catch (error) {
            console.error('\nFailed to connect to MongoDB, retrying...');
            /* eslint-disable no-undef */
            await new Promise((resolve) => setTimeout(resolve, 5000));
            /* eslint-enable no-undef */
        }
    }
    console.log(`\nConnected to ${dbConnection}`);
}

module.exports = connectToDb;