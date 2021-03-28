const passport = require('passport');
const { registervalidation } = require('../validation');
const mongoose = require('mongoose');
const keys = require('../config/keys');
const User = mongoose.model('users');
const Aadhar = mongoose.model('aadhars');
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
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(flash());
  app.use(cors(corsOptions));
  let user;
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

  app.post('/api/register',async (req, res) => {
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

  app.post('/api/login',(req,res,next) => {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return; }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
          res.redirect("http://localhost:3000/");
      });
    })(req, res, next);
  });

  
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect("http://localhost:3000/home")
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  app.post('/api/profilecomplete', async (req, res,next) =>{

    let point = 0;
    if(req.body.national==true){
      point = point + 300;
    }else if(req.body.state==true){
      point = point + 200;
    }else if(req.body.district==true){
      point = point + 100;
    }
    console.log(req)
    console.log(req.body)
    console.log(req.user)

   await User.findOneAndUpdate({_id:req.user._id},{
     name : req.body.name,
     skillset : req.body.skillset,
     national : req.body.national,
     district : req.body.district,
     state : req.body.state,
     verified: req.body.verified,
     points : point,
    },(err) => {
      if(err){
        res.send(err)
      }else{
        res.send("done")
      }
    })
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

  app.post('/api/aadharverify/:aadharno', async (req,res) => {
    console.log(req.params)
    const aadhar = await Aadhar.findOne({aadharno: req.params['aadharno']}, (err) => {
      if(err){
        console.log(err)
      }
    })
    console.log(aadhar)
    const text = req.body.text
    console.log(text.includes(aadhar["name"]))
    console.log(text.includes(aadhar["gender"]))
    console.log(text.includes(aadhar["dob"]))
     if(text.includes(aadhar["name"])  &&text.includes(aadhar["dob"])){
       res.send({verified: true,name: aadhar['name']})
     }
  })
};
