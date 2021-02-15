const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const wordSchema = new Schema({
  word: String,
  type: String,
});

//Define sentence schema
const sentenceSchema = new Schema({
  dateTime: Date,
  sentence: [wordSchema],
});

model("Sentence", sentenceSchema);
