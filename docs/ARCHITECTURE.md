# 🏗️ CampusFlow System Architecture Documentation

CampusFlow is designed using clean separation of concerns: a Next.js frontend client, a Node.js Express backend using Clean Architecture, a Supabase PostgreSQL database, and n8n automation webhook pipelines.

---

## 📈 System Architecture Diagram

```mermaid
graph TD
    subgraph Client Application (Next.js)
        UI[Tailwind & Framer Motion Pages]
        State[Zustand Store]
        Query[TanStack Query Cache]
    end

    subgraph Backend Microservice (Node/Express)
        Route[Route Handlers / Validators]
        UC[Application Use Cases]
        Repo[Database Repositories]
        AI[AI Fallback Chains]
    end

    subgraph Data & Third-Party APIs
        DB[(Supabase PostgreSQL)]
        Groq[Groq API]
        OAI[OpenAI Fallback]
    end

    subgraph Automation Orchestration
        n8n[n8n Automation Engine]
        Cal[Google Calendar Sync]
        WA[WhatsApp Logs Sync]
    end

    UI -->|React Actions| State
    UI -->|Axios HTTP Requests| Route
    Route -->|Validate Inputs| UC
    UC -->|Query / Insert| Repo
    UC -->|Model Complete| AI
    Repo -->|Bypass RLS| DB
    AI -->|Fast Inference| Groq
    AI -->|Failover Backup| OAI
    n8n -->|Trigger webhook alerts| Route
    n8n -->|Fetch calendars| Cal
    n8n -->|Dispatch alerts| WA
```

---

## 💻 Backend Clean Architecture Layers

The backend service is structured inside [`backend/src/`](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/backend/src) using four strict boundaries to enforce decoupling:

### 1. Domain Layer (`src/domain/`)
- Contains the core business entities and logic models (e.g. `User`, `Task`, `CalendarEvent`, `Notification`).
- Independent of databases, frameworks, or web routers.

### 2. Application Layer (`src/application/`)
- Contains use case classes implementing business workflows (e.g., `RegisterUser`, `LoginUser`, `GetTasks`).
- orchestrates data flow to and from the domain entities.

### 3. Presentation Layer (`src/presentation/`)
- **Controllers**: Intercept HTTP request bodies, execute use cases, and format JSON payloads.
- **Validators**: Guard input endpoints using `express-validator` to reject malformed parameters with a `400 Bad Request`.
- **Routes**: Mount endpoints under `/api/v1` and attach authentication and rate limit middlewares.

### 4. Infrastructure Layer (`src/infrastructure/`)
- **Database Repositories**: Encapsulate Supabase database calls (`supabase-js` query statements).
- **AI Service Core**: Manages API calls to Groq and OpenAI, handling retries and failover chains.
- **n8n Services**: Integrates third-party mock WhatsApp notifications and Google Calendar sync loops.

---

## 🎨 Frontend Application Architecture

The Next.js 16/15 web client in [`frontend/`](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/frontend) uses a modern single-page-app layout:
- **Layout Shell**: A layout page containing the sidebar navigation and authenticated header navbar.
- **TanStack Query (React Query)**: Manages client-side query caching, loading skeletons, stale-while-revalidate configurations, and auto-mutations.
- **Zustand State Store**: Stores transient UI states (sidebar toggles, themes) and authentication session tokens.
- **Axios HTTP Client**: Centralized instance with request interceptors to attach `Authorization: Bearer <JWT>` header on every call.
- **Visual styling system**: Curated dark mode colors, glassmorphism card overlays, and subtle hover borders modeled on Linear and Stripe designs.
