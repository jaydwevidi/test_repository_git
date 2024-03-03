const axios = require("axios");
const { getSubtitles } = require("youtube-captions-scraper");

exports.getSummary = async (req, res) => {
  console.log("\n\nInside Get Summary from User \n\n");
  const open_ai_auth_token = process.env.OPEN_AI_KEY;
  const videoId = req.body.video_id;

  const addVideoToDbUrl = "http://localhost:3000/addVideoToDb";

  try {
    const addVideoToDbResponse = await axios.post(addVideoToDbUrl, {
      video_id: req.body.video_id,
      number_of_questions: req.body.number_of_questions,
    });
    console.log("Response from addVideoToDb:", addVideoToDbResponse.data);

    // Define summaryContent and usage variables here

    res.status(200).json({
      response: addVideoToDbResponse.data,
    });
  } catch (error) {
    console.error("Error in addVideoToDb request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
