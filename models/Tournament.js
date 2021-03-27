const mongoose = require('mongoose');
const { Schema } = mongoose;

const tournamentSchema = new Schema({
    tournamentname:{
        type: String,
        required: true,
    },
    sportname:{
        type: String,
        required: true,
    },
    venue:{
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    starttime:{
        type: String,
        required: true,
    },
    minplayers:{
        type: Number,
        required: true,
    },
    maxplayers:{
        type: Number,
        required: true,
    },
    maxteams:{
        type: Number,
        required: true,
    },
    prizeone:{
        type: Number,
        required: true,
    },
    prizetwo:{
        type: Number,
        required: true,
    },
    prizethree:{
        type: Number,
        required: true,
    },
    maxage:{
        type: Number,
    },
    pointcriteria:{
        type: Number,
    },
    organizer:{
        type: String,
        required: true,
    },
    iscompleted:{
        type: Boolean,
        required: true,
        default: false,
    },
    isongoing:{
        type: Boolean,
        required: true,
        default: false,
    }
});

mongoose.model('tournaments', tournamentSchema);
