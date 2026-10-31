import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
