const mongoose = require('mongoose');
const Item = require('../models/item');
const bodyParser = require('body-parser');
const Schedule = require('../models/schedule');
const moment = require('moment');

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
    const date1 = new Date(req.body.date + " " + req.body.start);
    const date2 = new Date(req.body.date + " " + req.body.end);
    console.log("date1 :" + date1 + " date2: " + date2);
    console.log("start :" + req.body.start + " end: " + req.body.end);

    const url = req.protocol + '://' + req.get("host");
    const date = new Date(req.body.date);
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
            console.log(result.time.start);
            const temp = [];
            temp.push({
                itemId: result._id
            });
            const schedule = new Schedule({
                items: temp,
                date: req.body.date
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
                        Schedule.update({ items: items },
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
    console.log(JSON.stringify(req.body.item));

    const date1 = new Date(req.body.date + " " + req.body.start);
    const date2 = new Date(req.body.date + " " + req.body.end);
    const item = new Item({
        title: req.body.title,
        content: req.body.content,
        initialBidPrice: req.body.price,
        date: req.body.date,
        time: {
            start: date1,
            end: date2
        },
        userId: req.userId,
        imagePath: url + "/images/" + req.file.filename

    });
    Item.update({
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

    Item.delete({
        _id: req.params.id
    })
        .then(result => {
            console.log(result);
            return res.status(200).json({
                status: "success",
                message: "details deleted",
                data: item,
                error: []
            });
        })
};
