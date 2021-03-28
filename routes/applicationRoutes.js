const mongoose = require('mongoose');
const User = mongoose.model('users');
const Tournament = mongoose.model('tournaments');
const Application = mongoose.model('applications');
const bodyParser = require('body-parser');
const randomstring = require('randomstring');

module.exports = app => {
  app.use(bodyParser.json());
  
    app.post('/api/createteam/:tournamentid', async  (req, res) =>  {
        const tournament = await Tournament.findOne({_id: req.params.tournamentid }, async (err) => {
            if(err){
                res.send(err)
            }
        });
        if(tournament.maxplayers == 1){
            const application = new Application({
                tournamentid : req.params.tournamentid,
                teamname : req.body.teamname,
                players: [req.user._id] 
            });
            try {
                const savedApplication = await application.save()
                res.send(savedApplication); 
            } catch (error) {
                res.status(404).send(error.message);
            }
        }else if(tournament.minplayers > 1){
            const teamcode = randomstring.generate(8);
            console.log(teamcode)
            const application = new Application({
                tournamentid : req.params.tournamentid,
                teamcode:teamcode,
                teamname : req.body.teamname,
                players: [req.user._id] 
            });
            try {
                const savedApplication = await application.save()
                res.send(savedApplication); 
            } catch (error) {
                res.status(404).send(error.message);
            }
        }
        
    });

    app.get('/api/isapplied/:tournamentid', async (req, res) => {
        const application = await Application.find({tournamentid:tournamentid, players: {$elemMatch: {players: req.user._id}}})
        if(application){
            res.send(application)
        }else{
            res.send(false)
        }
    })

    app.post('/jointeam/:tournamentid', async (req, res) => {
        const application = await Application.findOne({ teamcode:req.body.teamcode, tournamentid: req.params.tournamentid },(err) => {
            if(err){
                res.send(err);
            }
        })

        const tournament = await Tournament.findOne({_id: req.params.tournamentid },(err) => {
            if(err){
                res.send(err);
            }
        })

        if(application.players.includes(req.user._id)){
            res.send("Already on team")
        }else if(application.players.length >= tournament.maxplayers){
            res.send("Team full")
        }
        else{
            await Application.updateOne({ teamcode:req.body.teamcode, tournamentid: req.params.tournamentid },{ $push : {players:req.user._id }} ,(err) => {
                if(err){
                    res.send(err);
                }else{
                    res.send(done)
                }
            })
        }
    });
};