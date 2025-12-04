import axios from 'axios';
import './auth.css';
// הגדרת axios עם כתובת הבסיס של ה-API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // אם השרת שלך ברץ ב-5000, אחרת עדכן לפי הצורך
});

// פונקציות לתקשורת עם ה-API

export default {
  

  // שליחה של משימה חדשה
  addTask: async(taskName) => apiClient.post('/items', { Name: taskName, IsComplete: false }),

  // קבלת כל המשימות
  getTasks: async () => {
  try {
    const response = await apiClient.get('/items');
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // מחזיר מערך ריק במקרה של שגיאה
  }
},

  // עדכון סטטוס של משימה
  updateTask: async(id, name, isComplete) => apiClient.put(`/items/${id}`, { Name: name, IsComplete: isComplete }),

  // מחיקת משימה
  deleteTask:async (id) => apiClient.delete(`/items/${id}`),
};
