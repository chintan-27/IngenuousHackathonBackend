const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: {
    type: String,
  },
  email:{
    type: String,
    required: true,
  },
  password:{
    type: String,
  },
  verified:{
    type: Boolean,
    required: true,
    default: false,
  },
  name:{
    type: String,
  },
  skillset:{
    type : Array,
  },
  national:{
    type: String,
    default: "No",
  },
  district:{
    type: String,
    default: "No",
  },
  state:{
    type: String,
    default: "No",
  },
  usertype:{
    type: String,
    default: '',
  },
  points: {
    type: Number,
    default: 10,
  }
});

mongoose.model('users', userSchema);
