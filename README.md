# 🎓 CampusFlow — AI-Powered Student Productivity Platform

CampusFlow is an all-in-one student productivity system built for modern academics. It connects course tasks, calendar events, class attendance forecasts, job placement trackers, AI study buddy models, and automated WhatsApp alert broadcasts into a single premium interface.

---

## 🚀 Hackathon & Production Ready Highlights

- **Decoupled Monorepo Structure**: Separate Next.js App Router frontend and Node.js Clean Architecture Express API backend.
- **Fail-Safe Caching & Fallbacks**: 
  - Dynamic in-memory TTL backend caching for static reference datasets and AI daily tips to avoid hitting LLM API rate limits.
  - Offline database connection interceptors: if Supabase configurations are missing, the repository layer automatically generates mock-free schemas so pages render immediately.
- **Dual-Model AI Chain**: Automatically defaults prompts to Groq (LLaMA-3) for sub-second responses, falling back to OpenAI (GPT-4o-mini) if limits are hit.
- **Security & Protection**: Custom in-memory IP rate-limit protection across auth, AI endpoints, and webhook logs.
- **n8n Automation Integrations**: Fully active webhook endpoints validation (`X-Automation-Token`) and 10 importable scheduling workflows.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16/15 (TypeScript), Tailwind CSS, Framer Motion, TanStack Query, Zustand, Zod, React Hook Form, Sonner toasts.
- **Backend**: Node.js, Express, Supabase PostgreSQL, JWT Auth, Winston Logger (writing to console & log files), Helmet security headers, compression, Express Validator.
- **Orchestration**: n8n workflows, WhatsApp Cloud API loggers, Google Calendar sync APIs.

---

## 📖 System Documentation Directory

To keep documentation clean and maintainable, we have split guides into modular files inside the [`docs/`](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs) folder:

1. **[⚙️ Environment Variables Dictionary](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs/ENVIRONMENT.md)**: Descriptions of required variables, default values, and LLM/database fallback behaviors.
2. **[🛠️ Local Installation & Setup Guide](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs/INSTALLATION.md)**: Step-by-step instructions to seed your Supabase database, configure local configs, run backend routes on Port 5000, and spin up the frontend on Port 3000.
3. **[🚀 Production Deployment Manual](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs/DEPLOYMENT.md)**: Hosting guides for Render (Backend), Vercel (Frontend), Supabase (PostgreSQL with RLS), and n8n Docker containers.
4. **[🏗️ System Architecture Details](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs/ARCHITECTURE.md)**: Decoupling specifications mapping client-state, use cases, repos, and webhooks with Mermaid system flowcharts.
5. **[📂 Folder Structure Mapping](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs/FOLDER_STRUCTURE.md)**: Full tree mapping and directory dictionary describing where components reside.
6. **[📡 REST API Reference Guide](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/docs/API_DOCUMENTATION.md)**: Endpoint listings mapping parameters, payload JSON schemas, and local Swagger console access.

---

## 🏃 Quick Start Check

```bash
# 1. Spin up backend
cd backend
npm install
npm run start:dev   # Runs on http://localhost:5000

# 2. Spin up frontend
cd ../frontend
npm install
npm run dev         # Runs on http://localhost:3000
```
*Browse to [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to view Swagger UI logs in dev mode.*
