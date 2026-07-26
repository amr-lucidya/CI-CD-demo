import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from './TaskItem'
import type { Task } from '../lib/tasks'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Sample task',
    priority: 'medium',
    done: false,
    createdAt: 0,
    ...overrides,
  }
}

describe('<TaskItem />', () => {
  it('renders the task title', () => {
    render(<TaskItem task={makeTask()} onToggle={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('Sample task')).toBeInTheDocument()
  })

  it('renders the priority badge', () => {
    render(
      <TaskItem task={makeTask({ priority: 'high' })} onToggle={vi.fn()} onRemove={vi.fn()} />,
    )
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('shows an unchecked checkbox for an active task', () => {
    render(<TaskItem task={makeTask({ done: false })} onToggle={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('shows a checked checkbox for a completed task', () => {
    render(<TaskItem task={makeTask({ done: true })} onToggle={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('applies the is-done class when completed', () => {
    const { container } = render(
      <TaskItem task={makeTask({ done: true })} onToggle={vi.fn()} onRemove={vi.fn()} />,
    )
    expect(container.querySelector('.task-item')).toHaveClass('is-done')
  })

  it('calls onToggle with the task id when the checkbox is clicked', async () => {
    const onToggle = vi.fn()
    render(<TaskItem task={makeTask({ id: 'abc' })} onToggle={onToggle} onRemove={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith('abc')
  })

  it('calls onRemove with the task id when the delete button is clicked', async () => {
    const onRemove = vi.fn()
    render(<TaskItem task={makeTask({ id: 'abc' })} onToggle={vi.fn()} onRemove={onRemove} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onRemove).toHaveBeenCalledWith('abc')
  })

  it('exposes an accessible delete label including the title', () => {
    render(<TaskItem task={makeTask({ title: 'Pay rent' })} onToggle={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Delete "Pay rent"' })).toBeInTheDocument()
  })
})
