const axios = require("axios");
//const isTokenValid = require('./tokenValidator');
const { getSubtitles } = require("youtube-captions-scraper");

exports.getSummary = async (req, res) => {
  console.log("\n\nInside Get Summary from User \n\n");
  const open_ai_auth_token = process.env.OPEN_AI_KEY;
  const videoId = req.body.video_id;

  const addVideoToDbUrl = "http://localhost:3000/addVideoToDb";

  addVideoToDbResponse = await axios.post(addVideoToDbUrl, {
    video_id: req.body.video_id,
    number_of_questions: req.body.number_of_questions,
  });

  console.log("\n\n\n\n\n\n " + addVideoToDbResponse);

  res.status(200).json({
    respon: addVideoToDbResponse,
  });
};
