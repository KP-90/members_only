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
    return this.timestamp ? DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_FULL) : '';
})

module.exports = mongoose.model('Post', Post_schema)