const mongoose = require('mongoose');
const { Schema } = mongoose;

const aadharSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    aadharno: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    }
});

mongoose.model('aadhars', aadharSchema);