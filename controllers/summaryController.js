const axios = require('axios');

exports.summarize = async (req, res) => {
    try {
      const token = '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';
      const transcript = req.body.transcript; // Extracting transcript from the request body
      const llm_model = req.body.llm_model || "gpt-3.5-turbo-0125";
  
      console.log("using model - " + llm_model);
      const requestBody = {
        "model": llm_model,
        "messages": [
          {
            "role": "system",
            "content": "Your job is to return the summary of a video transcript in 10-200 words. Smaller The better."
          },
          {
            "role": "user",
            "content": transcript // Using the extracted transcript
          }
        ]
      };
  
      const response = await axios.post('https://api.openai.com/v1/chat/completions', requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          // Add any other headers you need here
        }
      });
  
      // Extracting the content and usage from the response
      const summaryContent = response.data.choices[0].message.content;
      const usage = response.data.usage;
  
      // Creating a custom response object
      const customResponse = {
        summary: summaryContent,
        usage: usage
      };
  
      res.status(200).send(customResponse); // Sending the custom response
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
