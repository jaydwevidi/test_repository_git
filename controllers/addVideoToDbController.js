const axios = require("axios");
const pool = require("../config/db");

exports.addVideoToDb = async (req, res) => {
  console.log("\nStarting Add Video To DB\n");
  const videoId = req.body.video_id;

  if (!videoId) {
    return res.status(400).json({ error: "No Video Id Provided" });
  }

  const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
  const summary_word_count = req.body.word_limit || 100;
  const additional_instructions = req.body.additional_instructions || "";

  console.log(
    `Using Model - ${llm_model}, \nWord Limit - ${summary_word_count}\nadditional instructions - ${additional_instructions}`
  );

  try {
    // Check if the video_id already exists in the database
    const [existingVideo] = await pool.query(
      "SELECT * FROM summaries WHERE video_id = ?",
      [videoId]
    );

    let cacheHitStatus;
    let responseData = { videoId };

    if (existingVideo.length > 0) {
      // Video ID exists, so retrieve and store data in variables
      cacheHitStatus = "Old Video_id, Retrieved Successfully";
      responseData = {
        ...responseData,
        transcript: existingVideo[0].transcript,
        summary: existingVideo[0].summary,
        q_and_a: JSON.parse(existingVideo[0].q_and_a),
      };
    } else {
      // Define the internal API endpoint URL and any required parameters
      const internalSummaryUrl = "http://localhost:3000/summarize";
      let internalSummaryResponse; // Define outside of the try block
      try {
        internalSummaryResponse = await axios.post(internalSummaryUrl, {
          video_id: videoId,
          word_limit: summary_word_count,
          additional_instructions: additional_instructions,
          llm_model: llm_model,
        });
      } catch (error) {
        console.error("Error:", error);

        // Check if the error has a response with data
        const errorData = error.response ? error.response.data : {};

        return res.status(500).json({
          error: "Internal Server Error while summary generation",
          message: error.message,
          details: errorData, // Include the error data from the Axios response
        });
      }

      // Process the internal API response
      const { summary: summaryToSend, transcript: videoTranscript } =
        internalSummaryResponse.data;

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
      console.log("Summary to send -- \n\n" + summaryToSend);

      // Extract the data from the internalQuestionsResponse
      const questionsData = JSON.parse(
        internalQuestionsResponse.data.questions
      );

      console.log("\n\nInternal question response ", questionsData);

      // Insert the new data into the database
      await pool.query(
        "INSERT INTO summaries (video_id, transcript, summary, q_and_a) VALUES (?, ?, ?, ?)",
        [videoId, videoTranscript, summaryToSend, JSON.stringify(questionsData)]
      );

      cacheHitStatus = "New Data, Stored In Database";
      responseData = {
        ...responseData,
        transcript: videoTranscript,
        summary: summaryToSend,
        q_and_a: questionsData,
      };
    }

    res.status(200).json({ ...responseData, cache_hit: cacheHitStatus });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
