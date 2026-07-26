import type { Filter } from '../lib/tasks'

interface FilterBarProps {
  filter: Filter
  onChange: (filter: Filter) => void
  onClearCompleted: () => void
  completedCount: number
}

const FILTERS: Filter[] = ['all', 'active', 'completed']

export function FilterBar({
  filter,
  onChange,
  onClearCompleted,
  completedCount,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__group" role="group" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? 'is-active' : ''}
            aria-pressed={filter === f}
            onClick={() => onChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <button
        className="filter-bar__clear"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </div>
  )
}
