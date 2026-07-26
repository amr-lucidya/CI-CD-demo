import { describe, it, expect } from 'vitest'
import {
  clearCompleted,
  createTask,
  filterTasks,
  makeId,
  removeTask,
  sortTasks,
  taskStats,
  toggleTask,
  type Task,
} from './tasks'

/** Small helper to build a task without going through createTask. */
function task(overrides: Partial<Task> = {}): Task {
  return {
    id: makeId(),
    title: 'Task',
    priority: 'medium',
    done: false,
    createdAt: 0,
    ...overrides,
  }
}

describe('makeId', () => {
  it('returns a non-empty string', () => {
    expect(makeId()).toMatch(/^task-\d+$/)
  })

  it('returns a unique value each call', () => {
    const ids = new Set([makeId(), makeId(), makeId()])
    expect(ids.size).toBe(3)
  })
})

describe('createTask', () => {
  it('creates a task with defaults', () => {
    const t = createTask('Write tests')
    expect(t.title).toBe('Write tests')
    expect(t.priority).toBe('medium')
    expect(t.done).toBe(false)
    expect(t.createdAt).toBe(0)
    expect(t.id).toBeTruthy()
  })

  it('trims surrounding whitespace from the title', () => {
    expect(createTask('   spaced   ').title).toBe('spaced')
  })

  it('honors an explicit priority', () => {
    expect(createTask('urgent', 'high').priority).toBe('high')
  })

  it('honors an explicit createdAt', () => {
    expect(createTask('later', 'low', 42).createdAt).toBe(42)
  })

  it('throws on an empty title', () => {
    expect(() => createTask('')).toThrow('Task title cannot be empty')
  })

  it('throws on a whitespace-only title', () => {
    expect(() => createTask('    ')).toThrow(/empty/)
  })

  it('gives every task a distinct id', () => {
    const a = createTask('a')
    const b = createTask('b')
    expect(a.id).not.toBe(b.id)
  })
})

describe('toggleTask', () => {
  it('flips done from false to true', () => {
    const t = task({ id: 'x', done: false })
    const [result] = toggleTask([t], 'x')
    expect(result.done).toBe(true)
  })

  it('flips done from true to false', () => {
    const t = task({ id: 'x', done: true })
    const [result] = toggleTask([t], 'x')
    expect(result.done).toBe(false)
  })

  it('only affects the matching id', () => {
    const a = task({ id: 'a', done: false })
    const b = task({ id: 'b', done: false })
    const result = toggleTask([a, b], 'a')
    expect(result.find((t) => t.id === 'a')?.done).toBe(true)
    expect(result.find((t) => t.id === 'b')?.done).toBe(false)
  })

  it('is a no-op when the id is not found', () => {
    const a = task({ id: 'a', done: false })
    const result = toggleTask([a], 'missing')
    expect(result[0].done).toBe(false)
  })

  it('does not mutate the input array or items', () => {
    const a = task({ id: 'a', done: false })
    const input = [a]
    const result = toggleTask(input, 'a')
    expect(input[0].done).toBe(false)
    expect(result).not.toBe(input)
    expect(result[0]).not.toBe(a)
  })
})

describe('removeTask', () => {
  it('removes the matching task', () => {
    const a = task({ id: 'a' })
    const b = task({ id: 'b' })
    const result = removeTask([a, b], 'a')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  it('is a no-op when the id is not found', () => {
    const a = task({ id: 'a' })
    expect(removeTask([a], 'missing')).toHaveLength(1)
  })

  it('does not mutate the input array', () => {
    const a = task({ id: 'a' })
    const input = [a]
    removeTask(input, 'a')
    expect(input).toHaveLength(1)
  })

  it('handles an empty list', () => {
    expect(removeTask([], 'a')).toEqual([])
  })
})

describe('filterTasks', () => {
  const active = task({ id: 'a', done: false })
  const done = task({ id: 'b', done: true })
  const list = [active, done]

  it('returns everything for "all"', () => {
    expect(filterTasks(list, 'all')).toHaveLength(2)
  })

  it('returns only active tasks for "active"', () => {
    const result = filterTasks(list, 'active')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('returns only completed tasks for "completed"', () => {
    const result = filterTasks(list, 'completed')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterTasks([active], 'completed')).toEqual([])
  })
})

describe('sortTasks', () => {
  it('orders high priority before medium before low', () => {
    const low = task({ id: 'low', priority: 'low', createdAt: 0 })
    const high = task({ id: 'high', priority: 'high', createdAt: 1 })
    const medium = task({ id: 'medium', priority: 'medium', createdAt: 2 })
    const result = sortTasks([low, high, medium])
    expect(result.map((t) => t.id)).toEqual(['high', 'medium', 'low'])
  })

  it('breaks priority ties by createdAt (oldest first)', () => {
    const second = task({ id: 'second', priority: 'high', createdAt: 5 })
    const first = task({ id: 'first', priority: 'high', createdAt: 2 })
    const result = sortTasks([second, first])
    expect(result.map((t) => t.id)).toEqual(['first', 'second'])
  })

  it('does not mutate the input array', () => {
    const a = task({ id: 'a', priority: 'low' })
    const b = task({ id: 'b', priority: 'high' })
    const input = [a, b]
    sortTasks(input)
    expect(input.map((t) => t.id)).toEqual(['a', 'b'])
  })

  it('handles an empty list', () => {
    expect(sortTasks([])).toEqual([])
  })
})

describe('taskStats', () => {
  it('reports zeros for an empty list', () => {
    expect(taskStats([])).toEqual({
      total: 0,
      active: 0,
      completed: 0,
      percentComplete: 0,
    })
  })

  it('counts active and completed correctly', () => {
    const list = [
      task({ done: true }),
      task({ done: false }),
      task({ done: false }),
    ]
    const stats = taskStats(list)
    expect(stats.total).toBe(3)
    expect(stats.completed).toBe(1)
    expect(stats.active).toBe(2)
  })

  it('computes percentComplete as a rounded percentage', () => {
    const list = [task({ done: true }), task({ done: false }), task({ done: false })]
    expect(taskStats(list).percentComplete).toBe(33)
  })

  it('reports 100% when everything is done', () => {
    expect(taskStats([task({ done: true })]).percentComplete).toBe(100)
  })
})

describe('clearCompleted', () => {
  it('removes all completed tasks', () => {
    const list = [task({ done: true }), task({ done: false }), task({ done: true })]
    const result = clearCompleted(list)
    expect(result).toHaveLength(1)
    expect(result.every((t) => !t.done)).toBe(true)
  })

  it('keeps the list unchanged when nothing is completed', () => {
    const list = [task({ done: false }), task({ done: false })]
    expect(clearCompleted(list)).toHaveLength(2)
  })

  it('does not mutate the input array', () => {
    const list = [task({ done: true })]
    clearCompleted(list)
    expect(list).toHaveLength(1)
  })
})
