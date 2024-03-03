const axios = require('axios');
const isTokenValid = require('./tokenValidator');
const { getSubtitles } = require('youtube-captions-scraper');

exports.summarize = async (req, res) => {
    
    const open_ai_auth_token = process.env.OPEN_AI_KEY ;

    const videoId = req.body.video_id;
    if (!videoId){
        return res.status(400).json({ error: 'No Video Id Provided' }); 
    }

    const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
        const summary_word_count = req.body.word_limit || 100;
        const additional_instructions = req.body.additional_instructions || "";

        console.log(`Using Model - ${llm_model}, Word Limit - ${summary_word_count}`);

    try {

        const subtitles = await getSubtitles({
            videoID: videoId, // YouTube video ID
            lang: 'en' // Language for the subtitles
        });
        
        const subtitles_to_send = subtitles.map(subtitle => subtitle.text).join(' ');

        const requestBody = {
            "model": llm_model,
            "messages": [
                {
                    "role": "system",
                    "content": `Your Primary job summarize the transcript of the video in ${summary_word_count} words.
                    You should cover all the important points. Additional Instructions - ${additional_instructions}
                    `
                },
                {
                    "role": "user",
                    "content": subtitles_to_send // Using the extracted transcript
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
            "word_limit" : summary_word_count,
            "Additional Instructions" : additional_instructions
        };

    
        res.status(200).send(customResponse); // Sending the custom response
    } catch (error) {
        res.status(500).send(error.message);
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