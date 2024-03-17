const axios = require("axios");
//const isTokenValid = require('./tokenValidator');
const { getSubtitles } = require("youtube-captions-scraper");

exports.summarize = async (req, res) => {
  const open_ai_auth_token = process.env.OPEN_AI_KEY;
  const videoId = req.body.video_id;

  const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
  let summary_word_count = req.body.word_limit || 500;
  const additional_instructions = req.body.additional_instructions || "";

  if (summary_word_count > 200) {
    summary_word_count = 200;
  }

  console.log(
    `\nStarting Generating Summary. Model - ${llm_model}, Word Limit - ${summary_word_count}`
  );

  try {
    console.log("Extracting Subtitles/Transcript");
    subtitles = await getSubtitles({
      videoID: videoId,
      lang: "en",
    });

    let subtitles_to_send = subtitles
      .map((subtitle) => subtitle.text)
      .join(" ")
      .slice(0, 3000);

    const requestBody = {
      model: llm_model,
      messages: [
        {
          role: "system",
          content: `Your primary job is to summarize the transcript of the video in ${summary_word_count} words. You should cover all the important points. Additional Instructions: ${additional_instructions}`,
        },
        {
          role: "user",
          content: subtitles_to_send,
        },
      ],
    };

    const complete_req_body = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${open_ai_auth_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const summaryContent = complete_req_body.data.choices[0].message.content;
    const usage = complete_req_body.data.usage;

    const customResponse = {
      summary: summaryContent,
      usage: usage,
      word_limit: summary_word_count,
      additional_instructions: additional_instructions,
      transcript: subtitles_to_send,
    };

    console.log(
      `\nSummary Generation Successful - ${customResponse.summary.slice(
        0,
        50
      )} \n`
    );

    res.status(200).json(customResponse); // Sending the custom response as JSON
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};
