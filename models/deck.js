const mongoose = require("mongoose")
const { Schema } = mongoose


const deckSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: { type: String, require: true },
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Card'
        }
    ]
})

module.exports = deck = mongoose.model('Deck', deckSchema)
