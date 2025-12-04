import axios from 'axios';
import './auth.css';
// הגדרת axios עם כתובת הבסיס של ה-API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // אם השרת שלך ברץ ב-5000, אחרת עדכן לפי הצורך
});

// פונקציות לתקשורת עם ה-API

export default {
  

  // שליחה של משימה חדשה
  addTask: (taskName) => apiClient.post('/items', { Name: taskName, IsComplete: false }),

  // קבלת כל המשימות
  getTasks: () => apiClient.get('/items'),

  // עדכון סטטוס של משימה
  updateTask: (id, name, isComplete) => apiClient.put(`/items/${id}`, { Name: name, IsComplete: isComplete }),

  // מחיקת משימה
  deleteTask: (id) => apiClient.delete(`/items/${id}`),
};
