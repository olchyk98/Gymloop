const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SleepSchema = new Schema({
    sleepHours: Number,
    time: String,
    endTime: Number,
    creatorID: String,
    rating: String
});

module.exports = mongoose.model("Sleep", SleepSchema);