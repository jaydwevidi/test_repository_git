const axios = require("axios");
const pool = require("../config/db");

exports.addVideoToDb = async (req, res) => {
  console.log(
    "\nStarting Add Video To DB  \n\n\n\n video id - " + req.body.video_id
  );

  const videoId = req.body.video_id;

  try {
    // Check if the video_id already exists in the database
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

    if (existingVideo.length > 0) {
      // Video ID exists, so retrieve and store data in variables
      cacheHitStatus = "Old Video_id, Retrieved Successfully";
      responseData = {
        ...responseData,
        transcript: existingVideo[0].transcript,
        summary: existingVideo[0].summary,
        mcq: JSON.parse(existingVideo[0].q_and_a),
      };

      console.log(`Caches hit \n\n - ${cacheHitStatus}`);
    } else {
      // Define the internal API endpoint URL and any required parameters
      const internalSummaryUrl = "http://localhost:3000/summarize";
      let internalSummaryResponse; // Define outside of the try block

      try {
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

      // Process the internal API response
      const { summary: summaryToSend, transcript: videoTranscript } =
        internalSummaryResponse.data;

      tokenUsed = internalSummaryResponse.data.usage;

      console.log(`1internal summary response data summary - ${summaryToSend}`);

      const internalQuestionsUrl = "http://localhost:3000/getMcq";
      let internalQuestionsResponse; // Define outside of the try block
      try {
        internalQuestionsResponse = await axios.post(internalQuestionsUrl, {
          summary: summaryToSend,
          number_of_questions: req.body.number_of_questions,
        });
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
          error: "Internal Server Error while mcq generation ",
          message: error.message,
        });
      }

      // Extract the data from the internalQuestionsResponse
      const questionsData = JSON.parse(
        internalQuestionsResponse.data.questions
      );

      console.log("\n\n1 Internal question response ", questionsData);

      // Insert the new data into the database
      await pool.query(
        "INSERT INTO summaries (video_id, transcript, summary, q_and_a) VALUES (?, ?, ?, ?)",
        [videoId, videoTranscript, summaryToSend, JSON.stringify(questionsData)]
      );

      console.log("\n\n1   Pool Query Successful");

      cacheHitStatus = "New Data, Stored In Database";
      responseData = {
        ...responseData,
        transcript: videoTranscript,
        summary: summaryToSend,
        mcq: questionsData,
      };
    }
    console.log("\n\n Ready to return response.");
    res.status(200).json({
      token_used: tokenUsed,
      ...responseData,
      cache_hit: cacheHitStatus,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
