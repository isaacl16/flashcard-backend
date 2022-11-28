const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;
const deckRouter = require("./routes/decks");
// const mongoose = require("mongoose");
// require('dotenv').config()

// const uri = process.env.REACT_APP_MONGODB_URI

// const options = {
//     dbName: process.env.REACT_APP_MONGODB_DBNAME, useNewUrlParser: true, useUnifiedTopology: true
// }

// mongoose.connect(uri, options)
//     .then(
//         () => { console.log('Database is connected') },
//         err => { console.log('There is problem while connecting database ' + err) }
//     );

// const whitelist = ["http://localhost:5173"];
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
// };

// app.use(cors(corsOptions))

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use('/decks', deckRouter)
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});