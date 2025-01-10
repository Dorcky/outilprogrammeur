const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors package
const app = express();

// Enable CORS for all origins (you can restrict it to localhost:3002 if needed)
app.use(cors());

app.use(express.json());

// Your API key from the Google API
const API_KEY = process.env.GEMINI_API_KEY;  // Ensure you've set up a .env file with this key

// Route to handle API requests
app.post('/generateContent', async (req, res) => {
  try {
    const response = await axios.post('https://generativeai.googleapis.com/v1beta/models/gemini-pro:generateContent', req.body, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
