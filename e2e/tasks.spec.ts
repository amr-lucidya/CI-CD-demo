import { test, expect, type Page } from '@playwright/test'

async function addTask(page: Page, title: string, priority?: 'High' | 'Medium' | 'Low') {
  await page.getByLabel('Task title').fill(title)
  if (priority) {
    await page.getByLabel('Priority', { exact: true }).selectOption({ label: priority })
  }
  await page.getByRole('button', { name: 'Add' }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('loads with the app title and empty state', async ({ page }) => {
  await expect(page).toHaveTitle(/Task Flow/)
  await expect(page.getByRole('heading', { name: /Task Flow/ })).toBeVisible()
  await expect(page.getByTestId('empty-state')).toContainText('No tasks yet')
})

test('adds a task and reflects it in the stats', async ({ page }) => {
  await addTask(page, 'Write the slides')
  await expect(page.getByText('Write the slides')).toBeVisible()
  await expect(page.getByTestId('stat-total')).toHaveText('1 total')
  await expect(page.getByTestId('stat-active')).toHaveText('1 active')
})

test('shows a validation error for an empty title', async ({ page }) => {
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByRole('alert')).toHaveText('Please enter a task')
  await expect(page.getByTestId('empty-state')).toBeVisible()
})

test('adds multiple tasks', async ({ page }) => {
  await addTask(page, 'Task one')
  await addTask(page, 'Task two')
  await addTask(page, 'Task three')
  await expect(page.getByTestId('task-item')).toHaveCount(3)
  await expect(page.getByTestId('stat-total')).toHaveText('3 total')
})

test('completes a task and updates progress to 100%', async ({ page }) => {
  await addTask(page, 'Finish demo')
  await page.getByRole('checkbox').check()
  await expect(page.getByTestId('stat-completed')).toHaveText('1 done')
  await expect(page.getByText('100%')).toBeVisible()
})

test('filters between all, active and completed', async ({ page }) => {
  await addTask(page, 'Stay active')
  await addTask(page, 'Get done')
  await page.getByTestId('task-item').nth(1).getByRole('checkbox').check()

  await page.getByRole('button', { name: 'active', exact: true }).click()
  await expect(page.getByText('Stay active')).toBeVisible()
  await expect(page.getByText('Get done')).toBeHidden()

  await page.getByRole('button', { name: 'completed', exact: true }).click()
  await expect(page.getByText('Get done')).toBeVisible()
  await expect(page.getByText('Stay active')).toBeHidden()

  await page.getByRole('button', { name: 'all', exact: true }).click()
  await expect(page.getByTestId('task-item')).toHaveCount(2)
})

test('orders high-priority tasks above low-priority ones', async ({ page }) => {
  await addTask(page, 'Low priority task', 'Low')
  await addTask(page, 'High priority task', 'High')
  const titles = page.locator('.task-item__title')
  await expect(titles.nth(0)).toHaveText('High priority task')
  await expect(titles.nth(1)).toHaveText('Low priority task')
})

test('renders the correct priority badge', async ({ page }) => {
  await addTask(page, 'Urgent', 'High')
  await expect(page.locator('.badge--high')).toHaveText('high')
})

test('removes a task', async ({ page }) => {
  await addTask(page, 'Delete me')
  await page.getByRole('button', { name: 'Delete "Delete me"' }).click()
  await expect(page.getByText('Delete me')).toBeHidden()
  await expect(page.getByTestId('empty-state')).toBeVisible()
})

test('clears completed tasks while keeping active ones', async ({ page }) => {
  await addTask(page, 'Keep me')
  await addTask(page, 'Clear me')
  await page.getByTestId('task-item').nth(1).getByRole('checkbox').check()

  const clearButton = page.getByRole('button', { name: 'Clear completed' })
  await expect(clearButton).toBeEnabled()
  await clearButton.click()

  await expect(page.getByText('Keep me')).toBeVisible()
  await expect(page.getByText('Clear me')).toBeHidden()
  await expect(page.getByTestId('task-item')).toHaveCount(1)
})

test('"Clear completed" is disabled when nothing is completed', async ({ page }) => {
  await addTask(page, 'Just one')
  await expect(page.getByRole('button', { name: 'Clear completed' })).toBeDisabled()
})

test('DEMO — this test is designed to fail the CI e2e step', async ({ page }) => {
  await addTask(page, 'Real task')
  // The app never creates a task with this title, so the assertion fails.
  await expect(page.getByText('This task does not exist')).toBeVisible()
})
