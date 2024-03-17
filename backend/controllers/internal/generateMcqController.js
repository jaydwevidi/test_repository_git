const axios = require("axios");
const open_ai_auth_token = process.env.OPEN_AI_KEY;

exports.getMcq = async (req, res) => {
  const summary = req.body.summary;
  const llm_model = "gpt-3.5-turbo-0125";
  let number_of_questions = req.body.number_of_questions || 2;

  console.log(
    `\nInside MCQ Generator. llm - ${llm_model} ; number of questions - ${number_of_questions}`
  );
  if (!summary) {
    return res.status(400).json({ error: "No Summary Provided" });
  }

  if (number_of_questions > 5) {
    number_of_questions = 5;
  }

  try {
    const requestBody = {
      model: llm_model,
      messages: [
        {
          role: "system",
          content: constructPrompt(summary, number_of_questions),
        },
        {
          role: "user",
          content: summary,
        },
      ],
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${open_ai_auth_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const mcqContent = response.data.choices[0].message.content;
    const usage = response.data.usage;

    // console.log(`\n\n Custom response - ${mcqContent}`);
    console.log("MCQ generation Successful.");
    res.status(200).json({ questions: mcqContent, usage: usage });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

function constructPrompt(summary, number_of_q) {
  const prompt = `
    Only Respond in JSON Format. 
    Given the summary: "${summary}", generate ${number_of_q} multiple-choice questions based on the content. Each question should have four options (A, B, C, D) and a correct answer. Format the output as JSON.

    Example:
    [
        {
            "question": "What is the capital of France?",
            "options": {
                "A": "Paris",
                "B": "London",
                "C": "Berlin",
                "D": "Madrid"
            },
            "answer": "A"
        }
        // more questions
    ]
    `;
  return prompt;
}
