import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatsBar } from './StatsBar'
import type { TaskStats } from '../lib/tasks'

function stats(overrides: Partial<TaskStats> = {}): TaskStats {
  return { total: 0, active: 0, completed: 0, percentComplete: 0, ...overrides }
}

describe('<StatsBar />', () => {
  it('renders active, done and total counts', () => {
    render(<StatsBar stats={stats({ total: 5, active: 3, completed: 2 })} />)
    expect(screen.getByTestId('stat-active')).toHaveTextContent('3 active')
    expect(screen.getByTestId('stat-completed')).toHaveTextContent('2 done')
    expect(screen.getByTestId('stat-total')).toHaveTextContent('5 total')
  })

  it('renders the completion percentage label', () => {
    render(<StatsBar stats={stats({ percentComplete: 40 })} />)
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it('sets the progress fill width from percentComplete', () => {
    render(<StatsBar stats={stats({ percentComplete: 75 })} />)
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '75%' })
  })

  it('renders a 0% width bar for an empty list', () => {
    render(<StatsBar stats={stats()} />)
    expect(screen.getByTestId('progress-fill')).toHaveStyle({ width: '0%' })
  })
})
