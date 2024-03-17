const pool = require("../../config/db");

exports.fetchMcqData = async (req, res) => {
  const { user_id, mcq_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "No user_id provided" });
  }

  if (!mcq_id) {
    return res.status(400).json({ error: "No mcq_id provided" });
  }

  try {
    const query = `
      SELECT s.q_and_a
      FROM userRequests u
      JOIN summaries s ON u.videoId = s.id
      WHERE u.userId = ? AND u.id = ?;
    `;

    const [rows] = await pool.query(query, [user_id, mcq_id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No mcq found for the given user_id and mcq_id" });
    }

    res.status(200).json(rows[0]); // Assuming you want to return the first row
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the records" });
  }
};
