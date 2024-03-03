const axios = require('axios');

exports.addVideoToDb = async (req, res) => {

    const videoId = req.body.video_id;

    if (!videoId){
        return res.status(400).json({ error: 'No Video Id Provided' }); 
    }

    const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
    const summary_word_count = req.body.word_limit || 100;
    const additional_instructions = req.body.additional_instructions || "";
    var number_of_questions = req.body.number_of_questions || 3;

    if(number_of_questions > 5){
        number_of_questions = 5;
    }

    console.log(`Using Model - ${llm_model}, \nWord Limit - ${summary_word_count}\nadditional instructions - ${additional_instructions}`);

   

    try {

        // Define the internal API endpoint URL and any required parameters
        const internalSummaryUrl = 'http://localhost:3000/summarize';
        const internalSummaryResponse = await axios.post(internalSummaryUrl, {
            video_id: videoId,
            word_limit: summary_word_count,
            additional_instructions : additional_instructions,
            llm_model : llm_model,
        });

        // Process the internal API response
        const summaryToSend = internalSummaryResponse.data.summary;

        const internalQuestionsUrl = 'http://localhost:3000/getMcq';
        const internalQuestionsResponse = await axios.post(internalQuestionsUrl, {
            summary: summaryToSend,
            number_of_questions : number_of_questions
        });

        console.log("summary to send -- \n\n" + summaryToSend);

        // Extract the data from the internalQuestionsResponse
        const questionsData = internalQuestionsResponse.data;

        console.log("\n\n internal question response ", questionsData);

        // Create a response object containing the parsed data
        const responseObj = {
            summary: summaryToSend,
            questions: JSON.parse(questionsData.questions)
        };

        // Send the response object as JSON
        res.status(200).json(responseObj);
    } catch (error) {
        console.error('Error calling internal API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
