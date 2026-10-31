import { useState } from "react";

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [error, setError] = useState("");

  const saveEdit = async () => {
    const cleanTitle = draft.trim();
    if (!cleanTitle) return setError("Title cannot be empty");
    try {
      await onUpdate(task._id, { title: cleanTitle });
      setEditing(false);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setDraft(task.title);
    setError("");
    setEditing(false);
  };

  return (
    <li className={task.completed ? "task done" : "task"}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={`Mark "${task.title}" as complete`}
      />

      <div className="task-body">
        {editing ? (
          <>
            <input
              className="edit-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              autoFocus
            />
            {error && <p className="error">{error}</p>}
          </>
        ) : (
          <span className="task-title">{task.title}</span>
        )}
      </div>

      <span className={`badge badge-${task.priority}`}>{task.priority}</span>

      <div className="task-actions">
        {editing ? (
          <>
            <button className="btn btn-small" onClick={saveEdit}>Save</button>
            <button className="btn btn-small btn-ghost" onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn btn-small btn-ghost" onClick={() => setEditing(true)}>Edit</button>
            <button
              className="btn btn-small btn-danger"
              onClick={() => window.confirm("Delete this task?") && onDelete(task._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}
