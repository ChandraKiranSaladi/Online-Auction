const mongoose = require('mongoose');
const Schedule = require('../models/schedule');
const Item = require('../models/item');
const moment = require('moment');
const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('connect', function () {
    console.log('Redis client connected');
});
redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

exports.getAvailableSlots = (req, res, next) => {

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
    // console.log(moment(req.params.date, "YYYYMMDD").toISOString());

    // console.log(new Date(moment.utc(moment(new Date()).format("YYYYMMDD"),"YYYYMMDD")));
    console.log(moment(req.params.date, "YYYYMMDD").toDate().toString());
    console.log(moment(req.params.date, "YYYYMMDD").toLocaleString());
    console.log(moment(req.params.date, "YYYYMMDD"));
    console.log(moment.utc(req.params.date, "YYYYMMDD"));
    console.log(moment.utc(req.params.date, "YYYYMMDD").toString());

    Schedule.findOne({
            date: {
                // $eq: new Date(moment.utc(req.params.date, "YYYYMMDD"))
                $eq: moment(req.params.date, "YYYYMMDD")
            }
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
            return someReservedSlots(res, req.params.date);

        });

}

exports.getAll = (req, res, next) => {
    // get schedule of all items
    res.send("dummy");
};

exports.create = (req, res, next) => {
    var schedule = {
        items: [],
        itemNumbers: req.body.schedule.itemNumbers,
        date: req.body.schedule.date,
        time: {
            start: req.body.schedule.time.startTime,
            end: req.body.schedule.time.endTime
        }
    };
    // User.findOneAndUpdate({ email: user.email }, user, { upsert: true })
    console.log("****sched:" + schedule);
    Schedule.findOneAndUpdate({
        date: {
            // $eq: new Date(moment.utc(req.params.date, "YYYYMMDD"))
            $eq: moment(req.params.date, "YYYYMMDD")
        }
    }, schedule, {
        upsert: true
    }, (err, sched) => {
        if (err) return res.status(500).json({
            message: "Failed to save the schedule.",
            status: "failed",
            error: {
                message: "Failed to save to the database."
            }
        })
        return res.status(200).json({
            message: "Saved successfully.",
            status: "success",
            error: {}
        })
    });
}
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


exports.getCurrentAuctionItem = (req, res, next) => {
    const now = new Date();
    const date = moment(now).format("YYYY-MM-DD");
    const today = new Date(moment(date));
    // , time: { start: { $lte: time }, end: { $gte: time } }
    redisClient.get('CurrentAuctionItem', function (err, item) {
        if (item) {
            item = Object.assign(new Item, JSON.parse(item));
            if (moment().isAfter(moment(item.time.end, "HH:mm:ss"))) {
                redisClient.del('CurrentAuctionItem', function (err, reply) {
                    console.log('Deleted Key: ' + 'CurrentAuctionItem');
                });
                redisClient.del('CurrentBidValue', function (err, reply) {
                    console.log('Deleted Key: ' + 'CurrentBidValue');
                });
                return res.status(200).json({
                    status: "success",
                    message: "No item is auctioned currently",
                    error: {}
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Item currently Auctioned",
                data: item,
                error: {}
            });
        }
        Item.find({}).then(
            items => {
                var item = null;
                for (var i = 0; i < items.length; i++) {
                    var element = items[i];
                    if (moment(new Date(element.date)).isSame(moment(today)) &&
                        moment(element.time.start, "HH:mm:ss").isSameOrBefore(moment()) &&
                        moment(element.time.end, "HH:mm:ss").isSameOrAfter(moment())) {
                        console.log("------------", element);
                        item = element;
                        break;
                    }
                }
                var message = "Item currently Auctioned";
                if (!item) {
                    message = "No item is auctioned currently";
                } else {
                    var expiry = moment().diff(moment(element.time.end, "HH:mm:ss"), 'seconds');
                    redisClient.set('CurrentAuctionItem', JSON.stringify(item));
                    client.expireat(key, parseInt((+new Date) / 1000) + expiry);
                    Console.log("\n\n----------\nDataStored");
                }
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
    });
}


// Custom Functions 

function someReservedSlots(res, date) {

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
            date: moment(date, "YYYYMMDD")
        },
        (err, sched) => {
            if (err) return res.status(404).json({
                status: "failed",
                message: "error getting available slots",
                error: {
                    message: 'cannot access this date'
                }
            });

            var items = [];
            sched.items.forEach(ele => items.push(ele.itemId));

            Item.find({
                '_id': {
                    $in: items
                }
                // '_id': items.itemId
            }, function (err, docs) {
                console.log("docs: " + docs);
                if (err) return res.status(404).json({
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

                // Difference in time should be used by date object
                var time = (moment(sched.time.end, "HH:mm:ss")).diff(moment(sched.time.start, "HH:mm:ss"), 'minutes');


                var slots = getTimeStops(sched.time.start, sched.time.end, sched.itemNumbers)



                for (var i = 0; i < docs.length; i++) {
                    const start = docs[i].time.start;

                    for (var j = 0; j < slots.length; j++) {

                        if (slots[j].start === moment(start, "HH:mm:ss").format("HH:mm:ss"))
                            slots.splice(j, 1);
                    }

                }

                return res.status(200).json({
                    status: "success",
                    message: "available slots",
                    error: [],
                    data: slots
                });

            });
        });
}

function getTimeStops(start, end, itemNumbers) {
    var startTime = moment(start, 'HH:mm');
    var endTime = moment(end, 'HH:mm');

    var time = endTime.diff(startTime, 'minutes');
    var timePerSlot = time / itemNumbers;

    var timeStops = [];

    while (startTime < endTime) {
        //  check if this startTime is startTime of any item
        timeStops.push({
            start: new moment(startTime).format('HH:mm:ss'),
            end: new moment(startTime).add(timePerSlot, 'minutes').add(-1, 'seconds').format('HH:mm:ss')
        });
        startTime.add(timePerSlot, 'minutes');
    }
    return timeStops;
}