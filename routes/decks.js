const decksController = require("../controllers/decksController.js")
const express = require("express");
const router = express.Router();


router.get("/", decksController.getDecks);

router.post("/", decksController.createDeck);

router.get("/:id", decksController.getDeck);

router.put("/:id", decksController.updateDeck);

router.delete("/:id", decksController.deleteDeck);








module.exports = router;
