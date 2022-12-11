const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const deckRouter = require("./routes/decks");

const whitelist = ["http://localhost:5173"];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(cors())

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/decks', deckRouter)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});