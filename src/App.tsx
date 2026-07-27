import { useMemo, useState } from "react";
import "./App.css";
import {
  clearCompleted,
  createTask,
  filterTasks,
  removeTask,
  sortTasks,
  taskStats,
  toggleTask,
  type Filter,
  type Priority,
  type Task,
} from "./lib/tasks";
import { TaskInput } from "./components/TaskInput";
import { TaskItem } from "./components/TaskItem";
import { FilterBar } from "./components/FilterBar";
import { StatsBar } from "./components/StatsBar";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  function handleAdd(title: string, priority: Priority) {
    setTasks((prev) => [...prev, createTask(title, priority, prev.length)]);
  }

  const stats = useMemo(() => taskStats(tasks), [tasks]);
  const visible = useMemo(
    () => sortTasks(filterTasks(tasks, filter)),
    [tasks, filter],
  );

  return (
    <div className="app">
      <header className="app__header">
        <h1>🚀 Task Flow</h1>
        <p className="app__subtitle">A tiny app for a CI/CD demo</p>
      </header>

      <main className="card">
        <TaskInput onAdd={handleAdd} />

        <StatsBar stats={stats} />

        <FilterBar
          filter={filter}
          onChange={setFilter}
          onClearCompleted={() => setTasks((prev) => clearCompleted(prev))}
          completedCount={stats.completed}
        />

        {visible.length === 0 ? (
          <p className="empty" data-testid="empty-state">
            {tasks.length === 0
              ? "No tasks yet — add your first one above."
              : `No ${filter} tasks.`}
          </p>
        ) : (
          <ul className="task-list">
            {visible.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(id) => setTasks((prev) => toggleTask(prev, id))}
                onRemove={(id) => setTasks((prev) => removeTask(prev, id))}
              />
            ))}
          </ul>
        )}
      </main>

      <footer className="app__footer">
        Built with Vite · React · TypeScript
      </footer>
    </div>
  );
}

export default App;
