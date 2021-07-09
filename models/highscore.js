const mongoose = require('mongoose');

const highScoreSchema = new mongoose.Schema({
    name: String,
    score: Number,
    game: String,
})

highScoreSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Highscore', highScoreSchema);