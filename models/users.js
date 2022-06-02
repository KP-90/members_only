const { DateTime } = require("luxon");
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let user_schema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    member: {type: Boolean, default: false},
    admin: {type: Boolean, default: false}
})


module.exports = mongoose.model('user', user_schema)