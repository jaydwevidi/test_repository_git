const axios = require('axios');
//const isTokenValid = require('./tokenValidator');
const { getSubtitles } = require('youtube-captions-scraper');


exports.summarize = async (req, res) => {
    const open_ai_auth_token = process.env.OPEN_AI_KEY;
    const videoId = req.body.video_id;

    const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
    const summary_word_count = req.body.word_limit || 100;
    const additional_instructions = req.body.additional_instructions || "";

    console.log(`Using Model - ${llm_model}, Word Limit - ${summary_word_count}`);

    try {
        try {
            subtitles = await getSubtitles({
                videoID: videoId,
                lang: 'en'
            });
        } catch (error) {
            console.error('Error fetching subtitles:', error);
            return res.status(500).json({ error: 'Failed to fetch subtitles', message: error.message });
        }
        
        const subtitles_to_send = subtitles.map(subtitle => subtitle.text).join(' ');

        const requestBody = {
            "model": llm_model,
            "messages": [
                {
                    "role": "system",
                    "content": `Your primary job is to summarize the transcript of the video in ${summary_word_count} words. You should cover all the important points. Additional Instructions: ${additional_instructions}`
                },
                {
                    "role": "user",
                    "content": subtitles_to_send
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
            summary: summaryContent,
            usage: usage,
            word_limit: summary_word_count,
            additional_instructions: additional_instructions,
            transcript: subtitles_to_send
        };

        res.status(200).json(customResponse); // Sending the custom response as JSON
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};




    //console.log(open_ai_auth_token);
    //user_token = req.body.user_token

    //if (!user_token) {
    //    return res.status(400).json({ error: 'User Token is required' });
    //  }
    
    //const isValid = await isTokenValid(user_token);
    //if (!isValid){
    //    return res.status(400).json({ error: 'Invalid Token' }); 
    //}