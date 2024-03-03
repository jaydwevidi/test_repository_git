const axios = require('axios');
const pool = require('../config/db');

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
        const video_id = videoId;

        // Check if the video_id already exists in the database
        const [existingVideo] = await pool.query(
            'SELECT * FROM summaries WHERE video_id = ?',
            [video_id]
        );

        if (existingVideo.length > 0) {
            // Video ID exists, so retrieve and store data in variables
            const transcript = existingVideo[0].transcript;
            const summary = existingVideo[0].summary;
            const qna = existingVideo[0].q_and_a;

            // Do something with the retrieved data
            // For example, send it back in the response
            res.status(200).json({ message: 'Old Video_id , Retrived Successfully', transcript:  transcript, summary : summary, q_and_a : qna });
        } else {
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
                const questionsData = internalQuestionsResponse.data.questions;
        
                console.log("\n\n internal question response ", questionsData);
        
                // Create a response object containing the parsed data
                const responseObj = {
                    summary: summaryToSend,
                    q_and_a : JSON.parse(questionsData)
                };
        
                // Send the response object as JSON
               
        
        
        
                try {
                    // Insert the new data into the summaries table
        
                    const [result] = await pool.query(
                        'INSERT INTO summaries (video_id, transcript, summary, q_and_a) VALUES (?, ?, ?, ?)',
                        [video_id, "Transcript Place Holder", summaryToSend, String(questionsData.questions)]
                    );
            
                    res.status(201).json({ response : responseObj, cache_hit: 'New Data, Strored In Database', videoId: video_id });
                } catch (error) {
                    res.status(500).json({ message: 'Error storing data', error: error.message });
                }
        
        
        
            } catch (error) {
                console.error('Error calling internal API:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data from database using video_id', error: error.message });
    }


}
