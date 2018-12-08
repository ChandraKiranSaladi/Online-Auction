const mongoose = require('mongoose');
const Schedule = require('../models/schedule');

exports.getAvailableSlots = (req,res,next) => {

    // TODO: Input: Date. Output: Slots. Set a default array with start and times. like 8am to 11am for 6 items. 
    // TODO: If already reserved, eliminate that slot and return back. 
    
}
exports.getAll = (req,res,next) => {
    // get schedule of all items
    res.send("dummy");
};

exports.create = (req,res,next) => {
    // create schedule in db
    res.send("dummy");
};

exports.getById = (req,res,next) => {
    // get schedule of item by Id
    res.send("dummy");
};

exports.updateById = (req,res,next) => {
    // update schedule of an item
    res.send("dummy");
};

exports.deleteById = (req,res,next) => {
    // delete schedule of an item
    res.send("dummy");
};
