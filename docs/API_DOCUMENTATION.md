# 📡 CampusFlow REST API Documentation

CampusFlow backend APIs are served under the base prefix `/api/v1`. Authentication is verified via standard JWT bearer tokens passed in the request header: `Authorization: Bearer <token>`.

---

## 📖 Local Swagger Playground

When running the backend service in development mode, a complete interactive Swagger UI console is accessible:
- **Swagger URL**: `http://localhost:5000/api-docs`

---

## 🔑 Authentication Endpoints (`/auth`)

| Method | Endpoint | Auth? | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | No | `{ email, password, first_name, last_name }` | Create a new student user and default profile. |
| `POST` | `/api/v1/auth/login` | No | `{ email, password }` | Authenticate credentials and return signed JWT and profile details. |

---

## 📊 Dashboard Statistics (`/dashboard`)

| Method | Endpoint | Auth? | Description |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Yes | Returns user metrics (tasks done/pending, study streak, attendance averages, applied company totals). |

---

## 📝 Tasks Management (`/tasks`)

| Method | Endpoint | Auth? | Request Body / Query Params | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/tasks` | Yes | Query: `status, search, sortBy, page, limit` | Paginate, filter, and sort tasks. |
| `GET` | `/api/v1/tasks/upcoming` | Yes | *(None)* | Retrieve upcoming tasks sorted by due date. |
| `GET` | `/api/v1/tasks/:id` | Yes | *(None)* | Retrieve single task. |
| `POST` | `/api/v1/tasks` | Yes | `{ title, description, status, due_date, subject_id }` | Create a new task. |
| `PATCH` | `/api/v1/tasks/:id` | Yes | `{ title, status, due_date, notes }` | Update details of a task. |
| `DELETE` | `/api/v1/tasks/:id` | Yes | *(None)* | Delete a task. |

---

## 📅 Calendar Events (`/calendar-events`)

| Method | Endpoint | Auth? | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/calendar-events` | Yes | *(None)* | Get all user events. |
| `GET` | `/api/v1/calendar-events/today` | Yes | *(None)* | Get today's scheduled classes and events. |
| `POST` | `/api/v1/calendar-events` | Yes | `{ title, description, start_time, end_time, event_type }` | Create a calendar event (syncs to Google Calendar via n8n). |
| `DELETE` | `/api/v1/calendar-events/:id` | Yes | *(None)* | Delete an event. |

---

## 🔔 Notifications Center (`/notifications`)

| Method | Endpoint | Auth? | Query Params | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/notifications` | Yes | Query: `unread_only=true/false` | Retrieve read or unread user notifications. |
| `PATCH` | `/api/v1/notifications/:id/read` | Yes | *(None)* | Mark a single notification as read. |
| `PATCH` | `/api/v1/notifications/read-all` | Yes | *(None)* | Mark all user notifications as read. |

---

## 💼 Placement Applications (`/placement`)

| Method | Endpoint | Auth? | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/placement` | Yes | *(None)* | Get list of job applications. |
| `GET` | `/api/v1/placement/companies` | Yes | *(None)* | Retrieve company reference listing. |
| `POST` | `/api/v1/placement` | Yes | `{ company_id, role_title, status, date_applied, notes }` | Log a job application. |
| `PATCH` | `/api/v1/placement/:id` | Yes | `{ status, notes }` | Update recruitment pipeline status. |
| `DELETE` | `/api/v1/placement/:id` | Yes | *(None)* | Remove application record. |

---

## 👥 Study Groups Portal (`/groups`)

| Method | Endpoint | Auth? | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/api/v1/groups` | Yes | *(None)* | Retrieve all active study groups. |
| `POST` | `/api/v1/groups` | Yes | `{ name, description }` | Create study group. |
| `POST` | `/api/v1/groups/:id/join` | Yes | *(None)* | Join a study group. |
| `DELETE` | `/api/v1/groups/:id/leave` | Yes | *(None)* | Leave a study group. |

---

## 🤖 AI Features (`/ai`)

*Note: AI endpoints are guarded by strict rate-limits (10 requests/minute) to prevent API token exhaust.*

| Method | Endpoint | Auth? | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/ai/chat` | Yes | `{ message, subject, history, context }` | Real-time SSE streaming assistant channel. |
| `POST` | `/api/v1/ai/generate-flashcards` | Yes | `{ text, count }` | Generate flashcard Q&As. |
| `POST` | `/api/v1/ai/generate-mcqs` | Yes | `{ text, count }` | Generate quiz MCQs from text. |
| `POST` | `/api/v1/ai/summarize-notice` | Yes | `{ text }` | Generate title, deadlines, and bullet key points. |
| `POST` | `/api/v1/ai/generate-study-plan` | Yes | `{ subjects, goals, hoursPerDay }` | Produce a weekly review calendar checklist. |
| `POST` | `/api/v1/ai/prioritize-deadlines` | Yes | `{ tasks }` | Return prioritization urgency metrics. |
| `POST` | `/api/v1/ai/predict-attendance` | Yes | `{ subjectCode, attended, total, remaining }` | Predict threshold percentages. |
| `POST` | `/api/v1/ai/interview-questions` | Yes | `{ company, role, industry }` | Tailor behavioral and technical practice sheets. |
| `POST` | `/api/v1/ai/resume-suggestions` | Yes | `{ resumeText, targetRole }` | Audit resume experience in Google XYZ formats. |
| `GET` | `/api/v1/ai/daily-tip` | Yes | *(None)* | Return daily productivity tips. |

---

## ⚡ Automation Webhooks (`/automation-logs`)

Used by n8n pipelines to log webhook triggers and check sync states.

| Method | Endpoint | Headers Check | Request Body | Description |
|---|---|---|---|---|
| `POST` | `/api/v1/automation-logs/webhooks` | `X-Automation-Token` | `{ trigger_source, action, status, payload }` | Register automation cron status logs. |
