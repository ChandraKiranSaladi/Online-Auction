const mongoose = require('mongoose');
const Item = require('../models/item');

exports.getAllItems = (req,res,next) => {
    // get all items
    res.send("dummy");
};

exports.create = (req,res,next) => {
    // create item in db
    res.send("dummy");
};

exports.getById = (req,res,next) => {
    // get item by Id
    res.send("dummy");
};

exports.updateById = (req,res,next) => {
    // update item
    res.send("dummy");
};

exports.deleteById = (req,res,next) => {
    // delete item
    res.send("dummy");
};
