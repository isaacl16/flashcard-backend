const Deck = require("../models/deck")
const Card = require("../models/card")
const mongoose = require("mongoose")
const conn = require("../db")
const { findById, update } = require("../models/card")
const card = require("../models/card")
const deck = require("../models/deck")


exports.createDeck = async (req, res) => {
    const reqBody = req.body
    let session = await conn.startSession()
    try {
        session.startTransaction()
        let cardReferences = []
        const cards = reqBody.cards.map((card) => {
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
            name: reqBody.deck.name,
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
    const _id = req.params._id
    const reqBody = req.body
    const updateDeckName = reqBody.updateDeckName
    let addCards = reqBody.addCards
    let updateCards = reqBody.updateCards
    let deleteCards = reqBody.deleteCards
    let session = await conn.startSession()

    try {
        session.startTransaction()
        const addCardReferences = []
        const deleteCardReferences = []
        if (addCards.length > 0) {
            addCards = addCards.map((card) => {
                const _id = new mongoose.Types.ObjectId()
                addCardReferences.push({
                    _id: _id, index: card.index
                })
                return {
                    _id: _id,
                    frontText: card.frontText,
                    backText: card.backText
                }
            })
            await Card.insertMany(
                addCards,
                {
                    session: session
                }
            )
            console.log("Cards Added")
        }
        if (updateCards.length > 0) {
            updateCards = updateCards.map((card) => {
                return {
                    updateOne: {
                        filter: {
                            id: card._id
                        },
                        update: {
                            $set: {
                                frontText: card.frontText,
                                backText: card.backText
                            }
                        }
                    }
                }
            })
            await Card.bulkWrite(
                [
                    ...updateCards
                ],
                { session: session }
            )
        }
        if (deleteCards.length > 0) {
            deleteCards = deleteCards.map((card) => {
                deleteCardReferences.push(new mongoose.Types.ObjectId(card._id))
                return card._id
            })
            await Card.deleteMany(
                {
                    _id: { $in: deleteCards }
                },
                { session: session }
            )
            console.log("Cards deleted")
        }
        const deckUpdates = []
        if (updateDeckName) {
            deckUpdates.push({
                updateOne: {
                    filter: {
                        _id: _id,
                    },
                    update: {
                        $set: { name: updateDeckName }
                    }
                },
            })
        }
        if (addCardReferences.length > 0) {
            addCardReferences.forEach((card, index) => {
                deckUpdates.push({
                    updateOne: {
                        filter: {
                            _id: _id,
                        },
                        update: {
                            $push: { cards: { $each: [card], $position: card.index } }
                        }
                    },
                })
            })
            // deckUpdates.push({
            //     updateOne: {
            //         filter: {
            //             _id: _id,
            //         },
            //         update: {
            //             $push: { cards: { $each: addCardReferences } }
            //         }
            //     },
            // })
        }
        if (deleteCardReferences.length > 0) {
            deckUpdates.push({
                updateOne: {
                    filter: {
                        _id: _id,
                    },
                    update: {
                        $pullAll: { cards: deleteCardReferences }
                    }
                },
            })
        }
        if (deckUpdates.length > 0) {
            await Deck.bulkWrite(
                [
                    ...deckUpdates,
                ],
                { session: session }
            )
            console.log("Deck updated")
        }
        await session.commitTransaction()

    } catch (e) {
        console.log(e.message)
        session.abortTransaction()
    }
    session.endSession()
    res.send("Update Deck")
}

exports.deleteDeck = async (req, res) => {
    console.log("Deck delete")
    let session = await conn.startSession()
    const _id = req.params._id
    try {
        session.startTransaction()
        const deletedDeck = await Deck.findOneAndDelete({ _id: _id }, { session: session })
        const deleteCards = deletedDeck.cards
        await Card.deleteMany({ _id: { $in: deleteCards } })
        await session.commitTransaction()
        res.send("Deck Deleted")

    } catch (e) {
        await session.abortTransaction()
        console.log(e.message)
        res.send("Failed to delete deck")
    }
    session.endSession()
}