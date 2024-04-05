const app = require('./routes');
const {config} = require('./config.js');
const ampq = require('amqplib');
const {messageBus, callback, loginQueue} = require('./messageConn');
const connectToDb = require('./utils/makeDBConn');
const seeder = require('./dbModels/dbSeeder');

const port = config.LOGIN_PORT;

const canStart = {};

function checkCanStart() {
    app.use((req, res) => {
        res.status(404).send("Not Found");
    });

    if (canStart.conToMessageBus && canStart.conToDBConn) {
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    }
}

messageBus.connect(ampq, config.RABBITMQ_URL).then(() => {
    messageBus.consumeMessage(loginQueue, callback);
    canStart.conToMessageBus = true;
    checkCanStart();
}).catch((error) => {
    console.error('Error connecting to bus:', error);
});

connectToDb(config.MONGODB_LOGIN).then(() => {
    canStart.conToDBConn = true;
    seeder().then(() => {
        checkCanStart();
    });
}).catch((error) => {
    console.error('Error connecting to db:', error);
});
