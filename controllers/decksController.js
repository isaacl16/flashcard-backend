const Deck = require("../models/deck")
const Card = require("../models/card")
const mongoose = require("mongoose")
const conn = require("../utils/mongoose")

exports.createDeck = async (req, res) => {
    const deckData = {
        name: "Test 1",
    }
    const cardsData = [{
        header: "card 1",
        description: "description 1"
    }, {
        header: "card 2",
        description: "description 2"
    }]
    let session = await conn.startSession()
    try {
        session.startTransaction()
        let cardReferences = []
        const cards = cardsData.map((card) => {
            const _id = new mongoose.Types.ObjectId()
            cardReferences.push(_id)
            return {
                _id: new mongoose.Types.ObjectId(),
                ...card,
            }
        })
        await Card.insertMany(cards, { session: session })
        await Deck.create([{
            _id: new mongoose.Types.ObjectId(),
            name: deckData.name,
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
    console.log("getDeck " + req.params.id)
    res.send("Get Deck")
}

exports.getDecks = async (req, res) => {
    console.log("getDecks")
    res.send("Get Decks")
}

exports.updateDeck = async (req, res) => {
    console.log("updateDeck" + req.params.id)
    res.send("Update Deck")
}

exports.deleteDeck = async (req, res) => {
    console.log("deleteDeck" + req.params.id)
    res.send("Delete Deck")
}