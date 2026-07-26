# 🚀 Task Flow — CI/CD Demo

A tiny **Task Manager** built with **Vite + React + TypeScript**, set up as a demo
project for a CI/CD tech talk. It ships with **Vitest** (unit) and **Playwright**
(E2E) fully configured — the tests and the CI pipeline (`.github/workflows/*.yml`)
are intentionally left out so they can be added live during the talk.

## Stack

| Concern     | Tool                             |
| ----------- | -------------------------------- |
| Build / dev | Vite 8                           |
| UI          | React 19 + TypeScript            |
| Unit tests  | Vitest + Testing Library + jsdom |
| E2E tests   | Playwright (Chromium)            |
| Lint        | oxlint                           |

## Project structure

```
src/
  lib/tasks.ts          # pure logic — the easy target for UNIT tests
  components/           # TaskInput, TaskItem, FilterBar, StatsBar
  App.tsx               # wires state + components together
  test/setup.ts         # Testing Library / jest-dom matchers
e2e/                    # Playwright specs go here (empty for now)
vite.config.ts          # Vite + Vitest config (jsdom, coverage)
playwright.config.ts    # Playwright config (boots `npm run preview`)
```

The app is a task list: add tasks with a priority, toggle them complete, filter
by all/active/completed, see live progress stats, and clear completed. The pure
functions in [`src/lib/tasks.ts`](src/lib/tasks.ts) (create, toggle, remove,
filter, sort, stats) are deliberately side-effect free so they demo cleanly as
unit tests.

## Commands

```bash
npm run dev            # start dev server (http://localhost:5173)
npm run build          # type-check + production build
npm run preview        # serve the production build (http://localhost:4173)
npm run lint           # oxlint

npm test               # run unit tests once (Vitest)
npm run test:watch     # unit tests in watch mode
npm run test:ui        # Vitest UI
npm run test:coverage  # unit tests + coverage report

npm run test:e2e       # run Playwright E2E tests (auto-starts preview server)
npm run test:e2e:ui    # Playwright UI mode
```

## For the talk

Everything a pipeline needs is wired up locally, so the CI YAML is a thin wrapper:

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm test`
5. `npx playwright install --with-deps chromium && npm run test:e2e`

Add `.github/workflows/ci.yml` and the test files when you're ready — the scripts
above are the exact steps to drop into the pipeline.
