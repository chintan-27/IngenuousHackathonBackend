const mongoose = require('mongoose');
const { Schema } = mongoose;

const winnerSchema = new Schema({

    tournamentid : {
        type: String,
        required: true,
    },
    winners:{
        type: Array,
        required: true,
    }
});

mongoose.model('winners', winnerSchema)