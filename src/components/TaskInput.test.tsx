import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskInput } from './TaskInput'

describe('<TaskInput />', () => {
  it('renders the input, priority select and add button', () => {
    render(<TaskInput onAdd={vi.fn()} />)
    expect(screen.getByLabelText('Task title')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('calls onAdd with the trimmed-ish title and default priority', async () => {
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText('Task title'), 'Buy milk')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'medium')
  })

  it('passes the selected priority to onAdd', async () => {
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText('Task title'), 'Urgent thing')
    await userEvent.selectOptions(screen.getByLabelText('Priority'), 'high')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).toHaveBeenCalledWith('Urgent thing', 'high')
  })

  it('clears the input after a successful add', async () => {
    render(<TaskInput onAdd={vi.fn()} />)
    const input = screen.getByLabelText('Task title') as HTMLInputElement
    await userEvent.type(input, 'Something')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(input.value).toBe('')
  })

  it('resets the priority back to medium after adding', async () => {
    render(<TaskInput onAdd={vi.fn()} />)
    const select = screen.getByLabelText('Priority') as HTMLSelectElement
    await userEvent.type(screen.getByLabelText('Task title'), 'x')
    await userEvent.selectOptions(select, 'high')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(select.value).toBe('medium')
  })

  it('shows an error and does not call onAdd for an empty title', async () => {
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a task')
  })

  it('does not submit a whitespace-only title', async () => {
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText('Task title'), '   ')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('clears the error once the user starts typing again', async () => {
    render(<TaskInput onAdd={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Task title'), 'a')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('submits when pressing Enter in the input', async () => {
    const onAdd = vi.fn()
    render(<TaskInput onAdd={onAdd} />)
    await userEvent.type(screen.getByLabelText('Task title'), 'Via enter{enter}')
    expect(onAdd).toHaveBeenCalledWith('Via enter', 'medium')
  })
})
