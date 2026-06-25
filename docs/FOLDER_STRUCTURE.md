# 📂 CampusFlow Folder Structure Reference

This document maps out the directories and key files across the frontend and backend folders.

---

## 🏗️ Repository Root Layout

```text
CampusFlow/
├── backend/                  # Node.js Clean Architecture API service
│   ├── database/             # PostgreSQL migrations and setup scripts
│   ├── n8n/                  # Exported JSON configs for n8n workflows
│   ├── scripts/              # Helper generation scripts
│   ├── logs/                 # Local trace files (combined.log, error.log)
│   ├── src/                  # Backend application source code
│   │   ├── application/      # Use cases & business logic layer
│   │   ├── config/           # Config environment files & swagger settings
│   │   ├── domain/           # Core system entities
│   │   ├── infrastructure/   # DB repositories, AI failovers, WhatsApp integrations
│   │   ├── middlewares/      # Express error, auth, and rate limiters
│   │   ├── presentation/     # HTTP routes, controllers, and schema validators
│   │   └── utils/            # Shared utilities (Winston logger)
│   └── package.json          # Dependencies & nodemon commands
│
├── frontend/                 # Next.js TypeScript Client UI
│   ├── src/                  # Client source code
│   │   ├── app/              # Next.js App Router (dashboard routes & auth views)
│   │   ├── components/       # Reusable components (layout, UI primitives, dashboard cards)
│   │   ├── hooks/            # TanStack Query custom React Query hooks
│   │   ├── lib/              # Axios HTTP configurations & API endpoints
│   │   ├── store/            # Zustand global client-state stores
│   │   └── types/            # TypeScript interface definitions
│   └── package.json          # Frontend dependencies & Next.js scripts
│
└── docs/                     # Production setup and system manuals
```

---

## 💻 Backend Directory Dictionary

- **`database/init.sql`**: Complete database script containing schema definitions, composite indexes, default roles, and seed company metadata.
- **`n8n/*.json`**: Importable workflow templates for daily reminders, Google Calendar syncs, WhatsApp logs, and low-attendance warnings.
- **`src/application/usecases/`**: Encapsulates specific use case business rules like registering users and validating JWT passwords.
- **`src/infrastructure/ai/`**: Handles prompt injection templates (`promptTemplates.js`) and failover LLM logic (`aiService.js`).
- **`src/presentation/controllers/`**: Controller classes transforming HTTP variables to request outputs.
- **`src/presentation/routes/`**: Handles endpoint paths guarded by validation checks and strict IP rate limiters.

---

## 🎨 Frontend Directory Dictionary

- **`src/app/(auth)/`**: Handles registration and login views using React Hook Form validation.
- **`src/app/(dashboard)/`**: Houses all core productivity modules inside the dashboard shell:
  - `dashboard/`: Today's schedule, deadlines, statistics, charts, recent activities.
  - `calendar/`: Custom month grid with task event insertions.
  - `attendance/`: Subject totals, percentage risks, and prediction metrics.
  - `placement/`: Recruitment pipelines, status updates, and target company selections.
  - `groups/`: Study group directories and session schedulers.
  - `notifications/`: Inbox filters, search terms, and read logs.
  - `help/`, `faq/`, `contact/`, `about/`, `privacy/`: Static resources styled with semantic main tags.
- **`src/components/ui/`**: Core reusable visual elements like buttons, cards, skeletons, input bars, and badges.
- **`src/hooks/`**: Connects APIs to UI components with loading variables and invalidation queries.
