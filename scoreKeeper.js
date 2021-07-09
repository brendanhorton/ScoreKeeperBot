'use strict';
//mongoose instance
const mongoose = require('mongoose')
//client instance
const Discord = require('discord.js');
const client = new Discord.Client();

//the highscore server model
const Highscore = require('./models/highscore')

//mongoDB URI
const mongoURI = 'mongodb+srv://user:user@cluster0.97xnb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

//mongoose connection need to change to async
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))
    
//
//
//bot commands
client.on('ready', () => {
    console.log('ScoreKeeper is Ready!');
});

//map returned array by game played then by score to return top 5 list
client.on('message', async message => {
    if (message.content === '!highscores') {
        let leaderboard = "\n Here is the top 5!"
        const scores = await getHighscores()
        const sortedScores = scores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
        //for loop to print out the leaderboard (can implement showing more than top 5 later)
        for (let i = 0; i < 5; i++) {
            const newLine = `\n ${i+1}. ${sortedScores[i].name} --- ${sortedScores[i].score} points`
            leaderboard = leaderboard + newLine
        }
        message.reply(leaderboard)
    }
});

client.login('ODYyNzgzMzYwODg2Mzc0NDEw.YOdXng.7ps_DD8Fn0UVMklkZvMjF2v1930')

//testing mongoconnection function - posts new hs
async function testMongo() {
    const newHS = new Highscore({
        name: 'BWH',
        score: '1337',
    })

    const savedHS = await newHS.save()
    console.log(savedHS)
}

//can add function argument gameName which will sort list by gamename
async function getHighscores() {
    const highscores = await Highscore.find({})
    return highscores
}

//user can add picture of score as "confirmation"
//3 different games (mario, dracula, dnd)
//show user score when input

//needed commands 
//!add [game] [name] [score]
    //adds to database
    //need to add game to model