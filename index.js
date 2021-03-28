const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const keys = require('./config/keys');

require('./models/User');
require('./models/Tournament');
require('./models/Application');
require('./models/Winners');
require('./models/Aadhar');
require('./services/passport');

mongoose.connect(keys.mongoURI);
const app = express();

app.use(session({
  secret: 'keyboard cat',
}))
app.use(passport.initialize());
app.use(passport.session());
require('./routes/authRoutes')(app);
require('./routes/tournamentRoutes')(app);
require('./routes/applicationRoutes')(app);
require('./routes/winnerRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
