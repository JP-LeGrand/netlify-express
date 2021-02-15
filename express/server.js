"use strict";
require("../model/sentence.js");
require("../model/word.js");
const express = require("express");
const sentenceRoute = require("../routes/sentenceRoute.js");
const wordRoute = require("../routes/wordRoute.js");
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
app.use("/sentence", sentenceRoute);
app.use("/word", wordRoute);

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
router.get("/another", (req, res) => res.json({ route: req.originalUrl }));
router.post("/", (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", (req, res) => res.sendFile(path.join(__dirname, "../index.html")));

module.exports = app;
module.exports.handler = serverless(app);
