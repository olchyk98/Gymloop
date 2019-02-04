const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrainingSchema = new Schema({
    destroyedCalories: Number,
    minutes: Number,
    time: String,
    action: String,
    people: Array
});

module.exports = mongoose.model("Training", TrainingSchema);