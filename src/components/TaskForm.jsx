import { useState } from "react";

export default function TaskForm({ onAdd }) {
  // Controlled inputs: React state is the single source of truth for the form
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    // Form validation
    if (!cleanTitle) return setError("Please enter a task title");
    if (cleanTitle.length > 100) return setError("Title must be 100 characters or less");

    setSaving(true);
    setError("");
    try {
      await onAdd({ title: cleanTitle, priority });
      setTitle("");
      setPriority("medium");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task title"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Adding..." : "Add task"}
        </button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  );
}
