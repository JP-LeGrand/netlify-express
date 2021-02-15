const mongoose = require("mongoose");
const { Schema, model } = mongoose;

//Define word schema
const wordSchema = new Schema({
  word: {
    type: String,
    unique: true,
    required: true,
  },
  type: String,
});

model("Word", wordSchema);
