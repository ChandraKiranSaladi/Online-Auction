const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');

const redis = require('redis');
const redisClient = redis.createClient();

const Bid = require("./models/bids");
const logger = require("./helper/log");

const mongooseURI = 'mongodb://localhost:27017/Online-Auction';

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

redisClient.on('error', function (err) {
    logger.error('Something went wrong while trying to communicating to Redis Server.\nMessage: ' + err);
});

mongoose.connect(mongooseURI, {
    useNewUrlParser: true
}).then(() => {
    logger.info("Connected to database at 27017");

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, channel) {
            var q = 'Online-Auction';

            channel.assertQueue(q, {
                durable: false
            });
            logger.info("Connected to RabbitMQ.\n[*] Waiting for messages in " + q + ". To exit press CTRL+C");
            channel.consume(q, function (msg) {
                var msg_str = msg.content.toString();

                var obj = JSON.parse(msg_str);
                var bid = Object.assign(new Bid, obj);
                logger.info("Received:\n" + bid);


                bid.save()
                    .then((doc) => {
                        logger.info("Saved Object to database. Object:\n" + doc);
                        channel.ack(msg);

                        redisClient.set('CurrentBidValue', JSON.stringify(bid));
                    })
                    .catch((err) => {
                        logger.error("Error failed to process bid: " + bid + "\n Error: " + err);
                        if (msg.fields.redelivered) {
                            logger.error("Seeing the packet second time.\nDroping packet from queue, unable to process. Packet:\n" + bid);
                            channel.reject(msg, false);
                        } else
                            channel.reject(msg, true);
                    });
            });
        });
    });
}).catch(() => {
    logger.error("Failed to connect to database, Shutting server down.");
});