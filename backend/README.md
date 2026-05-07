# Work Zen Backend

Express + MongoDB backend for a collaborative team task management app.

## Setup

```bash
npm install
npm run dev
```

## Environment

```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/workzen
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Auth Routes

- `POST /api/auth/signup` - create account
- `POST /api/auth/login` - login and receive JWT
- `GET /api/auth/me` - get current logged-in user
- `GET /api/auth/users?search=<nameOrEmail>` - search users for project membership

Use this header for protected routes:

```http
Authorization: Bearer <token>
```

## Project Routes

Project routes are available at both `/api/projects` and `/api/admin`.

- `POST /api/projects` - create project
- `GET /api/projects` - get projects for current user
- `GET /api/projects/:id` - get one project
- `POST /api/projects/add-member` - add a member
- `POST /api/projects/remove-member` - remove a member

## Task Routes

- `POST /api/tasks` - create task, project admin only
- `GET /api/tasks` - get visible tasks
- `GET /api/tasks?projectId=<projectId>` - get tasks for a project
- `GET /api/tasks/:id` - get one task
- `PATCH /api/tasks/:id/status` - update task status
- `PUT /api/tasks/:id` - update task details, project admin only
- `DELETE /api/tasks/:id` - delete task, project admin only

## Dashboard Routes

- `GET /api/dashboard` - current user's task summary
- `GET /api/dashboard?projectId=<projectId>` - project dashboard
- `GET /api/dashboard/tasks-per-user?projectId=<projectId>` - admin-only task counts per member

## Roles

- The user who creates a project is treated as that project's admin.
- Members can view project tasks assigned to them and update their own task status.
- Project admins can manage members and tasks within their own projects.
