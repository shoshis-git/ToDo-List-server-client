import axios from "axios";

// הגדרת כתובת בסיס ל-API
const apiClient = axios.create({
  baseURL: "http://localhost:5126",
});

// Interceptor ל-request: מוסיף את ה-Authorization header אוטומטית
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor ל-response: תופס שגיאות 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default {
  register: (username, password) =>
    apiClient.post("/register", { username, password }).then(res => res.data),

  login: (username, password) =>
    apiClient.post("/login", { username, password }).then(res => {
      localStorage.setItem("token", res.data.token);
      return res.data;
    }),

  logout: () => {
    localStorage.removeItem("token");
  },

  getTasks: () => apiClient.get("/items").then(res => res.data),

  addTask: (name) =>
    apiClient.post("/items", { name, isComplete: false }).then(res => res.data),

  setCompleted: (id, isComplete, name) =>
    apiClient.put(`/items/${id}`, { id, name, isComplete }).then(res => res.data),

  deleteTask: (id) =>
    apiClient.delete(`/items/${id}`).then(res => res.data),
};
