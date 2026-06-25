# 🚀 CampusFlow Production Deployment Guide

This guide describes how to deploy the backend, frontend, database, and automation layers of CampusFlow to production hosting environments.

---

## 🗄️ 1. Production Database Deployment (Supabase)

For production, do not use test/mock databases.
1. Spin up a new PostgreSQL project on [Supabase](https://supabase.com).
2. Execute the production database schema in the SQL Editor:
   [backend/database/init.sql](file:///home/luffy/.gemini/antigravity-ide/scratch/Campus_flow/backend/database/init.sql)
3. **Enable RLS Policies**: Ensure Row-Level Security (RLS) is activated on sensitive public tables (Tasks, Attendance, Profiles, Placement tracker, Notifications, AI history).
4. **Storage Bucket**: Confirm that the `avatars` bucket is marked as public and the `documents` bucket is private.

---

## 💻 2. Backend Service Deployment (Render / Railway / VM)

The backend Express application is designed for cloud containers or VMs.

### Render Deployment Steps
1. Create a **New Web Service** on Render connected to your GitHub repository.
2. Set the root directory parameter to `backend`.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render binds automatically to this port)
   - `JWT_SECRET`: *Generate a strong secret key (e.g. `openssl rand -base64 32`)*
   - `JWT_EXPIRES_IN`: `7d`
   - `SUPABASE_URL`: *Your production Supabase API URL*
   - `SUPABASE_SERVICE_ROLE_KEY`: *Your production Supabase service role key*
   - `GROQ_API_KEY` & `OPENAI_API_KEY`: *Valid production AI completion tokens*
   - `AUTOMATION_WEBHOOK_SECRET`: *Strong random key shared with n8n*
5. Connect your Render service. It will deploy, bootstrap, and run on a public domain (e.g. `https://campusflow-api.onrender.com`).

---

## 🎨 3. Frontend App Deployment (Vercel)

Next.js is native to Vercel and optimizes automatically.

### Vercel Deployment Steps
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Configure the root directory parameter to `frontend`.
4. Keep the default Next.js build settings:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Under **Environment Variables**, add:
   - **`NEXT_PUBLIC_API_URL`**: Set this to the hosted production URL of your backend (e.g., `https://campusflow-api.onrender.com/api/v1`).
6. Click **Deploy**. Vercel will build, optimize static routes, code-split charts, and assign a production domain (e.g. `https://campusflow.vercel.app`).

---

## ⚙️ 4. n8n Automation Workflows Hosting

To ensure notifications execute reliably around the clock:
1. Deploy **n8n** using Docker on a VM (e.g., DigitalOcean, GCP, AWS) or sign up for **n8n Cloud**.
2. Configure n8n environment variables to store credentials safely:
   - `N8N_ENCRYPTION_KEY`: *Your secure encryption key*
3. Import the workflows from the `backend/n8n/` folder.
4. Update the HTTP webhook node URLs to point to your deployed production backend API:
   `POST https://campusflow-api.onrender.com/api/v1/automation-logs/webhooks`
5. Enable all workflows and set them to **Active**.
