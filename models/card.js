const mongoose = require("mongoose")
const { Schema } = mongoose

const cardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    frontText: { type: String, required: true },
    backText: { type: String, required: true },
})

module.exports = Card = mongoose.model('Card', cardSchema)