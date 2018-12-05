const mongoose = require('mongoose');
const Item = require('../models/item');
const bodyParser = require('body-parser');
const Schedule = require('../models/schedule');

exports.getAllItems = (req, res, next) => {
    // get all 
    
    Item.find((err,item) => {
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

    const url = req.protocol + '://'+req.get("host");
    const item = new Item({
      title: req.body.item.title,
      content: req.body.item.content,
      initialBidPrice: req.body.item.price,
      date: req.body.item.date,
      time: {start: req.body.item.time.start, end: req.body.item.time.end},
      userId: req.userId, 
      imagePath: url+"/images/"
    //   + req.file.filename

    });
    console.log(item);

    // create item in db
    item.save()
        .then((result) => {
            console.log(result);
            const temp = [];
            temp.push({itemId: result._id});
            const schedule = new Schedule({
                items : temp,
                date: req.body.item.date
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
                                    error: []
                                })
                                
                            })
                            .catch((err) => {
                                console.log("schedule update item post error:aa "+err);
                                return res.status(500).json({
                                    status: "failed",
                                    message: "error on server",
                                    error: {
                                        message: 'Couldn\'t access database for the user'
                                    }
                                });
                            })
                    }

                    // if schedule already exists, then access sched.itemIds and then push the itemId in there
                    console.log("schedule details found" + sched);
                    return res.status(200).json({
                        status: "success",
                        message: "Post Item registered",
                        error: []
                    })
                });
        })
        .catch((error) => {
            console.log("error from createItem mongo" + error);
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
        userId: req.user.id
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
            data: item,
            error: []
        });
    })
};

exports.updateById = (req, res, next) => {
    // update item
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
            console.log("details found" + item);
            return res.status(200).json({
                status: "success",
                message: "Item updated",
                data: item,
                error: []
            });
        });
}

exports.deleteById = (req, res, next) => {
    // delete item
    res.send("dummy");
};