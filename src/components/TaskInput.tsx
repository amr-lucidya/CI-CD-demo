import { useState, type FormEvent } from 'react'
import type { Priority } from '../lib/tasks'

interface TaskInputProps {
  onAdd: (title: string, priority: Priority) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (title.trim().length === 0) {
      setError('Please enter a task')
      return
    }
    onAdd(title, priority)
    setTitle('')
    setPriority('medium')
    setError('')
  }

  return (
    <form className="task-input" onSubmit={handleSubmit} aria-label="Add task">
      <input
        type="text"
        placeholder="What needs to be done?"
        aria-label="Task title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          if (error) setError('')
        }}
      />
      <select
        aria-label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">Add</button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
