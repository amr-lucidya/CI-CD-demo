import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from './FilterBar'

describe('<FilterBar />', () => {
  it('renders all three filter buttons', () => {
    render(
      <FilterBar filter="all" onChange={vi.fn()} onClearCompleted={vi.fn()} completedCount={0} />,
    )
    expect(screen.getByRole('button', { name: 'all' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'active' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'completed' })).toBeInTheDocument()
  })

  it('marks the active filter with aria-pressed', () => {
    render(
      <FilterBar filter="active" onChange={vi.fn()} onClearCompleted={vi.fn()} completedCount={0} />,
    )
    expect(screen.getByRole('button', { name: 'active' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'all' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with the chosen filter', async () => {
    const onChange = vi.fn()
    render(
      <FilterBar filter="all" onChange={onChange} onClearCompleted={vi.fn()} completedCount={0} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'completed' }))
    expect(onChange).toHaveBeenCalledWith('completed')
  })

  it('disables "Clear completed" when there are no completed tasks', () => {
    render(
      <FilterBar filter="all" onChange={vi.fn()} onClearCompleted={vi.fn()} completedCount={0} />,
    )
    expect(screen.getByRole('button', { name: 'Clear completed' })).toBeDisabled()
  })

  it('enables "Clear completed" when there are completed tasks', () => {
    render(
      <FilterBar filter="all" onChange={vi.fn()} onClearCompleted={vi.fn()} completedCount={3} />,
    )
    expect(screen.getByRole('button', { name: 'Clear completed' })).toBeEnabled()
  })

  it('calls onClearCompleted when clicked', async () => {
    const onClearCompleted = vi.fn()
    render(
      <FilterBar
        filter="all"
        onChange={vi.fn()}
        onClearCompleted={onClearCompleted}
        completedCount={2}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Clear completed' }))
    expect(onClearCompleted).toHaveBeenCalledTimes(1)
  })
})
