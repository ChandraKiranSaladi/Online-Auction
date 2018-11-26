const mongoose = require('mongoose');
// This model will store all the tokens which are not expired yet,
// but the user logged out.
const blackListSchema = mongoose.Schema({
    token: String
});

module.exports = mongoose.model('BlackList',blackListSchema);
