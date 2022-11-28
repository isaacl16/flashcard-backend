const Deck = require("../models/deck")
const Card = require("../models/card")
const mongoose = require("mongoose")
const conn = require("../utils/mongoose")
const { findById } = require("../models/card")

exports.createDeck = async (req, res) => {
    console.log(req.body)
    // const deckData = {
    //     name: "Test 1",
    // }
    // const cardsData = [{
    //     header: "card 1",
    //     description: "description 1"
    // }, {
    //     header: "card 2",
    //     description: "description 2"
    // }]
    const reqData = req.body
    let session = await conn.startSession()
    try {
        session.startTransaction()
        let cardReferences = []
        const cards = reqData.cards.map((card) => {
            const _id = new mongoose.Types.ObjectId()
            cardReferences.push(_id)
            return {
                _id: _id,
                ...card,
            }
        })
        await Card.insertMany(cards, { session: session })
        await Deck.create([{
            _id: new mongoose.Types.ObjectId(),
            name: reqData.deck.name,
            cards: cardReferences,
        }], { session: session })
        console.log("Deck Created")
        await session.commitTransaction()
        res.send("Deck Created")
    } catch (err) {
        await session.abortTransaction()
        console.log(err.message)
        console.log("failed to create deck")
        res.send("Failed to create Deck")
    }
    session.endSession()
}

exports.getDeck = async (req, res) => {
    console.log("getDeck " + req.params._id)
    const _id = req.params._id
    Deck
        .findById(_id)
        .populate('cards')
        .exec((err, deck) => {
            if (err) console.log(err.message)
            console.log(deck)
            res.send(deck)
        })

}

exports.getDecks = async (req, res) => {
    console.log("getDecks")
    const data = await Deck.find()
    res.send(data)
}

exports.updateDeck = async (req, res) => {
    console.log("updateDeck" + req.params.id)
    res.send("Update Deck")
}

exports.deleteDeck = async (req, res) => {
    let session = await conn.startSession()

    try {
        session.startTransaction()
        const _id = req.params._id
        await Deck.findOneAndRemove({ _id: _id }, { session: session })
        await session.commitTransaction()
        res.send("Deck Deleted")

    } catch (e) {
        await session.abortTransaction()
        res.send("Failed to delete deck")
    }
    session.endSession()
}