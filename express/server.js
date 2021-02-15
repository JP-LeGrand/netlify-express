"use strict";
require("../model/sentence");
require("../model/word");
const express = require("express");
const mongoose = require("mongoose");
const { connect, connection } = mongoose;
const path = require("path");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello from Express.js!</h1>");
  res.end();
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const mongoUri =
  "mongodb+srv://admin:passwordpassword@cluster0.fe0mt.mongodb.net/SentenceBuilder?retryWrites=true&w=majority";
connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

//Checks our connections is successful to mongo instance
connection.on("connected", () => {
  console.log("Connected to mongo instance");
});

connection.on("error", (err) => {
  console.error("Error connecting to mongo", err);
});

const Sentence = mongoose.model("Sentence");
const Word = mongoose.model("Word");

router.get("/word/words", async (req, res) => {
  const word = await Word.find();
  res.send(word);
});

//Retrieves the different word types
router.get("/word/types", async (req, res) => {
  const word = await Word.distinct("type");
  res.send(word);
});

//Allows user to submit a word type
router.post("/word/submit", async (req, res) => {
  const { word, type } = req.body;
  if (!word || !type) {
    return res.status(422).send({ error: "You must provide a  word and type" });
  }

  try {
    const w = new Word({ word, type });
    await w.save();
    res.send(w);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
});
//Allows user to get sentence history
router.get("/sentence/history", async (req, res) => {
  const sentence = await Sentence.find();
  res.send(sentence);
});

//Allows user to submit sentence
router.post("/sentence/submit", async (req, res) => {
  const { sentence, dateTime } = req.body;
  if (!sentence || !dateTime) {
    return res
      .status(422)
      .send({ error: "You must provide a  sentence and dateTime" });
  }

  try {
    const s = new Sentence({ sentence, dateTime });
    await s.save();
    res.send(s);
  } catch (err) {
    return res.status(422).send({ error: err.message });
  }
});

router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
