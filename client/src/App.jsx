
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./register";
import Login from "./login";
import Tasks from "./tasks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* כברירת מחדל */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;