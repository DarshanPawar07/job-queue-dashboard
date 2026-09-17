# Mini Job Queue Dashboard

A full-stack Job Queue Management Dashboard built with React and NestJS.

The application allows users to create, monitor, filter, update, and delete jobs while enforcing valid job state transitions on the backend.

## Live Demo

### Frontend
https://job-queue-dashboard-alpha.vercel.app/

### Backend API
https://job-queue-dashboard-bdp2.onrender.com

### Health Check
https://job-queue-dashboard-bdp2.onrender.com/health

### GitHub Repository
https://github.com/DarshanPawar07/job-queue-dashboard

---

## Features

### Dashboard

- View all jobs
- Filter jobs by status
- View counts for each job status
- Create new jobs
- Update job status
- Delete jobs
- Loading states
- API error handling
- Backend connection status
- Responsive layout for desktop and mobile
- Automatic API retry handling for backend cold starts

### Job Lifecycle

Jobs follow the following state transitions:

```text
pending
   |
   v
running
  /   \
 v     v
completed  failed
```

Once a job reaches `completed` or `failed`, it cannot transition to another state.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide React

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- class-validator

### Database

- PostgreSQL
- Neon

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

---

## Project Structure

```text
job-queue-dashboard/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── health/
│   │   ├── jobs/
│   │   │   ├── dto/
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.module.ts
│   │   │   └── jobs.service.ts
│   │   │
│   │   ├── prisma/
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

# API Documentation

Base URL:

```text
https://job-queue-dashboard-bdp2.onrender.com
```

## Create Job

```http
POST /jobs
```

Request:

```json
{
  "title": "Send Welcome Email",
  "type": "email"
}
```

A newly created job starts with:

```text
pending
```

---

## Get All Jobs

```http
GET /jobs
```

Returns all jobs ordered by creation time.

---

## Update Job Status

```http
PATCH /jobs/:id/status
```

Request:

```json
{
  "status": "running"
}
```

Valid transitions:

```text
pending → running

running → completed
running → failed
```

Invalid transitions are rejected by the backend.

---

## Delete Job

```http
DELETE /jobs/:id
```

Deletes the specified job.

---

## Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "job-queue-dashboard-backend"
}
```

---

# Validation and Error Handling

The backend uses NestJS `ValidationPipe` with:

- Whitelisted DTO properties
- Rejection of unknown properties
- Request transformation
- DTO validation using `class-validator`

For example:

- Empty job titles are rejected.
- Invalid job types are rejected.
- Invalid status values are rejected.
- Invalid job IDs are rejected.
- Requests for non-existent jobs return an appropriate error.
- Invalid state transitions return an error.

---

# Concurrency Handling

One of the important requirements of this assignment is handling two requests attempting to transition the same job from:

```text
pending → running
```

at approximately the same time.

This rule is enforced on the **backend**, not only in React.

The backend first validates the current state and then performs an atomic conditional database update using the job ID and the current status.

Conceptually:

```sql
UPDATE jobs
SET status = 'running'
WHERE id = <jobId>
AND status = 'pending';
```

The implementation uses Prisma's `updateMany()` with both the job ID and the current status in the `where` condition.

If two requests attempt:

```text
pending → running
```

simultaneously, only one request can successfully update the row while it is still `pending`.

The other request receives an error because the conditional update affects zero rows.

Therefore, the frontend cannot bypass the state-transition rule simply by sending a direct API request.

The database-backed state transition is the source of truth rather than relying on client-side state.

---

# Database Design

The main `Job` model contains:

```text
id
title
type
status
createdAt
```

The status is represented using a PostgreSQL enum:

```text
pending
running
completed
failed
```

Indexes are added for:

- `status`
- `createdAt`

This supports common dashboard queries such as filtering by status and ordering by creation time.

---

# Local Setup

## Prerequisites

- Node.js
- npm
- PostgreSQL database

---

## Clone Repository

```bash
git clone https://github.com/DarshanPawar07/job-queue-dashboard.git
cd job-queue-dashboard
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create:

```text
.env
```

Add:

```env
DATABASE_URL="your-postgresql-connection-string"
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run start:dev
```

The backend runs on:

```text
http://localhost:3000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
.env
```

Add:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available through the Vite development server.

---

# Production Build

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
```

---

# Deployment

## Frontend

The React/Vite application is deployed on Vercel.

```text
https://job-queue-dashboard-alpha.vercel.app/
```

The production environment variable is:

```env
VITE_API_URL=https://job-queue-dashboard-bdp2.onrender.com
```

## Backend

The NestJS API is deployed on Render.

```text
https://job-queue-dashboard-bdp2.onrender.com
```

The backend uses the `PORT` environment variable supplied by the hosting platform.

## Database

PostgreSQL is hosted using Neon.

Database credentials are stored as environment variables and are not committed to the repository.

---

# Assumptions and Trade-offs

### State transitions

The backend is treated as the source of truth for job state transitions. Client-side validation improves the user experience, but the server independently validates every transition.

### Database

PostgreSQL was chosen over SQLite because the application is deployed and needs a remotely accessible persistent database.

### Authentication

Authentication and authorization were not implemented because they were outside the core scope of the assignment.

### Job execution

This assignment focuses on job state management rather than implementing an actual background worker system. The dashboard manages job records and their lifecycle states.

### Concurrency

A lightweight database-level conditional update was used instead of introducing distributed locks or a separate queue system. This is sufficient for the concurrency requirement while keeping the implementation simple.

---

# Production-Ready Improvements

With more development time, I would prioritize the following improvements:

### 1. Authentication and Authorization

Add user authentication and role-based authorization so that only authenticated users can access the dashboard and perform operations such as creating, updating, or deleting jobs.

This would also allow different permissions for roles such as administrators and regular users.

### 2. Search by Title or Type

Add server-side search and filtering by job title and job type.

For example:

```text
GET /jobs?search=email
GET /jobs?type=worker
```

For larger datasets, server-side filtering and pagination would avoid loading the entire job table into the browser.

### 3. Monitoring and Alerting

Add production monitoring for the backend and database, including:

- API uptime monitoring
- Error tracking
- Structured application logs
- Database monitoring
- Alerts for repeated API failures or service downtime

This would make operational problems easier to detect and investigate.

---

# Additional Production Improvement

### Graceful API Cold-Start Handling

The backend is deployed on a platform where the free service can become idle.

Instead of immediately showing an API failure when the backend is waking up, the frontend:

1. Shows a connecting state.
2. Automatically retries the API request.
3. Gives the backend time to wake up.
4. Shows the dashboard once the API becomes available.
5. Shows an error state only after the retry attempts are exhausted.

This improves the user experience without hiding genuine backend failures.

---

# Possible Future Improvements

Additional improvements could include:

- Real background workers
- Automatic job processing
- Job retry functionality
- Real-time updates using WebSockets
- Rate limiting
- Pagination
- Automated unit and integration tests
- CI/CD pipeline
- Structured logging
- Monitoring and alerting
- Authentication and authorization
- Search and advanced filtering

---

