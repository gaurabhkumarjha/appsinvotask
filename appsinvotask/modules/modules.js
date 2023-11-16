const mongoose = require("mongoose");

function getWeekNumber(date) {
    return date.getDay()
}

const userSchema = new mongoose.Schema({

    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    status: {
        type: String,
    },
    week: {
        type: Number,
        default: getWeekNumber(new Date()),
    },
});

const userregistration = mongoose.model('userregistration', userSchema);
module.exports = userregistration;