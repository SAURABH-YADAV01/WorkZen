# Work Zen

A full-stack team task management web application built with React, Express, MongoDB, and JWT authentication. Users can create projects, add team members, assign tasks, update progress, and view dashboard statistics.

##  Live Demo



## Features

- User signup and login with JWT authentication
- Project creation and project-level admin access
- Add and remove project members
- Delete projects with their related tasks
- Create, edit, delete, and assign tasks
- Task statuses: `To Do`, `In Progress`, `Done`
- Task priorities: `Low`, `Medium`, `High`
- Dashboard summary for total tasks, task status counts, and overdue tasks
- Tasks-per-user analytics for project admins
- Role behavior handled at project level: the project creator is the project admin
- Responsive React UI with component-based structure

## Tech Stack

**Frontend**

- React
- Vite
- Lucide React icons
- CSS

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

```text
Work Zen/
  backend/
    config/
    controllers/
    middleware/
    model/
    routes/
    utils/
    server.js
  frontend/
    src/
      components/
      lib/
      App.jsx
      main.jsx
      styles.css
  package.json
  README.md
```

## Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/workzen
JWT_SECRET=your_long_secret_key
FRONTEND_URL=http://localhost:5173,http://localhost:5174
NODE_ENV=development
```

Create a `.env` file inside the `frontend` folder if you want to override the default API URL:

```env
VITE_API_URL=http://localhost:8000/api
```

## Installation

Install dependencies in the root, backend, and frontend folders:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Run the Project

From the root folder, start both frontend and backend with one command:

```bash
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

If Vite starts on another port such as `5174`, the backend CORS configuration supports local development ports.

## Available Scripts

Root scripts:

```bash
npm run dev
npm start
npm run build
```

Backend scripts:

```bash
npm run dev --prefix backend
npm start --prefix backend
```

Frontend scripts:

```bash
npm run dev --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |
| GET | `/api/auth/users?search=value` | Search users |

Protected routes require this header:

```http
Authorization: Bearer <token>
```

### Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects` | Get current user's projects |
| GET | `/api/projects/:id` | Get project details |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/add-member` | Add member to project |
| POST | `/api/projects/remove-member` | Remove member from project |

### Tasks

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get visible tasks |
| GET | `/api/tasks?projectId=:id` | Get tasks for a project |
| GET | `/api/tasks/:id` | Get task details |
| PATCH | `/api/tasks/:id/status` | Update task status |
| PUT | `/api/tasks/:id` | Update task details |
| DELETE | `/api/tasks/:id` | Delete task |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/dashboard` | Get current user's dashboard |
| GET | `/api/dashboard?projectId=:id` | Get project dashboard |
| GET | `/api/dashboard/tasks-per-user?projectId=:id` | Get task count per user |

## Access Rules

- Any logged-in user can create a project.
- The project creator is the project admin.
- Project admins can add/remove members.
- Project admins can create, update, delete, and assign tasks.
- Members can view project tasks assigned to them.
- Members can update the status of their assigned tasks.
- Only project admins can delete projects.

## Frontend Components

The frontend is split into smaller components:

```text
frontend/src/components/
  AuthScreen.jsx
  Sidebar.jsx
  Topbar.jsx
  DashboardStats.jsx
  TaskSection.jsx
  TaskForm.jsx
  TaskBoard.jsx
  TeamPanel.jsx
```

Shared frontend logic lives in:

```text
frontend/src/lib/
  api.js
  constants.js
```

## Notes

- Do not commit `.env` files.
- Do not commit `node_modules`.
- Build the frontend before deployment:

```bash
npm run build
```

## Author

Team Task Manager project by Saurabh.
