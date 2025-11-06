import { useEffect, useState } from "react";
import api from "./service";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!newTask) return;
    await api.addTask(newTask);
    setNewTask("");
    fetchTasks();
  };

  const handleToggle = async (task) => {
    await api.setCompleted(task.id, !task.isComplete, task.name);
    fetchTasks();
  };

  const handleDelete = async (task) => {
    await api.deleteTask(task.id);
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      <input
        type="text"
        placeholder="New task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{ textDecoration: task.isComplete ? "line-through" : "none", cursor: "pointer" }}
              onClick={() => handleToggle(task)}
            >
              {task.name}
            </span>
            <button onClick={() => handleDelete(task)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
