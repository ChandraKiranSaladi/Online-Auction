const mongoose = require('mongoose');
const Item = require('../models/item');
const Bid = require('../models/bids');
const bodyParser = require('body-parser');
const Schedule = require('../models/schedule');
const Bids = require('../models/bids');
const moment = require('moment');
const redis = require('redis');
const redisClient = redis.createClient();
redisClient.on('connect', function () {
    console.log('Redis client connected');
});
redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

exports.getAllItems = (req, res, next) => {
    // get all 

    Item.find((err, item) => {
        if (err) return res.status(500).json({
            status: "failed",
            message: "error on server",
            error: {
                message: 'Couldn\'t fetch items'
            }
        });
        if (!item) return res.status(400).json({
            status: "failed",
            message: "items not found",
            error: {
                message: 'Items does not exist'
            }
        });
        console.log("details found" + item);
        return res.status(200).json({
            status: "success",
            message: "All items",
            data: item,
            error: []
        });
    })
};

exports.post = (req, res, next) => {
    // console.log("time here is"+req.body.start)
    // console.log("time moment is "+ moment(req.body.start));
    const date1 = moment(req.body.start, "HH:mm:ss").format("HH:mm:ss");
    const date2 = moment(req.body.end, "HH:mm:ss").format("HH:mm:ss");
    console.log(date1 + " " + date2);
    console.log("start :" + req.body.start + " end: " + req.body.end);

    const url = req.protocol + '://' + req.get("host");
    const date = moment(req.body.date, 'YYYY-MM-DD');
    console.log(date1);
    const item = new Item({
        title: req.body.title,
        content: req.body.content,
        initialBidPrice: req.body.price,
        date: date,
        time: {
            start: date1,
            end: date2
        },
        userId: req.userId,
        imagePath: url + "/images/" + req.file.filename

    });
    console.log(item);
    // create item in db
    item.save()
        .then((result) => {
            // console.log(result.time.start);
            const temp = [];
            temp.push({
                itemId: result._id
            });
            const schedule = new Schedule({
                items: temp,
                date: moment(req.body.date, 'YYYY-MM-DD')
            });

            Schedule.findOneAndUpdate({
                    date: schedule.date
                }, {
                    $push: {
                        items: {
                            itemId: result._id
                        }
                    }
                },
                (err, sched) => {
                    if (err) return res.status(500).json({
                        status: "failed",
                        message: "error on server",
                        error: {
                            message: 'Couldn\'t access database for the user'
                        }
                    });
                    if (!sched) {
                        console.log("schedule being created for the day");
                        schedule.save()
                            .then((result) => {
                                console.log(result);
                                return res.status(200).json({
                                    status: "success",
                                    message: "Post Item registered",
                                    data: {
                                        "item": result
                                    },
                                    error: []
                                })

                            })
                            .catch((err) => {
                                console.log("schedule update item post error:aa " + err);
                                return res.status(500).json({
                                    status: "failed",
                                    message: "error on server",
                                    error: {
                                        message: 'Couldn\'t access database for the user'
                                    }
                                });
                            })
                    } else {
                        // if schedule already exists, then access sched.itemIds and then push the itemId in there
                        console.log("schedule details found" + sched);
                        const items = sched.items;
                        items.push({
                            itemId: result._id
                        });
                        Schedule.update({
                                items: items
                            },
                            (err, item) => {
                                if (err) return res.status(500).json({
                                    status: "failed",
                                    message: "error on server",
                                    error: {
                                        message: 'Couldn\'t update items of user'
                                    }
                                });
                            });
                        return res.status(200).json({
                            status: "success",
                            message: "Post Item registered",
                            data: {
                                "item": result
                            },
                            error: []
                        })
                    }
                });
        })
        .catch((error) => {
            console.log("error from createItem mongo " + error);
            return res.status(500).json({
                status: "failed",
                message: "error",
                error: [{
                    message: "error occured while registering item"
                }]
            });
        });

}

exports.getAllUserItems = (req, res, next) => {
    // get item by Id
    Item.find({
        userId: req.userId
    }, (err, item) => {
        if (err) return res.status(500).json({
            status: "failed",
            message: "error on server",
            error: {
                message: 'Couldn\'t find items of user'
            }
        });
        if (!item) return res.status(400).json({
            status: "failed",
            message: "items not found",
            error: {
                message: 'Items does not exist for user'
            }
        });
        console.log("details found");
        return res.status(200).json({
            status: "success",
            message: "Items found",
            data: {
                items: item
            },
            error: []
        });
    })
};

