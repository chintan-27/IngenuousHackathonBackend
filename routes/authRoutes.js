const passport = require('passport');
const { registervalidation } = require('../validation');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');
const bodyParser = require('body-parser');
const cors = require('cors');
const flash = require('connect-flash');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

module.exports = app => {
  app.use(bodyParser.json());
  app.use(flash());
  app.use(cors(corsOptions));

  // app.use(cors);
  app.get('/',(req,res)=>{

  })
  app.get('/auth/google',passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback',passport.authenticate('google'),(req, res) => {
      res.redirect('http://localhost:3000/');
    }
  );

  app.post('/register',async (req, res) => {
    const { error } = registervalidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');


    const user = new User({
        email:  req.body.email,
        password:  req.body.password,
    });  
    try {
        const savedUser = await user.save()
        res.send('done'); 
    } catch (error) {
        res.status(404).send(error.message);
    }
  });

  app.post('/login',passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login',failureFlash: true }),(req,res) => {
    res.redirect('http://localhost:3000/');
  });
  app.post('/profilecomplete', async (req,res) =>{
    let point = req.user.points;
    if(req.body.national=="yes"){
      point = point + 300;
    }else if(req.body.state=="yes"){
      point = point + 200;
    }else if(req.body.district=="yes"){
      point = point + 100;
    }
  
   await User.updateOne({_id : req.user._id},{
     name : req.body.name,
     skillset : req.body.skillset,
     national : req.body.national,
     district : req.body.district,
     state : req.body.state,
     points : point,
    },(err) => {
      if(err){
        res.send(err)
      }else{
        res.send("done")
      }
    })
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.get('/api/usertype/:type', (req, res) => {
    console.log(req.user._id);
    const user = User.updateOne({_id: req.user._id},{
      usertype: req.params.type,
    }, (err) => {
      if(err){
        res.send(err)
      }else{
        res.send("done")
      }
    });
  });
};
