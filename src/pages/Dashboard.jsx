import { useEffect, useState } from "react";
import { api } from "../api.js";
import Header from "../components/Header.jsx";
import TaskForm from "../components/TaskForm.jsx";
import FilterBar from "../components/FilterBar.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");        // error while loading tasks
  const [actionError, setActionError] = useState(""); // error while edit/delete/toggle
  const [filter, setFilter] = useState("all");

  // Load this user's tasks once when the page opens
  useEffect(() => {
    let ignore = false; // avoids setting state if the component was removed
    api
      .get("/tasks")
      .then((res) => !ignore && setTasks(res.data))
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, []);

  const addTask = async (data) => {
    const res = await api.post("/tasks", data);
    setTasks((prev) => [res.data, ...prev]);
  };

  const updateTask = async (id, changes) => {
    const res = await api.put(`/tasks/${id}`, changes);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const toggleTask = async (task) => {
    try {
      setActionError("");
      await updateTask(task._id, { completed: !task.completed });
    } catch (err) {
      setActionError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      setActionError("");
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setActionError(err.message);
    }
  };

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const visibleTasks = tasks.filter((t) =>
    filter === "all" ? true : filter === "completed" ? t.completed : !t.completed
  );

  return (
    <>
      <Header />
      <main className="container">
        <TaskForm onAdd={addTask} />
        <FilterBar filter={filter} onChange={setFilter} counts={counts} />

        {actionError && <p className="error banner" role="alert">{actionError}</p>}

        {loading && <p className="muted center-note">Loading your tasks...</p>}
        {error && <p className="error banner" role="alert">{error}</p>}

        {!loading && !error && visibleTasks.length === 0 && (
          <p className="empty">
            {tasks.length === 0
              ? "No tasks yet. Add your first task above."
              : `No ${filter} tasks.`}
          </p>
        )}

        {!loading && !error && visibleTasks.length > 0 && (
          <TaskList tasks={visibleTasks} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />
        )}
      </main>
    </>
  );
}
