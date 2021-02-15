const { Router } = require("express");
const { model } = require("mongoose");

const Word = model("Word");

const router = Router();

//Allows user to get words
router.get("/words", async (req, res) => {
  const word = await Word.find();
  res.send(word);
});

//Retrieves the different word types
router.get("/types", async (req, res) => {
  const word = await Word.distinct("type");
  res.send(word);
});

//Allows user to submit a word type
router.post("/submit", async (req, res) => {
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

module.exports = router;
