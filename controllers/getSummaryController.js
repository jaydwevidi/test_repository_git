const axios = require("axios");
const pool = require("../config/db");

exports.getSummary = async (req, res) => {
  console.log("\n\nInside Get Summary from User \n\n");

  const userId = req.body.user_id;

  if (!userId) {
    res.status(400).json({ message: "No User Id Provided" });
  }

  const videoId = req.body.video_id;
  if (!videoId) {
    res.status(400).json({ message: "No Video Id Provided" });
  }

  try {
    const addVideoToDbUrl = "http://localhost:3000/addVideoToDb";
    const addVideoToDbResponse = await axios.post(addVideoToDbUrl, {
      ...req.body,
    });
    console.log("Response from addVideoToDb:", addVideoToDbResponse.data);

    // Define summaryContent and usage variables here

    const cacheHitInt = addVideoToDbResponse.data.cache_hit ? 1 : 0;

    const [result] = await pool.query(
      "INSERT INTO userRequests (videoId, userId, total_tokens, completion_tokens, prompt_tokens, score, totalScore, cache_hit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        videoId,
        userId,
        addVideoToDbResponse.data.token_used.total_tokens,
        addVideoToDbResponse.data.token_used.completion_tokens,
        addVideoToDbResponse.data.token_used.prompt_tokens,
        null,
        null,
        cacheHitInt,
      ]
    );

    const insertedId = result.insertId;

    res.status(200).json({
      mcq_id: insertedId,
      user_id: userId,
      ...addVideoToDbResponse.data,
    });
  } catch (error) {
    console.error("Error in addVideoToDb request:", error);
    const errorData = error.response ? error.response.data : {};
    res.status(500).json({
      error: "Internal Server Error ",
      message: error.message,
      ...errorData,
    });
  }
};
