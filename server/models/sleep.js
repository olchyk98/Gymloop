const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SleepSchema = new Schema({
    sleepHours: Number,
    startTime: Number,
    endTime: Number,
    creatorID: String 
});

module.exports = mongoose.model("Sleep", SleepSchema);