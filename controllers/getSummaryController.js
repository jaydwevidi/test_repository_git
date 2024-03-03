const axios = require("axios");
const pool = require("../config/db");
const { getSubtitles } = require("youtube-captions-scraper");

exports.getSummary = async (req, res) => {
  console.log("\n\nInside Get Summary from User \n\n");

  const userId = req.body.user_id;

  if (!userId) {
    res.status(400).json({ message: "No User Id Provided" });
  }

  const open_ai_auth_token = process.env.OPEN_AI_KEY;
  const videoId = req.body.video_id;

  const addVideoToDbUrl = "http://localhost:3000/addVideoToDb";

  try {
    const addVideoToDbResponse = await axios.post(addVideoToDbUrl, {
      ...req.body,
    });
    console.log("Response from addVideoToDb:", addVideoToDbResponse.data);

    // Define summaryContent and usage variables here

    await pool.query(
      "INSERT INTO userRequests (videoId, userId, total_tokens , completion_tokens , prompt_tokens , score, totalScore ) VALUES (?, ?, ?, ? , ? , ? , ? )",
      [
        videoId,
        userId,
        addVideoToDbResponse.data.token_used.total_tokens,
        addVideoToDbResponse.data.token_used.completion_tokens,
        addVideoToDbResponse.data.token_used.prompt_tokens,
        null,
        null,
      ]
    );

    res.status(200).json({
      message: "Data Added in userRequests Successfully",
      ...addVideoToDbResponse.data,
      user_id: userId,
    });
  } catch (error) {
    console.error("Error in addVideoToDb request:", error);
    const errorData = error.response ? error.response.data : {};
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      ...errorData,
    });
  }
};
