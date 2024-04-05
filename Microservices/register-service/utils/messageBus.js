class MessageBus {
    constructor() {
        this.rabbitMQUrl = process.env.RABBITMQ_URL;
    }

    async connect(amqp) {
        this.amqp = amqp;
        while (!this.conn) {
            try {
                this.conn = await this.amqp.connect(this.rabbitMQUrl);
                this.channel = await this.conn.createChannel();
            } catch (error) {
                console.error('Failed to connect to RabbitMQ, retrying...');
                /* eslint-disable no-undef */
                await new Promise((resolve) => setTimeout(resolve, 5000));
                /* eslint-enable no-undef */
            }
        }
        console.log(`\nConnected to ${this.rabbitMQUrl}`);
    }

    async publishMessage(queue, JSONmessage, durable = false) {
        try {
            await this.channel.assertQueue(queue, {durable});
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(JSONmessage)));
            console.log("\nMessage sent to " + queue + ": " + JSONmessage);
        } catch (error) {
            console.error("Error sending message to " + queue + ": " + error);
        }
    }

    async consumeMessage(queue, callback) {
        try {
            await this.channel.assertQueue(queue, {durable: true});
            this.channel.consume(queue, (message) => {
                if (message !== null) {
                    console.log("\nReceived message from " + queue + " : " + message.content.toString() + '\n');
                    callback(message.content.toString());
                    this.channel.ack(message);
                }
            });
        } catch (error) {
            console.error("Error consuming message from queue ${queueName}: " + error);
        }
    }
}

let messageBus = new MessageBus();
module.exports = messageBus;