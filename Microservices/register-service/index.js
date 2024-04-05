const app = require('./routes');
const ampq = require('amqplib');
const {messageBus} = require('./messageConn');
const connectToDb = require('./utils/makeDBConn');
const seeder = require('./dbModels/dbSeeder');

const port = process.env.REGISTRATIONPORT;
const canStart = {};

function checkCanStart() {
    app.use((req, res, next) => {
        res.status(404).send("Not Found");
    });
    if (canStart.conToMessageBus && canStart.conToDBConn) {
        app.listen(port, () => {
            console.log(`Server is listening at http://localhost:${port}`);
        });
    }
}

messageBus.connect(ampq).then(() => {
    canStart.conToMessageBus = true;
    checkCanStart();
});

connectToDb(process.env.MONGODBREGISTRATION).then(() => {
    canStart.conToDBConn = true;
    seeder().then(() => {
        checkCanStart();
    });
});
