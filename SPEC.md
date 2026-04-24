# Grapes HQ — Specification

## 1. Concept & Vision

**Grapes HQ** is Jack's personal command center — a web app that acts as the memory and organizational layer between him and the chaos of daily life. It captures everything he sends to Hermes (ideas, tasks, links, things to remember), surfaces actionable items from his email (recruiter OAs, take-homes), and gives him a single place to see where he stands on job search, 3D printing projects, and life in general.

It's not a to-do app — it's a *second brain* with opinions. It reminds you, tracks context, and nudges you toward action without being another source of anxiety.

**Feel:** Clean, calm, dense-with-information-but-not-overwhelming. Dark theme. Professional but personal.

---

## 2. Design Language

### Color Palette
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#09090b` | Page background (zinc-950) |
| Surface | `#18181b` | Cards, panels (zinc-900) |
| Surface Elevated | `#27272a` | Modals, dropdowns (zinc-800) |
| Border | `#3f3f46` | Dividers, card borders (zinc-700) |
| Text Primary | `#fafafa` | Headings, important text (zinc-50) |
| Text Secondary | `#a1a1aa` | Labels, metadata (zinc-400) |
| Accent Blue | `#3b82f6` | Links, primary actions (blue-500) |
| Accent Green | `#22c55e` | Done/success states (green-500) |
| Accent Amber | `#f59e0b` | Warnings, in-progress (amber-500) |
| Accent Red | `#ef4444` | Blocked, urgent, errors (red-500) |

### Typography
- **Font:** Inter (Google Fonts) — clean, modern, highly legible
- **Headings:** Inter 600 (semibold)
- **Body:** Inter 400 (regular)
- **Mono:** JetBrains Mono — for URLs, IDs, code snippets
- **Scale:** 12px (xs), 14px (sm/body), 16px (base), 20px (lg), 24px (xl), 32px (2xl)

### Spatial System
- Base unit: 4px
- Common spacing: `p-3` (12px), `p-4` (16px), `gap-2` (8px), `gap-4` (16px)
- Card style: `bg-zinc-900 rounded-lg border border-zinc-700/50`
- Max content width: 1400px

### Motion
- Subtle and purposeful — never distracting
- Hover transitions: `transition-colors duration-150`
- Panel slides: `transition-transform duration-200`
- No bounce, no spring, no excessive animation

---

## 3. Layout & Structure

### Global Shell
```
┌─────────────────────────────────────────────────────────┐
│  HEADER: Logo + Nav (Dashboard | Kanban | List | Sends) │
│          + Search bar + [Settings gear]                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  MAIN CONTENT (view-dependent)                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Views

#### 3.1 Dashboard Home
Single-pane overview — the daily landing page.

```
┌─────────────────────────────────────────────────────────┐
│  TODAY'S PANEL                                          │
│  ├─ Due Today (tasks with deadline = today)              │
│  ├─ In Progress (tasks with status = in-progress)        │
│  └─ Recent Items (last 5 added, any type)                │
├───────────────────────────┬─────────────────────────────┤
│  JOB SEARCH PANEL          │  IDEAS PANEL                │
│  ├─ OA Pending (email→task) │  ├─ Interesting (new/     │
│  ├─ Take-home Active        │  │   interesting)          │
│  └─ Interview Scheduled     │  └─ In Progress           │
├───────────────────────────┴─────────────────────────────┤
│  RECENT SENDS                                            │
│  └─ Last 5 links/URLs saved                             │
├─────────────────────────────────────────────────────────┤
│  ENERGY/MOOD PANEL (if tracked)                          │
└─────────────────────────────────────────────────────────┘
```

#### 3.2 Kanban Board
4-column board for Ideas. 4-column board for Tasks (separate tabs).

**Ideas columns:** `new` → `interesting` → `in-progress` → `done / shelved`  
**Task columns:** `todo` → `in-progress` → `blocked` → `done`

Each card shows: title, tags, source, date added.

#### 3.3 List View
Filterable, sortable table of all items.

Filters: type (idea/task/send/email), status, tags, date range  
Columns: Type, Title, Status, Tags, Source, Date Added, Due Date (if any)

#### 3.4 Sends View
Dedicated view for saved links/URLs.

Fields: URL, description, tags, date saved, category.

### Responsive Strategy
- Desktop-first (Jack's usecase is desktop)
- Tablet: stack dashboard panels, collapse kanban to horizontal scroll
- Mobile: basic support, not primary target

---

## 4. Features & Interactions

### 4.1 Item Types

#### Ideas
- **Fields:** `id`, `title`, `description`, `status`, `tags[]`, `created_at`, `updated_at`
- **Status flow:** `new → interesting → in-progress → done | shelved`
- **Tags:** free-form flat tags (`#job-search`, `#3dprinting`, `#car-projects`)

#### Tasks
- **Fields:** `id`, `title`, `description`, `status`, `tags[]`, `due_date`, `source`, `created_at`, `updated_at`
- **Status flow:** `todo → in-progress → blocked → done`
- **Source:** `manual`, `email`, `telegram`, `brain-dump`
- **Due dates:** Optional. Triggers "due today" / "overdue" UI state.

