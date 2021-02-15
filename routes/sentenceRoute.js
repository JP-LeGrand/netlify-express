const { Router } = require("express");
const { model } = require("mongoose");

const Sentence = model("Sentence");

const router = Router();

//Allows user to get sentence history
router.get("/history", async (req, res) => {
  const sentence = await Sentence.find();
  res.send(sentence);
});

//Allows user to submit sentence
router.post("/submit", async (req, res) => {
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

module.exports = router;
