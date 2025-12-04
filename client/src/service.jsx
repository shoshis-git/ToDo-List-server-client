import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5126",
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
const API_URL = "https://todo-list-server-client.onrender.com/items";
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

  addTask: async (name) => {
    const res = await axios.post(API_URL, { name, isComplete: false });
    return res.data;
  },

  setCompleted: async (id, isComplete, name) => {
    const res = await axios.put(`${API_URL}/${id}`, { name, isComplete });
    return res.data;
  },

  deleteTask: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },
  
};







