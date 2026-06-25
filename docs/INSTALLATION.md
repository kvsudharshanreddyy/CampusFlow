# 🛠️ CampusFlow Local Setup & Installation Guide

Follow these instructions to configure and run the CampusFlow student productivity platform in your local development environment.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js**: Version 18.0.0 or higher.
- **npm**: Version 9.0.0 or higher.
- **PostgreSQL / Supabase Account**: A Supabase project to serve as your PostgreSQL database.
- **Groq API Key**: Optional, for ultra-fast AI features (LLaMA-3).
- **OpenAI API Key**: Optional, serving as the AI fallback engine.
- **n8n Workflow Automation**: Self-hosted n8n instance or n8n cloud account.

---

## 🗄️ 1. Database Schema Migration

CampusFlow uses Supabase (PostgreSQL) under the hood. To create the tables, indexes, constraints, and seed records:
1. Log in to your [Supabase Dashboard](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** from the left navigation bar.
4. Copy the entire contents of the database schema file:
   [backend/database/init.sql](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/backend/database/init.sql)
5. Paste it into the editor and click **Run**.
6. Verify that the public tables (`users`, `profiles`, `tasks`, `attendance`, `placement_tracker`, `study_groups`, `group_members`, `calendar_events`, `notifications`, etc.) are created successfully.

---

## 💻 2. Backend Service Installation

1. Navigate to the `backend` directory from your terminal root:
   ```bash
   cd backend
   ```
2. Install the production and development dependencies:
   ```bash
   npm install
   ```
3. Copy the template environment file to create your active configuration:
   ```bash
   cp .env.example .env
   ```
4. Open the newly created `.env` file and configure your credentials:
   - **`PORT`**: Set to `5000` (avoids port collisions with Next.js).
   - **`JWT_SECRET`**: Set to a long secure random string.
   - **`SUPABASE_URL`** & **`SUPABASE_SERVICE_ROLE_KEY`**: Insert keys found under *Supabase Project Settings > API*.
   - **`GROQ_API_KEY`** & **`OPENAI_API_KEY`**: Set keys to enable the AI Buddy models.
   - **`AUTOMATION_WEBHOOK_SECRET`**: Key used to validate inbound n8n webhook alerts.
5. Start the Node.js API server in development mode (using nodemon):
   ```bash
   npm run start:dev
   ```
6. Confirm the console prints:
   `Server is running on port 5000` and `Swagger docs available at http://localhost:5000/api-docs`.

---

## 🎨 3. Frontend App Installation

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the package dependencies (React 19, Next.js 16, TanStack Query, Framer Motion):
   ```bash
   npm install
   ```
3. Create a local environment variables file:
   ```bash
   touch .env.local
   ```
4. Paste the following configuration into `.env.local` pointing to the running backend service:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
5. Spin up the Next.js optimized developer server:
   ```bash
   npm run dev
   ```
6. Open your browser and navigate to `http://localhost:3000` to preview the landing page and start registering student accounts.

---

## ⚙️ 4. n8n Automation Workflows Setup

To activate scheduling reminders, WhatsApp logs, and Google Calendar event sync loops:
1. Start your local or cloud **n8n** console.
2. For each JSON file exported in the [backend/n8n/](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/backend/n8n) folder:
   - Create a **New Workflow** in n8n.
   - Click the top-right menu and choose **Import from File**.
   - Upload the target JSON configuration.
3. Configure credentials nodes within n8n (e.g. Google Calendar OAuth nodes and WhatsApp Cloud API tokens).
4. Update webhook URL fields in n8n nodes to point to your backend webhook router:
   `POST http://localhost:5000/api/v1/automation-logs/webhooks`
5. Make sure to configure the header `X-Automation-Token` value matching the `AUTOMATION_WEBHOOK_SECRET` inside your backend `.env` configuration.
