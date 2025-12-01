import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const apiKey = process.env.YOUR_RENDER_API_KEY; // שם המשתנה כפי שהגדרת ב-.env

axios.get('https://api.render.com/v1/services', {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Accept': 'application/json',
  }
}).then(res => {
  console.log(res.data);
}).catch(err => {
  console.error(err);
});