exports.updateById = (req, res, next) => {
    // update item

    const url = req.protocol + '://' + req.get("host");

    const date1 = moment(req.body.start, "HH:mm:ss").format("HH:mm:ss");
    const date2 = moment(req.body.end, "HH:mm:ss").format("HH:mm:ss");
    const item = {
        title: req.body.title,
        content: req.body.content,
        initialBidPrice: req.body.price,
        date: moment(req.body.date, 'YYYY-MM-DD').toString(),
        time: {
            start: date1,
            end: date2
        },
        userId: req.userId,
        imagePath: url + "/images/" + req.file.filename

    };
    console.log("______" + JSON.stringify(item));
    Item.findOneAndUpdate({
            _id: req.params.itemId
        }, item,
        (err, item) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "error on server",
                error: {
                    message: 'Couldn\'t update items of user'
                }
            });
            if (!item) return res.status(400).json({
                status: "failed",
                message: "items not found",
                error: {
                    message: 'Item does not exist for user'
                }
            });
            console.log("details found " + item);
            return res.status(200).json({
                status: "success",
                message: "Item updated",
                data: item,
                error: []
            });
        });
}

exports.getById = (req, res, next) => {
    // update item
    Item.findOne({
            _id: req.params.itemId
        }, req.body.item,
        (err, item) => {
            if (err) return res.status(500).json({
                status: "failed",
                message: "error on server",
                error: {
                    message: 'Couldn\'t update items of user'
                }
            });
            if (!item) return res.status(400).json({
                status: "failed",
                message: "items not found",
                error: {
                    message: 'Item does not exist for user'
                }
            });
            console.log("details found" + item);
            return res.status(200).json({
                status: "success",
                message: "details found",
                data: item,
                error: []
            });
        });
}

exports.deleteById = (req, res, next) => {
    // delete item

    Item.findOne({
        _id: req.params.itemId
    }, (err, item) => {
        if (item) {
            Schedule.findOne({
                    items: {
                        $elemMatch: {
                            itemId: req.params.itemId
                        }
                    }
                },
                (err, sched) => {
                    if (err) return res.status(500).json({
                        status: "failed",
                        message: "Failed to delete item",
                        data: item,
                        error: []
                    });
                    sched.items.forEach(element => {
                        if (element.itemId === item._id)
                            sched.items.splice(sched.items.indexOf(element), 1);
                    });

                    Schedule.updateOne({
                        _id: sched._id
                    }, sched, (err, temp) => {
                        if (err) return res.status(500).json({
                            status: "failed",
                            message: "Failed to delete item",
                            data: item,
                            error: [{
                                message: "Failed to delete Item"
                            }]
                        });

                        Item.findOneAndDelete({
                                _id: req.params.itemId
                            })
                            .then(result => {
                                console.log(result);

                                // { items: { $elemMatch: { itemId: "5c0daec97d27765d40a938be" } } }

                                return res.status(200).json({
                                    status: "success",
                                    message: "details deleted",
                                    data: item,
                                    error: []
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    status: "failed",
                                    message: "Failed to delete item",
                                    data: item,
                                    error: [{
                                        message: "Failed to delete Item"
                                    }]
                                });
                            });
                    })
                });
        } else return res.status(404).json({
            status: "failed",
            message: "Failed to delete item",
            data: item,
            error: [{
                message: "Item doesn't exist"
            }]
        });
    })
};

exports.getCurrentBidByItemId = (req, res, next) => {
    var itemId = req.params.itemId;
    // find().limit(1).sort({$natural:-1})
    redisClient.get('CurrentBidValue', function (err, bid) {
        console.log("****",bid);
        if (bid && bid.itemId == itemId) {
            console.log("------------------", bid);
            return res.status(200).json({
                status: "success",
                message: message,
                data: Object.assign(new Bid, JSON.parse(bid)),
                error: {}
            });
        }
        Bids.find({
            itemId: itemId
        }).limit(1).sort({
            $natural: -1
        }).then(
            bid => {
                var message = "Current bid on the Item";
                if (!bid[0])
                    message = "There are currently zero bids on the item.";
                redisClient.set('CurrentBidValue', JSON.stringify(bid[0]));
                return res.status(200).json({
                    status: "success",
                    message: message,
                    data: bid[0],
                    error: {}
                });
            }
        ).catch(
            err => {
                return res.status(404).json({
                    status: "failed",
                    message: "Failed to fetch Current bid value on Item",
                    error: {
                        message: "Failed to fetch Current bid value on Item"
                    }
                });
            }
        );
    });
}

exports.getItemsByDate = (req, res, next) => {
    Item.find({
        date: moment(req.params.date, "YYYYMMDD")
    }).then(
        (data) => {
            return res.status(200).json({
                data: data,
                status: "success",
                message: (data.length) ? "Found items for auction on the date." : "No items sechudled for the requested date.",
                errors: {}
            })
        },
        (err) => {
            return res.status(404).json({
                status: "failed",
                message: "Failed to fetch items.",
                errors: {
                    message: "Failed to fetch items for the requested date."
                }
            })
        }
    )
}