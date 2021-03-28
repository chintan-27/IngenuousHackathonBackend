const mongoose = require('mongoose');
const keys = require('../config/keys');
const cors = require('cors');
const User = mongoose.model('users');
const Tournament = mongoose.model('tournaments');
const Application = mongoose.model('applications');
const bodyParser = require('body-parser');

module.exports = app => {
  app.use(bodyParser.json());

  app.post('/addtournament', async (req, res) => {
    // console.log(req.user)
    if(req.user.usertype =="oragniser"){

      const tournament = new Tournament({
          tournamentname : req.body.tournamentname,
          sportname : req.body.sportname,
          venue : req.body.venue,
          date : req.body.date,
          starttime : req.body.starttime,
          minplayers : req.body.minplayers,
          maxplayers : req.body.maxplayers,
          maxteams : req.body.maxteams,
          prizeone : req.body.prizeone,
          prizetwo : req.body.prizetwo,
          prizethree : req.body.prizethree,
          maxage : req.body.maxage,
          pointcriteria : req.body.pointcriteria,
          organizer: req.user._id,
      });
    }else{
      res.send("No access");
    }
        
      try {
        const savedTournament = await tournament.save()
        res.send('done'); 
    } catch (error) {
        res.status(404).send(error.message);
    }
  });

  app.get('/applications/:tournamentid', async (req, res) => {
    const applications = await Application.find({tournamentid: req.params.tournamentid}, (err, applications) => {
      if(err){
        res.send(err)
      }else{
        res.send(applications)
      }
    });
  });

  app.get('/select/:tournamentid/:teamcode', async (req,res) => {
    const application = await Application.findOne({tournamentid: req.params.tournamentid, teamcode: req.params.teamcode}, (err) => {
      if(err){
        res.send(err)
      }
    })
    const tournament = await Tournament.findOne({_id: req.params.tournamentid}, (err) => {
      if(err){
        res.send(err)
      }
    })
    if(application.players.length >= tournament.minplayers && application.players.length <= tournament.maxplayers){
      await Application.updateOne({tournamentid: req.params.tournamentid, teamcode: req.params.teamcode}, { isSelected: true }, (err) => {
        if(err){
          res.send(err)
        }else{
          res.send("done")
        }
      })
    }else{
      res.send("Insufficient players")
    }
  });

  app.get("/api/alltournaments", async (req, res) => {
    const tournaments = await Tournament.find()
    res.send(tournaments)
  })

  
  app.post("/api/tournaments/", async (req, res) => {
    const tournaments = []
    for (let i in req.body.data){
      let temp = await Tournament.find({sportname: req.body.data[i]})
      for(let j in temp){
        tournaments.push(temp[j])
      }
    }
    res.send(tournaments)
  })
};