#### Sends
- **Fields:** `id`, `url`, `description`, `title`, `tags[]`, `created_at`
- **Purpose:** Bookmarking — stores the URL + a description of what it is
- **No status flow** — purely a reference library

#### Emails (Captured)
- **Fields:** `id`, `subject`, `from`, `snippet`, `body_preview`, `captured_at`, `actionable`, `linked_task_id`
- **Purpose:** When Jack forwards/pastes an email to Hermes, it gets stored here with the recruiter's message and a link to the Gmail thread
- **Actionable flag:** Hermes marks it as OA / take-home / interview / noise

### 4.2 Input Methods

#### Via Hermes (primary)
Jack tells Hermes things in natural conversation. Hermes asks "want me to log that?" when it detects something worth saving. Types:
- `"log this as an idea: [text]"` → saves as idea
- `"add to #job-search: [task]"` → saves as task with tag
- `"remind me about [thing] on [date]"` → saves as task with due date
- `"save this link: [url]"` → saves as send

#### Via Dashboard UI
- Quick-add form at top of each view
- Paste an email thread → "Capture Email" button → extracts subject, from, snippet

#### Via Telegram Commands
- `/addidea [text]` — add idea
- `/addtask [text]` — add task
- `/sends [url] [description]` — save a link
- `/capture` — paste email content for capture
- `/dashboard` — get a text summary of today's items

### 4.3 Search
- Global search bar in header
- Searches: title, description, tags, url, email subject/body
- Results grouped by type
- Keyboard shortcut: `Cmd/Ctrl + K`

### 4.4 Tags
- Flat tag system (no nesting, no hierarchy)
- Autocomplete from existing tags when typing
- Tag management page: rename, merge, delete tags
- Common tags shown as quick filters: `#job-search`, `#3dprinting`, `#personal`, `#urgent`

### 4.5 Reminders & Notifications
- Due today items → badge on dashboard on load
- Overdue items → highlighted in red
- Optional: Telegram notification at 9am with today's items
- Optional: Telegram notification when a due date arrives

### 4.6 Dashboard-Specific Rules
- Ideas in `shelved` column hidden from main view (accessible via filter)
- Tasks in `done` hidden from main view (accessible via "show completed" toggle)
- New ideas/tasks surface to top of their respective columns
- Items with `#urgent` tag always shown with red accent

### 4.7 Empty States
- Dashboard empty: "Nothing on the agenda. Tell Hermes to add something!"
- Kanban empty column: "Nothing here yet. Drag items in or add new."
- Search no results: "No matches. Try different keywords or add a new item."

### 4.8 Error States
- API failure: toast notification "Couldn't save — try again"
- Network offline: banner "You're offline. Changes will sync when reconnected."
- Auth failure: redirect to login

---

## 5. Component Inventory

### Header
- Logo (text: "Grapes HQ") left-aligned
- Nav tabs: Dashboard, Kanban, List, Sends
- Search bar (centered, expands on focus)
- Settings gear icon (right)
- States: nav tab active/inactive, search focused/blurred

### ItemCard
- Used in: Kanban, Dashboard panels, List view rows
- Shows: type icon, title, tags (chips), source badge, relative date
- States: default, hover (slight lift shadow), dragging (opacity 0.7 + shadow)
- Actions on hover: edit (pencil icon), delete (trash icon)

### TagChip
- Small pill with tag name
- Colors: default (zinc), #urgent (red bg), user-defined colors (future)
- States: default, hover, removable (× button)

### StatusBadge
- Pill showing current status
- Colors: new=blue, interesting=amber, in-progress=amber, done=green, blocked=red, shelved=gray

### KanbanColumn
- Header: column title + item count
- Drop zone: highlighted border when dragging over
- Empty state: placeholder text

### QuickAddForm
- Text input with placeholder "Add an idea...", "Add a task..."
- Type selector: segmented control (Idea | Task | Send)
- Tag input with autocomplete
- Submit on Enter

### EmailCaptureModal
- Textarea for pasting email content
- Preview: extracted subject, from, snippet
- One-click "Save as Task" / "Save as Idea" / "Discard"
- Link to original Gmail thread (if applicable)

### SettingsPanel
- Slide-in panel from right
- Sections: Profile, Tags, Integrations (Gmail OAuth, Telegram), Notifications, Data export

---

## 6. Technical Approach

### Stack
| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 16 + React 19 | App router, server components where possible |
| Styling | Tailwind CSS 4 + shadcn/ui | Dark theme, zinc color scale |
| Database | SQLite via better-sqlite3 | Local-first; file at `~/.grapes-hq/data.db` |
| ORM | Drizzle ORM | Type-safe, lightweight |
| Auth | Open (no auth for MVP) | Optional: simple password gate later |
| Icons | Lucide React | Consistent, clean |
| AI/Triage | Hermes (this agent) | Handles email analysis, brain dump processing |

### Data Model

