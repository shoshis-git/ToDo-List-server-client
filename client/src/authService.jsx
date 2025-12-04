import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // כתובת השרת שלך
});

export default {
  // פונקציה לרישום משתמש
  register: async (username, password) => {
    try {
      const response = await apiClient.post('/register', { username, password });
      return response.data; // מחזיר את המידע על המשתמש שנרשם
    } catch (error) {
      throw error; // אם יש שגיאה, נזרוק אותה
    }
  },

  // פונקציה להתחברות
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/login', { username, password });
      return response.data; // מחזיר את המידע על המשתמש שהתחבר
    } catch (error) {
      throw error; // אם יש שגיאה, נזרוק אותה
    }
  },
};
