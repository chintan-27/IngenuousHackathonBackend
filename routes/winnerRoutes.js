const mongoose = require('mongoose');
const Winner = mongoose.model("winners")
const User = mongoose.model('users');
const Tournament = mongoose.model('tournaments');
const Application = mongoose.model('applications');
const bodyParser = require('body-parser');

module.exports = app => {
    app.use(bodyParser.json());
    app.post("/addwinners/:tournamentid", async (req,res) =>{
        const tournament = await Tournament.findOne({_id: req.params.tournamentid}, (err)=> {
            if(err){
                res.send(err)
            }
        });
        const winner = new Winner({
                tournamentid : req.params.tournamentid,
                winners : req.body.winners,
            })
        for(let i in req.body.winners){
            let application = await Application.findOne({ teamname: req.body.winners[i], tournamentid: req.params.tournamentid }, (err) => {
                if(err){
                    res.send(err)
                }
            });
            application.players.forEach( (player) => {
                User.updateOne({_id: player}, {$inc : { points:  (tournament.prizeone/((i+1)*tournament.maxteams)) }}, (err) => {
                    if(err){
                        res.send(err)
                    }
                })
            });
        }

        try{
            winner.save();
            res.send("done");
        }catch (error) {
            res.send(error.message);
        }
    });
}


