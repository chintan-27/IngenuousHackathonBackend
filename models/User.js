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
    type: Boolean,
    default: false,
  },
  district:{
    type: Boolean,
    default: false,
  },
  state:{
    type: Boolean,
    default: false,
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
