import type { TaskStats } from "../lib/tasks";

interface StatsBarProps {
  stats: TaskStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="stats-bar" data-testid="stats-bar">
      <div className="stats-bar__numbers">
        <span data-testid="stat-active">{stats.active} active</span>
        <span data-testid="stat-completed">{stats.completed} done</span>
        <span data-testid="stat-total">{stats.total} total</span>
      </div>
      <div className="progress" aria-label="Completion progress">
        <div
          className="progress__fill"
          style={{ width: `${stats.percentComplete}%` }}
          data-testid="progress-fill"
        />
        <span className="progress__label">{stats.percentComplete}%</span>
      </div>
    </div>
  );
}
