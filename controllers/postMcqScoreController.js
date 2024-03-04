const pool = require("../config/db");
const axios = require("axios");

exports.postMcqScore = async (req, res) => {
  const { user_score, total_score, mcq_id } = req.body;

  // Check if the required parameters are provided
  if (
    user_score === undefined ||
    total_score === undefined ||
    mcq_id === undefined
  ) {
    return res.status(400).json({
      error: "Missing required parameters - mcq_id, user_score, total_score",
    });
  }

  if (user_score > total_score) {
    return res
      .status(400)
      .json({ error: "User score cannot be more than total score" });
  }

  try {
    // Update the row with the given request_id
    const [result] = await pool.query(
      "UPDATE userRequests SET score = ?, totalScore = ? WHERE id = ?",
      [user_score, total_score, mcq_id]
    );

    // Check if any row was updated
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No record found with the provided request_id" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the record" });
  }
};
