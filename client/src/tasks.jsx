import { useEffect, useState } from "react";
import api from "./service";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTasks = async () => {
    const data = await api.getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    // שולח את השדה Name במקום Username
    await api.addTask({ Name: newTask, IsComplete: false });
    setNewTask("");
    fetchTasks();
  };

  const handleToggle = async (task) => {
    await api.setCompleted(task.id, !task.IsComplete, task.Name);
    fetchTasks();
  };

  const handleDelete = async (task) => {
    await api.deleteTask(task.id);
    fetchTasks();
  };

  const handleToggleAll = async () => {
    const allCompleted = tasks.every(t => t.IsComplete);
    for (const task of tasks) {
      if (task.IsComplete === allCompleted) {
        await api.setCompleted(task.id, !allCompleted, task.Name);
      }
    }
    fetchTasks();
  };

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.IsComplete);
    for (const task of completedTasks) {
      await api.deleteTask(task.id);
    }
    fetchTasks();
  };

  const handleEditStart = (task) => {
    setEditingId(task.id);
    setEditText(task.Name);
  };

  const handleEditSave = async (task) => {
    if (!editText.trim()) {
      handleDelete(task);
      return;
    }
    await api.setCompleted(task.id, task.IsComplete, editText);
    setEditingId(null);
    setEditText("");
    fetchTasks();
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (e, task) => {
    if (e.key === "Enter") handleEditSave(task);
    else if (e.key === "Escape") handleEditCancel();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.IsComplete;
    if (filter === "completed") return task.IsComplete;
    return true;
  });

  const activeCount = tasks.filter(t => !t.IsComplete).length;
  const completedCount = tasks.filter(t => t.IsComplete).length;

  return (
    <section className="todoapp">
      <h1>todos</h1>
      <header>
        <form onSubmit={handleAddTask}>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            autoFocus
          />
        </form>
      </header>

      {tasks.length > 0 && (
        <main className="main">
          <input
            className="toggle-all"
            id="toggle-all"
            type="checkbox"
            checked={tasks.every(t => t.IsComplete)}
            onChange={handleToggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>

          <ul className="todo-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`${task.IsComplete ? "completed" : ""} ${editingId === task.id ? "editing" : ""}`}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={task.IsComplete}
                    onChange={() => handleToggle(task)}
                  />
                  <label onDoubleClick={() => handleEditStart(task)}>
                    {task.Name} {/* כאן השתמשנו ב-Name במקום Username */}
                  </label>
                  <button className="destroy" onClick={() => handleDelete(task)}></button>
                </div>
                {editingId === task.id && (
                  <input
                    className="edit"
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => handleEditSave(task)}
                    onKeyDown={(e) => handleEditKeyDown(e, task)}
                    autoFocus
                  />
                )}
              </li>
            ))}
          </ul>
        </main>
      )}

      {tasks.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{activeCount}</strong>
            <span> {activeCount === 1 ? "item" : "items"} left</span>
          </span>

          <ul className="filters">
            <li>
              <a href="#/" className={filter === "all" ? "selected" : ""} onClick={(e) => { e.preventDefault(); setFilter("all"); }}>All</a>
            </li>
            <li>
              <a href="#/active" className={filter === "active" ? "selected" : ""} onClick={(e) => { e.preventDefault(); setFilter("active"); }}>Active</a>
            </li>
            <li>
              <a href="#/completed" className={filter === "completed" ? "selected" : ""} onClick={(e) => { e.preventDefault(); setFilter("completed"); }}>Completed</a>
            </li>
          </ul>

          {completedCount > 0 && <button className="clear-completed" onClick={handleClearCompleted}>Clear completed</button>}
        </footer>
      )}

      <footer className="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="https://github.com">Your Name</a></p>
      </footer>
    </section>
  );
}