```sql
-- Ideas
CREATE TABLE ideas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'interesting', 'in-progress', 'done', 'shelved')),
  tags TEXT DEFAULT '[]', -- JSON array
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'blocked', 'done')),
  tags TEXT DEFAULT '[]', -- JSON array
  due_date TEXT,
  source TEXT DEFAULT 'manual',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Sends (bookmarks)
CREATE TABLE sends (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Captured Emails
CREATE TABLE emails (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  from_address TEXT,
  snippet TEXT DEFAULT '',
  body_preview TEXT DEFAULT '',
  actionable INTEGER DEFAULT 0, -- boolean
  action_type TEXT, -- 'oa' | 'takehome' | 'interview' | 'noise' | NULL
  linked_task_id TEXT REFERENCES tasks(id),
  gmail_thread_id TEXT,
  captured_at TEXT DEFAULT (datetime('now'))
);

-- Daily Logs (for mood/energy tracking)
CREATE TABLE daily_logs (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  mood TEXT,
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_sends_created ON sends(created_at);
CREATE INDEX idx_emails_actionable ON emails(actionable);
```

### API Design

**Ideas**
- `GET /api/ideas` — list all ideas (filter by status, tags)
- `POST /api/ideas` — create idea
- `PATCH /api/ideas/:id` — update idea (status, tags, title, description)
- `DELETE /api/ideas/:id` — delete idea

**Tasks**
- `GET /api/tasks` — list all tasks (filter by status, tags, due_date)
- `POST /api/tasks` — create task
- `PATCH /api/tasks/:id` — update task
- `DELETE /api/tasks/:id` — delete task

**Sends**
- `GET /api/sends` — list all sends
- `POST /api/sends` — create send
- `PATCH /api/sends/:id` — update send
- `DELETE /api/sends/:id` — delete send

**Emails**
- `GET /api/emails` — list captured emails
- `POST /api/emails` — capture new email (from pasted content or Gmail sync)
- `PATCH /api/emails/:id` — update (mark actionable, link to task)

**Dashboard**
- `GET /api/dashboard` — aggregated view: today's items, job search items, recent ideas, recent sends, stats

**Integrations**
- `POST /api/capture-email` — paste email → extract + save
- `GET /api/search?q=` — global search across all tables

### Hermes Integration

Hermes acts as the AI layer on top of Grapes HQ:

1. **Brain dump processing** — When Jack says "log this", Hermes parses intent, extracts entities, calls the appropriate API
2. **Email triage** — When Jack pastes/forwards an email, Hermes analyzes it, extracts the useful content, marks it as OA/takehome/interview, and creates a linked task
3. **Daily summary** — Hermes can generate a daily briefing based on the day's items
4. **Proactive reminders** — Hermes monitors due dates and sends Telegram notifications

### File Structure

```
grapes-hq/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   ├── globals.css
│   │   ├── kanban/
│   │   │   └── page.tsx          # Kanban board
│   │   ├── list/
│   │   │   └── page.tsx          # List view
│   │   ├── sends/
│   │   │   └── page.tsx          # Sends view
│   │   └── api/
│   │       ├── ideas/route.ts
│   │       ├── tasks/route.ts
│   │       ├── sends/route.ts
│   │       ├── emails/route.ts
│   │       ├── dashboard/route.ts
│   │       └── search/route.ts
│   ├── components/
│   │   ├── ui/                    # shadcn components
│   │   ├── Header.tsx
│   │   ├── ItemCard.tsx
│   │   ├── TagChip.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── QuickAddForm.tsx
│   │   ├── EmailCaptureModal.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── SearchBar.tsx
│   │   └── DashboardPanels.tsx
│   └── lib/
│       ├── db.ts                  # SQLite + Drizzle connection
│       ├── schema.ts              # Drizzle schema
│       └── utils.ts               # Helpers (cn, formatDate, etc.)
├── drizzle/
│   └── migrations/
├── data/                          # SQLite DB file lives here
├── .env.local
├── drizzle.config.ts
├── package.json
└── README.md
```

---

## 7. MVP Scope

For initial build, ship these features only:

### Must Have (MVP)
- [ ] SQLite + Drizzle setup with full schema
- [ ] Dashboard home view with 3 panels (Today, Job Search, Recent Ideas)
- [ ] Kanban board (Ideas: new→interesting→in-progress→done/shelved)
- [ ] List view with filters (type, status, tags)
- [ ] Sends view (URL + description + tags)
- [ ] Quick-add form (Idea / Task / Send type selector)
- [ ] Global search (`Cmd/Ctrl + K`)
- [ ] Tag chips with autocomplete
- [ ] Hermes API integration (ideas/tasks/sends creation via Hermes)
- [ ] Email capture modal (paste email → extract + save)
- [ ] Dark theme throughout
- [ ] Local hosting instructions

### Not in MVP
- Gmail OAuth sync (manual paste capture only)
- Telegram bot commands (future)
- Energy/mood tracking
- Reminder notifications
- Data export
- Settings panel

---

## 8. Out of Scope (Never)

- Team collaboration / multi-user
- Real-time sync across devices
- Native mobile apps
- Recurring tasks / scheduling

---

*Spec version: 1.0 — 2026-04-24*
