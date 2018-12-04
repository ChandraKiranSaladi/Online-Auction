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
    const item = new Post({
      title: req.body.item.title,
      content: req.body.item.content,
      price: req.body.item.price,
      date: req.body.item.date,
      time: {start: req.body.item.start, end: req.body.time.end}, 
      imagePath: url+"/images/"+ req.file.filename
    });


    // create item in db
    Item.save()
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
                (err, user) => {
                    if (err) return res.status(500).json({
                        status: "failed",
                        message: "error on server",
                        error: {
                            message: 'Couldn\'t access database for the user'
                        }
                    });
                    if (!user) {
                        console.log("schedule being created for the day");
                        schedule.save()
                            .then((result) => {
                                return res.status(200).json({
                                    status: "success",
                                    message: "Post Item registered",
                                    error: []
                                })
                            })
                            .catch((err) => {
                                console.log("schedule update item post error")
                                return res.status(500).json({
                                    status: "failed",
                                    message: "error on server",
                                    error: {
                                        message: 'Couldn\'t access database for the user'
                                    }
                                });
                            })
                    }
                    console.log("schedule details found" + user);
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