import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Render מספק PORT אוטומטית

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        Authorization: `Bearer ${process.env.RENDER_API_KEY}`
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching services');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
