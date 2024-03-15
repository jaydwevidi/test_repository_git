const pool = require("../config/db");
const axios = require("axios");

exports.getHistory = async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    res.status(500).json({ error: "No user_id provided" });
    return;
  }

  try {
    // Query to get the history for the given user_id along with the summary from the summaries table
    const [rows] = await pool.query(
      "SELECT ur.videoId, ur.id, ur.total_tokens, s.summary FROM userRequests ur LEFT JOIN summaries s ON ur.videoId = s.video_id WHERE ur.userId = ?",
      [user_id]
    );

    // Check if any records were found
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the provided user_id" });
    }

    // Respond with the list of videoId, id, total_tokens, and summary
    res.status(200).json(rows);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the records" });
  }
};
