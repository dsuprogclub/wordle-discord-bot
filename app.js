require("dotenv").config();
const {Client, Intents, MessageFlags} = require("discord.js");
const fs = require("fs");

let currentGame = {
    running: false,
    word: "ERROR",
    guesses: []
}

let wordlist = [];
fs.readFile('5letterwords.txt', 'utf8', (err, data) => {
    if(err){
        console.error(err);
        return;
    }
    wordlist = data.split("\n");
});

function getAccuracyString(word, guess){
    let accuracyString = "";

    for(let i = 0; i < 5; i++){
        if(guess[i] == word[i]){
            accuracyString += ":green_square:";
        }else{
            let yellow = false;
            for(let j = 0; j < 5; j++){
                if(guess[i] == word[j] && guess[j] != word[j]){
                    yellow = true;
                }
            }
            if(yellow){
                accuracyString += ":yellow_square:";
            }else{
                accuracyString += ":black_large_square:";
            }
        }
    }

    return accuracyString;
}

const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS,
    ]
});

client.on("message", msg => {
    if(msg.author.bot) return;

    if(msg.content.toLowerCase() == "wordle start"){
        currentGame.running = true;
        currentGame.word = wordlist[Math.floor(Math.random() * wordlist.length)];
    }

    if(msg.content.length == 5 && currentGame.running){
        currentGame.guesses.push(msg.content.toUpperCase());

        let output = "";
        for(let i = 0; i < currentGame.guesses.length; i++){
            output += currentGame.guesses[i];
            output += "\n";
            output += getAccuracyString(currentGame.word, currentGame.guesses[i]);
            output += "\n";
        }

        if(getAccuracyString(currentGame.word, currentGame.guesses[currentGame.guesses.length - 1]) == ":green_square::green_square::green_square::green_square::green_square:"){
            output += "You WIN!!!!!!!!!\n";
            output += "The word was ";
            output += currentGame.word;
            currentGame.running = false;
        } else if(currentGame.guesses.length == 6){
            output += "You LOSE!!!!!!!!\n";
            output += "The word was ";
            output += currentGame.word;
            currentGame.running = false;
        }

        msg.reply(output);
    }
});

client.login(process.env.TOKEN);