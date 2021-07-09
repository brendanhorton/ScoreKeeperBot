const express = require('express')
const app = express()
const mongoose = require('mongoose')

const mongoURI = 'mongodb+srv://user1:user1@cluster0.97xnb.mongodb.net/highscores?retryWrites=true&w=majority'
const mongoClient = mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
