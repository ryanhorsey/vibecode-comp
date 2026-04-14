# CareBoard — Your Wellness Kanban

A self-improving kanban board with CareBot, your caring wellness companion inspired by Baymax.

## Features

- **Kanban board** with drag-and-drop: To Do / In Progress / Done columns
- **CareBot mascot** — a friendly Baymax-like AI companion that floats in the corner, checks in with you, and suggests wellness tasks
- **Local CareBot chat** powered by hard-coded wellness rules and board context (no API key required)
- **Mood tracking** — quick 5-emoji check-ins stored locally
- **Wellness task suggestions** — CareBot suggests tasks based on your mood and board state, which you can add with one click
- **Streak counter** — tracks consecutive days you've been active
- **Celebration toasts** — every completed task gets a mini celebration
- All data stored in **browser localStorage** — no account needed
- No paid AI services or external API keys needed

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How CareBot Works

CareBot is fully local and rule-based:

- It responds based on your message keywords (stress, low energy, motivation, etc.)
- It looks at your board state (To Do load, Done progress, recent mood check-ins)
- It suggests wellness tasks from built-in task templates

No network calls are made for chat responses.
