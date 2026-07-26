import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

/** Add a task through the UI. */
async function addTask(title: string, priority?: 'high' | 'medium' | 'low') {
  await userEvent.type(screen.getByLabelText('Task title'), title)
  if (priority) {
    await userEvent.selectOptions(screen.getByLabelText('Priority'), priority)
  }
  await userEvent.click(screen.getByRole('button', { name: 'Add' }))
}

describe('<App /> integration', () => {
  it('shows the empty state initially', () => {
    render(<App />)
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No tasks yet')
  })

  it('adds a task and updates the stats', async () => {
    render(<App />)
    await addTask('First task')
    expect(screen.getByText('First task')).toBeInTheDocument()
    expect(screen.getByTestId('stat-total')).toHaveTextContent('1 total')
    expect(screen.getByTestId('stat-active')).toHaveTextContent('1 active')
  })

  it('completing a task moves the progress bar and counts', async () => {
    render(<App />)
    await addTask('Do the thing')
    await userEvent.click(screen.getByRole('checkbox'))
    expect(screen.getByTestId('stat-completed')).toHaveTextContent('1 done')
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('filters tasks by active and completed', async () => {
    render(<App />)
    await addTask('Active one')
    await addTask('Done one')

    // complete the second task
    const items = screen.getAllByTestId('task-item')
    await userEvent.click(within(items[1]).getByRole('checkbox'))

    await userEvent.click(screen.getByRole('button', { name: 'active' }))
    expect(screen.getByText('Active one')).toBeInTheDocument()
    expect(screen.queryByText('Done one')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'completed' }))
    expect(screen.getByText('Done one')).toBeInTheDocument()
    expect(screen.queryByText('Active one')).not.toBeInTheDocument()
  })

  it('sorts high-priority tasks above lower-priority ones', async () => {
    render(<App />)
    await addTask('Low task', 'low')
    await addTask('High task', 'high')
    const titles = screen
      .getAllByTestId('task-item')
      .map((el) => within(el).getByText(/task$/i).textContent)
    expect(titles).toEqual(['High task', 'Low task'])
  })

  it('removes a task', async () => {
    render(<App />)
    await addTask('Delete me')
    await userEvent.click(screen.getByRole('button', { name: 'Delete "Delete me"' }))
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  it('clears completed tasks', async () => {
    render(<App />)
    await addTask('Keep me')
    await addTask('Clear me')
    const items = screen.getAllByTestId('task-item')
    await userEvent.click(within(items[1]).getByRole('checkbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Clear completed' }))
    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Clear me')).not.toBeInTheDocument()
  })

  it('shows a per-filter empty message when a filter has no matches', async () => {
    render(<App />)
    await addTask('Only active')
    await userEvent.click(screen.getByRole('button', { name: 'completed' }))
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No completed tasks')
  })
})
