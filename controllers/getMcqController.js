const axios = require('axios');


function constructPrompt(summary , number_of_q) {
    const prompt = `
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
        },
        // more question and answers 

        
    ]


    don't use new line, not necessary. As long as it's a valid json. I'm using your response inside a backend and as a api response directly.
    `;
    return prompt;
}


exports.getMcq = async (req, res) => {

    console.log("\n\n Inside Mcq \n\n + ");
    const open_ai_auth_token = process.env.OPEN_AI_KEY ;

    const summary = req.body.summary;

    if (!summary){
        return res.status(400).json({ error: 'No Summary Provided' }); 
    }

    const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
    const number_of_questions = req.body.number_of_questions || 3;

    if(number_of_questions > 5){
        number_of_questions = 5;
    }

    
    console.log(`Using Model - ${llm_model}`);

    try {

        const requestBody = {
            "model": llm_model,
            "messages": [
                {
                    "role": "system",
                    "content": constructPrompt(summary, number_of_questions)
                },
                {
                    "role": "user",
                    "content": summary
                }
            ]
        };
    
        const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
            headers: {
                'Authorization': `Bearer ${open_ai_auth_token}`,
                'Content-Type': 'application/json',
            }
        });
    
        const summaryContent = response.data.choices[0].message.content;
        const usage = response.data.usage;
    
        const customResponse = {
            questions: summaryContent,
            usage: usage
        };

        console.log(` \n\n custom response - ${customResponse}`);
        res.status(200).send(customResponse); // Sending the custom response
    } catch (error) {
        res.status(500).send(error.message);
    }
};