const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MealSchema = new Schema({
    creatorID: String,
    calories: Number,
    dishes: Array,
    time: String,
    name: String
});

module.exports = mongoose.model("Meal", MealSchema);