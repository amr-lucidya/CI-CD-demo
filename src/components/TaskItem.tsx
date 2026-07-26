import type { Task } from "../lib/tasks";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TaskItem({ task, onToggle, onRemove }: TaskItemProps) {
  return (
    <li className={`task-item ${task.done ? "is-done" : ""}`} data-testid="task-item">
      <label className="task-item__main">
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
          aria-label={`Mark "${task.title}" as ${task.done ? "active" : "complete"}`}
        />
        <span className="task-item__title">{task.title}</span>
      </label>
      <span className={`badge badge--${task.priority}`}>{task.priority}</span>
      <button
        className="task-item__remove"
        onClick={() => onRemove(task.id)}
        aria-label={`Delete "${task.title}"`}
      >
        ✕
      </button>
    </li>
  );
}
