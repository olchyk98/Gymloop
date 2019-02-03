const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SleepSchema = new Schema({
    sleepMinutes: Number,
    time: String,
    creatorID: String,
    rating: Number,
    createTime: String
});

module.exports = mongoose.model("Sleep", SleepSchema);