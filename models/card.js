const mongoose = require("mongoose")
const { Schema } = mongoose

const cardSchema = new Schema({
    _id: Schema.Types.ObjectId,
    header: { type: String, required: true },
    description: { type: String, required: true, maxLength: 200 },
})

module.exports = Card = mongoose.model('Card', cardSchema)
