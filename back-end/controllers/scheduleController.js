const mongoose = require('mongoose');
const Schedule = require('../models/schedule');
const Item = require('../models/item');
const moment = require('moment');

exports.getAvailableSlots = (req, res, next) => {

    // TODO: Input: Date. Output: Slots. Set a default array with start and times. like 8am to 8:04am for 10 items. 
    // TODO: If already reserved, eliminate that slot and return back. 
    var def = [{
        start: "8:00:00",
        end: "8:00:59"
    }, {
        start: "8:01:00",
        end: "8:01:59"
    }, {
        start: "8:02:00",
        end: "8:02:59"
    }, {
        start: "8:03:00",
        end: "8:03:59"
    }];

    Schedule.findOne({
        date: req.params.id
    },
        (err, sched) => {
            if (err) return res.status(400).json({
                status: "failed",
                message: "error getting available slots",
                error: {
                    message: 'cannot access this date'
                }
            });
            if (!sched) {
                return res.status(200).json({
                    status: "success",
                    message: "Available slots",
                    data: def,
                    error: []
                });
            }
            return someReservedSlots(req.body.date);

        });

}

exports.getAll = (req, res, next) => {
    // get schedule of all items
    res.send("dummy");
};

exports.create = (req, res, next) => {
    // create schedule in db
    res.send("dummy");
};

exports.getById = (req, res, next) => {
    // get schedule of item by Id
    res.send("dummy");
};

exports.updateById = (req, res, next) => {
    // update schedule of an item
    res.send("dummy");
};

exports.deleteById = (req, res, next) => {
    // delete schedule of an item
    res.send("dummy");
};


// TODO: Test this endpoint
exports.getCurrentAuctionItem = (req, res, next) => {
    const now = new Date();
    const date = moment(now).format("YYYY-MM-DD");
    const today = new Date(moment(date));
    console.log("---" + today);


    // , time: { start: { $lte: time }, end: { $gte: time } }
    Item.find().then(
        items => {
            var item = null;
            for (var i = 0; i < items.length; i++) {
                var element = items[i];
                if (new Date(element.date) === today && new Date(element.time.start) <= now && new Date(element.time.end) >= now) {
                    item = element;
                    break;
                }
            }
            var message = "Item currently Auctioned";
            if (!item) message = "No item is auctioned currently"
            return res.status(200).json({
                status: "success",
                message: message,
                data: item,
                error: {}
            });
        }
    ).catch(
        err => {
            return res.status(404).json({
                status: "failed",
                message: "Failed to fetch Current Auction Item",
                error: {
                    message: "Failed to fetch Current Auction Item"
                }
            });
        }
    );
}


// Custom Functions 

function someReservedSlots(date) {

    var def = [{
        start: "8:00:00",
        end: "8:00:59"
    }, {
        start: "8:01:00",
        end: "8:01:59"
    }, {
        start: "8:02:00",
        end: "8:02:59"
    }, {
        start: "8:03:00",
        end: "8:03:59"
    }];

    Schedule.findOne({
        date: date
    },
        (err, sched) => {
            if (err) return res.status(400).json({
                status: "failed",
                message: "error getting available slots",
                error: {
                    message: 'cannot access this date'
                }
            });

            const itemsOnThisDay = sched.items;

            Item.find({
                // '_id' : { $in : items }
                '_id': items.itemId
            }, function (err, docs) {
                console.log("docs: " + docs);
                if (err) return res.status(400).json({
                    status: "failed",
                    message: "error getting available slots",
                    error: {
                        message: 'cannot access this date'
                    }
                });

                // docs.forEach( (item) => {
                //     const start = item.time.start;
                //     def.forEach( (temp) => {
                //         if(temp.start === start)
                //             delete temp;
                //     })
                // })

                for (var i = 0; i < docs.length; i++) {
                    const start = docs[i].time.start;

                    for (var j = 0; j < def.length; j++) {

                        if (def[j].start === start)
                            delete def[j];
                    }

                }

                return res.status(200).json({
                    status: "success",
                    message: "available slots",
                    error: [],
                    data: def
                });

            });
        });
}