import { useEffect, useState } from 'react';
import api from './service';
import './auth.css';
export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // פונקציה להורדת כל המשימות
  const fetchTasks = async () => {
    try {
      const response = await api.getTasks();
      console.log(response);
      setTasks(response||[]);
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  // הוספת משימה חדשה
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await api.addTask(newTask);
      fetchTasks(); 
      setNewTask("");
    } catch (error) {
      console.log("Error adding task:", error);
    }
  };

  // מחיקת משימה
  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log("Error deleting task:", error);
    }
  };

  // עדכון סטטוס של משימה
  const handleToggleTask = async (task) => {
    try {
      await api.updateTask(task.id, task.name, !task.isComplete);
      fetchTasks();
    } catch (error) {
      console.log("Error updating task:", error);
    }
  };

  useEffect(() => {

    fetchTasks();
  }, []);

  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <form onSubmit={handleAddTask}>
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input 
              type="checkbox" 
              checked={task.isComplete} 
              onChange={() => handleToggleTask(task)}
            />
            <span>{task.name}</span>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
