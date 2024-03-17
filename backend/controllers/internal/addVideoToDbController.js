const axios = require("axios");
const pool = require("../../config/db");

exports.addVideoToDb = async (req, res) => {
  const videoId = req.body.video_id;

  try {
    const [existingVideo] = await pool.query(
      "SELECT * FROM summaries WHERE video_id = ?",
      [videoId]
    );

    let cacheHitStatus;
    let responseData = { videoId };

    let tokenUsed = {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };
    console.log(`cache hit status - ${existingVideo.length > 0}`);
    if (existingVideo.length > 0) {
      // If Video Exists in DB
      cacheHitStatus = true;
      responseData = {
        ...responseData,
        transcript: existingVideo[0].transcript,
        summary: existingVideo[0].summary,
        mcq: JSON.parse(existingVideo[0].q_and_a),
      };
    } else {
      // If Video Doesn't exist in DB
      const internalSummaryUrl = "http://localhost:3000/internal/summarize";
      let internalSummaryResponse;

      try {
        // To Get Summary
        internalSummaryResponse = await axios.post(internalSummaryUrl, {
          ...req.body,
        });
      } catch (error) {
        console.error("Error:", error);

        // Check if the error has a response with data
        const errorData = error.response ? error.response.data : {};

        return res.status(500).json({
          error: "Internal Server Error while summary generation",
          message: error.message,
          ...errorData, // Include the error data from the Axios response
        });
      }

      const { summary: summaryToSend, transcript: videoTranscript } =
        internalSummaryResponse.data;

      tokenUsed = internalSummaryResponse.data.usage;

      const internalMcqQueryUrl = "http://localhost:3000/internal/getMcq";
      let internalMcqQueryResponse;

      try {
        // To get MCQ Questions
        internalMcqQueryResponse = await axios.post(internalMcqQueryUrl, {
          summary: summaryToSend,
          number_of_questions: req.body.number_of_questions,
        });
      } catch (error) {
        return res.status(500).json({
          error: "Internal Server Error while mcq generation ",
          message: error.message,
        });
      }

      const questionsData = JSON.parse(internalMcqQueryResponse.data.questions);

      // Insert the new data into the database
      await pool.query(
        "INSERT INTO summaries (video_id, transcript, summary, q_and_a) VALUES (?, ?, ?, ?)",
        [videoId, videoTranscript, summaryToSend, JSON.stringify(questionsData)]
      );

      cacheHitStatus = false;

      responseData = {
        ...responseData,
        transcript: videoTranscript,
        summary: summaryToSend,
        mcq: questionsData,
      };
    }

    res.status(200).json({
      cache_hit: cacheHitStatus,
      token_used: tokenUsed,
      ...responseData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
