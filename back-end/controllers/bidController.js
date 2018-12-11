const Bid = require('../models/bids');
const bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');


exports.create = (req, res, next) => {

    var bid = new Bid({
        userId: req.userId,
        bidPrice: req.body.bidPrice,
        itemId: req.body.itemId,
        time: req.body.time
    });

    amqp.connect('amqp://localhost', function (err, conn) {
        conn.createChannel(function (err, channel) {
            var q = 'Online-Auction';

            channel.assertQueue(q, {
                durable: false
            });
            var obj = JSON.stringify(bid);
            channel.sendToQueue(q, Buffer.from(obj));

            return res.status(200).json({
                status: "success"
            })
        });
        setTimeout(function () {
            conn.close();
            // process.exit(0)
        }, 500);
    });

}

exports.getBidHistoryOfItem = (req, res, next) => {

    Bid.find({
        itemId: req.params.itemId
    }, (err, bids) => {
        if (err) return res.status(404).json({
            status: "failed",
            message: "error getting Bid history of an item",
            error: [{
                message: "Bid History in Mongo has errors"
            }]
        })

        if (!bids) return res.status(404).json({
            status: "failed",
            message: "Item Details doesn't exist",
            error: [{
                message: "No Data found"
            }]
        })
        console.log("Bids ", bids);
        return res.status(200).json({
            status: "success",
            message: "Bids Found",
            error: [],
            data: bids
        });
    });
}