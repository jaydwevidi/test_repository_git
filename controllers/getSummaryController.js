const axios = require("axios");
//const isTokenValid = require('./tokenValidator');
const { getSubtitles } = require("youtube-captions-scraper");

exports.getSummary = async (req, res) => {
  const open_ai_auth_token = process.env.OPEN_AI_KEY;
  const videoId = req.body.video_id;

  const addVideoToDbUrl = "http://localhost:3000/addVideoToDb";
  addVideoToDbResponse = await axios.post(addVideoToDbUrl, {
    video_id: req.body.video_id,
    number_of_questions: req.body.number_of_questions,
  });

  res
    .status(200)
    .json({ message: "getSummary Working", ...addVideoToDbResponse });
};
