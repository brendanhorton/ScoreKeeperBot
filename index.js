"use strict";
//mongoose instance
const mongoose = require("mongoose");
//client instance
const Discord = require("discord.js");
const client = new Discord.Client();

//the highscore server model
const Highscore = require("./models/highscore");
const { prefix, token, mongo_uri } = require("./config.json");

//mongoose connection need to change to async
mongoose
  .connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

//
//
//bot commands
client.on("ready", () => {
  console.log("ScoreKeeper is Ready!");
});

//map returned array by game played then by score to return top 5 list
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  //highscores command
  //!highscores [game]
  if (command === "highscores") {
    //checks if at least one argument after command
    if (!args.length) {
      return message.channel.send(
        `Please include the game in your request. !highscores [dnd/mario/dracula]`
      );
    }
    const game = args[0].toLowerCase()
    const scores = await getHighscores(game);
    const sortedScores = scores.sort(
      (a, b) => parseFloat(b.score) - parseFloat(a.score)
    );
    message.channel.send(printTop5(sortedScores, game));
  } else if (command === "add") {
    //add highscore command
    //!add [game] [initals] [score]
      if(args.length < 2) {
        return message.channel.send(
          `Please format your score properly. !add [game] [initials] [score]. \nExample: !add dracula BWH 100000000`
        )
      }
      const game = args[0].toLowerCase()
      const name = args[1].toUpperCase()
      //parsefloat and replace remove potential commas from score input
      const score = parseFloat(args[2].replace(/,/g, ''))

      const highscore = new Highscore({
        name,
        game,
        score,
      })

      const newHighscore = await highscore.save()
      const sortedScores = (await getHighscores(game)).sort((a,b) => parseFloat(b.score) - parseFloat(a.score))
      //have to convert id to string in order to do comparison
      const place = sortedScores.findIndex(x => x._id.toString() === newHighscore._id.toString()) + 1
      if (place === 1) {
        message.channel.send(`CONGRATULATIONS ${name} YOU HAVE THE NEW ALL-TIME TOP SCORE ON ${game.toUpperCase()}!`)
        message.channel.send(printTop5(sortedScores, game))
      } else if (place <= 5) {
        message.channel.send(`CONGRATULAIONS ${name} YOU HAVE A TOP 5 ALL-TIME SCORE ON ${game.toUpperCase()}`)
        message.channel.send(printTop5(sortedScores, game))
      } else {
        message.channel.send(`Score saved! Keep trying for a top score... you're current score puts you in ${place}`)
        message.channel.send(printCurrentScore(sortedScores, game, place))
      }
  }
});

client.login(token);

//function to print score for people not in top 5
function printCurrentScore(scores, game, place) {
  let leaderboard = printTop3(scores, game)
  leaderboard = leaderboard + `\n.\n.\n.\n${place - 1}. ${scores[place - 2].name} --- ${scores[place - 2].score}\n`
  leaderboard = leaderboard + `${place}. ${scores[place - 1].name} --- ${scores[place - 1].score}`
  return leaderboard
}


//testing mongoconnection function - posts new hs
async function testMongo() {
  const newHS = new Highscore({
    name: "BWH",
    score: "1337",
  });

  const savedHS = await newHS.save();
  console.log(savedHS);
}

//can add function argument gameName which will sort list by gamename
async function getHighscores(gameName) {
  const highscores = await Highscore.find({game: gameName});
  return highscores;
}

function printTop5(scores, game) {
  let leaderboard = `\n TOP 5 SCORES FOR ${game.toUpperCase()} \n ------------------------------------`;
     //for loop to print out the leaderboard (can implement showing more than top 5 later)
     for (let i = 0; i < 5; i++) {
      //breaks loop if not enough scores to display
      if (scores[i] === undefined) {
        break;
      }

      const newLine = `\n ${i + 1}. ${scores[i].name} --- ${scores[i].score}`;
      leaderboard = leaderboard + newLine;
    }
    return leaderboard
}

function printTop3(scores, game) {
  let leaderboard = `\n TOP 5 SCORES FOR ${game.toUpperCase()} \n ------------------------------------`;
  //for loop to print out the leaderboard (can implement showing more than top 5 later)
  for (let i = 0; i < 3; i++) {
   //breaks loop if not enough scores to display
   if (scores[i] === undefined) {
     break;
   }

   const newLine = `\n ${i + 1}. ${scores[i].name} --- ${scores[i].score}`;
   leaderboard = leaderboard + newLine;
 }
 return leaderboard
}
//user can add picture of score as "confirmation"
//3 different games (mario, dracula, dnd)
//show user score when input

//needed commands
//!add [game] [name] [score]
//adds to database
//need to add game to model
