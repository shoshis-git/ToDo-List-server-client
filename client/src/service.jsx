import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ---- REQUEST ----
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- RESPONSE ----
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

const API_URL = `${process.env.REACT_APP_API_URL}/tasks`;

// ---- API FUNCTIONS ----
export default {
  register: (username, password) =>
    apiClient.post("/register", { username, password }).then(res => res.data),

  login: (username, password) =>
    apiClient.post("/login", { username, password }).then(res => {
      localStorage.setItem("token", res.data.token);
      return res.data;
    }),

  logout: () => localStorage.removeItem("token"),

  getTasks: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  addTask: async (taskName) => {
    // שולח אובייקט עם השדות לפי המסד
    const res = await axios.post(API_URL, { Name: taskName, IsComplete: false });
    return res.data;
  },

  setCompleted: async (id, isComplete, name) => {
    const res = await axios.put(`${API_URL}/${id}`, {
      Name: name,
      IsComplete: isComplete,
    });
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  },
};
