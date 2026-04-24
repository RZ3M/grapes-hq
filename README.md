# Grapes HQ

Personal command center. A web app for managing ideas, tasks, saved links, and captured emails in one place.

Built with Next.js, SQLite, and Drizzle ORM.

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4
- **UI Components:** shadcn/ui (Radix-based)
- **Database:** SQLite via better-sqlite3 + Drizzle ORM
- **Icons:** Lucide React
- **AI Layer:** Hermes (this agent) for email triage and brain dump processing

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
cd grapes-hq
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The SQLite database lives at `~/.grapes-hq/data.db`.

## Views

- **Dashboard** — Today's items, job search tasks, interesting ideas, recent sends
- **Kanban** — Drag ideas/tasks across status columns
- **List** — Filterable table of all items
- **Sends** — Saved links and bookmarks

## Features

- Quick-add form (Idea / Task / Send)
- Global search (`Cmd/Ctrl + K`)
- Tag chips with autocomplete
- Dark theme throughout

## Adding Items via Hermes

When you tell Hermes things in natural conversation, it can log items directly:

- `"log this as an idea: [text]"` — saves as idea
- `"add to #job-search: [task]"` — saves as task with tag
- `"save this link: [url]"` — saves as send

## API

- `GET/POST /api/ideas` — list/create ideas
- `PATCH/DELETE /api/ideas/[id]` — update/delete idea
- `GET/POST /api/tasks` — list/create tasks
- `PATCH/DELETE /api/tasks/[id]` — update/delete task
- `GET/POST /api/sends` — list/create sends
- `PATCH/DELETE /api/sends/[id]` — update/delete send
- `GET/POST /api/emails` — list/capture emails
- `GET /api/dashboard` — aggregated dashboard data
- `GET /api/search?q=` — global search

## License

MIT
