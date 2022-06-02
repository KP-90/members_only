/*
    body        text
    author      ref user model
    created     date/time

*/

const { DateTime } = require("luxon");
let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Post_schema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'user'},
    text: {type: String},
    timestamp: {type: Date}
})

Post_schema
.virtual('timstamp_formatted')
.get(function(){
    return this.timestamp ? DateTime.fromJSDate(this.timestamp).plus({days: 1}).toLocaleString(DateTime.DATE_MED) : '';
})

module.exports = mongoose.model('Post', Post_schema)