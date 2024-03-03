const axios = require('axios');
const pool = require('../config/db');

exports.addVideoToDb = async (req, res) => {
    const videoId = req.body.video_id;
    if (!videoId) {
        return res.status(400).json({ error: 'No Video Id Provided' });
    }

    const llmModel = req.body.llm_model || 'gpt-3.5-turbo-0125';
    const summaryWordCount = req.body.word_limit || 100;
    const additionalInstructions = req.body.additional_instructions || '';

    console.log(`Using Model - ${llmModel}, \nWord Limit - ${summaryWordCount}\nadditional instructions - ${additionalInstructions}`);

    const existingVideo = await checkExistingVideo(videoId);

    if (existingVideo) {
        return res.status(200).json({
            cache_hit: 'Old Video_id, Retrieved Successfully',
            transcript: existingVideo.transcript,
            summary: existingVideo.summary,
            q_and_a: JSON.parse(existingVideo.q_and_a),
            videoId: videoId
        });
    } else {
        try {
            const summaryData = await generateSummary(videoId, summaryWordCount, additionalInstructions, llmModel);
            const questionsData = await generateQuestions(summaryData.summary, req.body.number_of_questions);

            await storeVideoData(videoId, summaryData.transcript, summaryData.summary, questionsData);

            res.status(201).json({
                cache_hit: 'New Data, Stored In Database',
                transcript: summaryData.transcript,
                summary: summaryData.summary,
                q_and_a: questionsData,    
                videoId: videoId
            });
        } catch (error) {
            console.error('Error processing video data:', error);
            return res.status(500).json({ error: 'Internal Server Error' , cache_hit : "New Data, Error Storing in DB" });
        }
    }
};

async function checkExistingVideo(videoId) {
    const [existingVideo] = await pool.query('SELECT * FROM summaries WHERE video_id = ?', [videoId]);
    return existingVideo.length > 0 ? existingVideo[0] : null;
}

async function generateSummary(videoId, wordLimit, additionalInstructions, llmModel) {
    const internalSummaryUrl = 'http://localhost:3000/summarize';
    const internalSummaryResponse = await axios.post(internalSummaryUrl, {
        video_id: videoId,
        word_limit: wordLimit,
        additional_instructions: additionalInstructions,
        llm_model: llmModel
    });

    return {
        summary: internalSummaryResponse.data.summary,
        transcript: internalSummaryResponse.data.transcript
    };
}

async function generateQuestions(summary, numberOfQuestions) {
    const internalQuestionsUrl = 'http://localhost:3000/getMcq';
    const internalQuestionsResponse = await axios.post(internalQuestionsUrl, {
        summary: summary,
        number_of_questions: numberOfQuestions
    });

    return JSON.parse(internalQuestionsResponse.data.questions);
}

async function storeVideoData(videoId, transcript, summary, qAndA) {
    await pool.query('INSERT INTO summaries (video_id, transcript, summary, q_and_a) VALUES (?, ?, ?, ?)', [
        videoId,
        transcript,
        summary,
        JSON.stringify(qAndA)
    ]);
}
