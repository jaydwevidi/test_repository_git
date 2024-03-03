const axios = require("axios");
//const isTokenValid = require('./tokenValidator');
const { getSubtitles } = require("youtube-captions-scraper");

exports.getSummary = async (req, res) => {
  const open_ai_auth_token = process.env.OPEN_AI_KEY;
  const videoId = req.body.video_id;

  res.status(200).json({ message: "getSummary Working" });
};
