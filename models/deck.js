const mongoose = require("mongoose")
const Card = require("./card")
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

const removeLinkedDocuments = async (doc) => {
    console.log(doc)
    Card.deleteMany({ _id: { $in: doc.cards } })
        .catch((err) => {
            console.log(err.message)
        })
}

deckSchema.post('findOneAndRemove', removeLinkedDocuments)


module.exports = deck = mongoose.model('Deck', deckSchema)
