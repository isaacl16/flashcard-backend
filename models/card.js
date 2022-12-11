const mongoose = require("mongoose")
const { Schema } = mongoose

const cardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    frontText: { type: String },
    backText: { type: String },
})

module.exports = Card = mongoose.model('Card', cardSchema)