const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    login: String,
    password: String,
    email: String,
    mainActivity: String,
    firstLogin: Date,
    authTokens: Array,
    connections: Array,
    weight: Number,
    appActivity: Array,
    height: Number,
    caloriesPerDay: Number,
    age: Number
});

module.exports = mongoose.model("User", UserSchema);