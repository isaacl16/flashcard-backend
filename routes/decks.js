const decksController = require("../controllers/decksController.js")
const express = require("express");
const router = express.Router();


router.get("/", decksController.getDecks);

router.post("/", decksController.createDeck);

router.get("/:_id", decksController.getDeck);

router.patch("/:_id", decksController.updateDeck);

router.delete("/:_id", decksController.deleteDeck);








module.exports = router;
