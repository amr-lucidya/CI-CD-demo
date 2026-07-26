export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  done: boolean;
  createdAt: number;
}

export type Filter = "all" | "active" | "completed";

export interface TaskStats {
  total: number;
  active: number;
  completed: number;
  percentComplete: number;
}

let idCounter = 0;

/** Deterministic-ish id generator (fine for a demo / easy to test around). */
export function makeId(): string {
  idCounter += 1;
  return `task-${idCounter}`;
}

/**
 * Create a task from a raw title. Trims whitespace and validates.
 * Throws when the title is empty so the UI can surface an error.
 */
export function createTask(title: string, priority: Priority = "medium", createdAt = 0): Task {
  const clean = title.trim();
  if (clean.length === 0) {
    throw new Error("Task title cannot be empty");
  }
  return {
    id: makeId(),
    title: clean,
    priority,
    done: false,
    createdAt,
  };
}

/** Toggle the `done` flag of the task with the given id (immutably). */
export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

/** Remove a task by id (immutably). */
export function removeTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((task) => task.id !== id);
}

/** Filter tasks by the current view. */
export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  switch (filter) {
    case "active":
      return tasks.filter((t) => !t.done);
    case "completed":
      return tasks.filter((t) => t.done);
    case "all":
    default:
      return tasks;
  }
}

const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

/** Sort by priority (high first), then by creation time (oldest first). */
export function sortTasks(tasks: Task[]): Task[] {
  return tasks.toSorted((a, b) => {
    const byPriority = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (byPriority !== 0) return byPriority;
    return a.createdAt - b.createdAt;
  });
}

/** Aggregate stats for the summary bar. */
export function taskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const active = total - completed;
  const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, active, completed, percentComplete };
}

/** Remove all completed tasks (immutably). */
export function clearCompleted(tasks: Task[]): Task[] {
  return tasks.filter((t) => !t.done);
}
