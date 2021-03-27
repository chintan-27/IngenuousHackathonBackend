const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({

    tournamentid : {
        type: String,
        required: true,
    },
    teamname:{
        type: String,
        required: true,
    },
    teamcode:{
        type: String,
    },
    players: {
        type : Array,
        required: true,
    },
    isSelected:{
        type: Boolean,
        required: true,
        default: false,
    }
});

mongoose.model('applications', applicationSchema)