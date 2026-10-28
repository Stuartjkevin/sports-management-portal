# Sport Team Management Portal

**Multi-Sport Team Management and Performance Analytics System** (BTech CSE project)

A full-stack web app for running sports clubs: clubs, teams, players, matches, tournaments and
training sessions in one place, with performance charts and a smart team-lineup suggestion.

```
Browser (React + Vite)  ──HTTP/JSON──►  Express API (Node.js)  ──►  MongoDB Atlas
  frontend/  :5173                        backend/  :5000              (or in-memory demo data)
```

## Quick start

Requires **Node.js 22 or newer**.

```bash
npm install     # installs backend + frontend and creates the .env files
npm run dev     # starts the API and the React app together
```

Open **http://localhost:5173** and log in with a demo account (password `Demo@123`):

| Role | Email |
| --- | --- |
| Super Admin | superadmin@stp.demo |
| Club Admin | clubadmin@stp.demo |
| Coach | coach@stp.demo |
| Player | player@stp.demo |

By default the API keeps the demo data **in memory** (it resets on every restart), so no database
setup is needed. To use MongoDB Atlas, set `MONGODB_URI` in `backend/.env`. Each empty collection
is filled with the demo data on first start.

## Scripts (run from this folder)

| Command | What it does |
| --- | --- |
| `npm run dev` | API on :5000 and React app on :5173, with output from both in one terminal |
| `npm run smoke` | End-to-end API check (33 checks). Run it while `npm run dev` is running |
| `npm run build` | Production build of the frontend into `frontend/dist` |
| `npm start` | Starts the API without file watching (production) |

## Tech stack

| Layer | Tools |
| --- | --- |
| Frontend | React 19, Vite 6, React Router 7, Bootstrap 5, Bootstrap Icons, Chart.js 4 |
| Backend | Express 5, MongoDB driver 7, jsonwebtoken, bcryptjs, helmet, cors, dotenv |
| Database | MongoDB Atlas (one collection per resource) |

## Project structure

```
├── package.json          one-command scripts (npm workspaces + concurrently)
├── scripts/setup.js      creates .env files after npm install
├── render.yaml           Render deployment (API + static site)
├── backend/
│   ├── scripts/smokeTest.js
│   └── src/
│       ├── routes/        URL → controller (all routes listed in routes/index.js)
│       ├── middleware/    login check, role check, request logging, error handling
│       ├── controllers/   logic for each resource
│       ├── repositories/  the only place that talks to storage
│       ├── store/         MongoDB and in-memory repository implementations
│       ├── services/      business logic (team selection)
│       ├── data/          demo seed data
│       ├── config/        environment and database connection
│       └── utils/         constants (roles, sports), validators, errors
└── frontend/
    └── src/
        ├── pages/         one file per page
        ├── components/    reusable UI (cards, tables, forms, ProtectedRoute, Sidebar)
        ├── layouts/       public layout and dashboard layout
        ├── context/       AuthContext, NotificationContext
        ├── hooks/         useApi, useAuth, useForm, useNotifications
        ├── services/      apiClient (fetch + JWT + errors) and resource services
        └── utils/         roles, validators, formatting, chart setup
```

## Roles and permissions

| Role | Can do |
| --- | --- |
| Super Admin | Everything, including creating and deleting clubs |
| Club Admin | Manage teams and tournaments |
| Coach | Manage players, matches and training; mark attendance; team selection and analytics |
| Player | Own profile, attendance, matches, standings and notifications |

Anyone can register as Club Admin, Coach or Player. Super Admins must be created directly in the
database. The backend's `authorize(...)` middleware returns **403** for a disallowed role, and the
frontend hides the pages a role cannot use.

## Features

- **Sports:** Cricket and Football are active. Basketball and Volleyball are defined but not enabled yet.
- **Smart team selection** (`backend/src/services/teamSelection.js`): each player is scored from
  skill rating, recent form and training attendance. The weights depend on the strategy:
  Balanced (40/40/20), Form (form 60%) or Discipline (attendance 40%). Required positions
  (Goalkeeper, Wicket-keeper) are filled first, then the highest scores. Every pick comes with a
  plain-English reason.
- **Analytics:** dashboard totals and per-sport charts.
- **Training attendance:** coaches mark Present, Absent or Excused.
- **Tournaments:** points tables (standings).
- **Notifications:** a list for each user, with read and read-all.

## Security

- Passwords are hashed with bcrypt.
- Logins use JWT tokens that carry the user's id and role.
- `helmet` adds safe HTTP headers.
- CORS allows only `CLIENT_URL` to call the API from a browser.

## API (all under `/api`)

| Method | Path | Roles |
| --- | --- | --- |
| GET | /health | public |
| POST | /auth/register, /auth/login | public |
| GET / PUT | /auth/me, PUT /auth/me/password | logged in |
| CRUD | /clubs | read: staff · write: Super Admin |
| CRUD | /teams, GET /teams/:id/players | read: all · write: Super/Club Admin |
| CRUD | /players, GET /players/me | read/write: staff · /me: Player |
| CRUD | /matches (?sport ?teamId ?status) | read: all · write: staff |
| CRUD | /tournaments, GET /tournaments/:id/standings | read: all · write: Super/Club Admin |
| CRUD | /training, GET/PUT /training/:id/attendance | staff |
| GET, PATCH, DELETE | /notifications, /notifications/read-all, /notifications/:id/read | own notifications |
| GET | /analytics/overview, /analytics/sport/:sport | staff |
| POST | /team-selection | staff |

"Staff" means Super Admin, Club Admin and Coach. CRUD means GET /, GET /:id, POST /, PUT or PATCH /:id, and DELETE /:id.

## Configuration

`backend/.env` (template: `backend/.env.example`)

| Variable | Purpose |
| --- | --- |
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Allowed frontend address(es) for CORS, comma-separated |
| `JWT_SECRET` | Token signing secret, at least 32 characters (generated by `npm install`) |
| `JWT_EXPIRES_IN` | Token lifetime (default `1d`) |
| `MONGODB_URI` | MongoDB Atlas connection string. Leave it unset to use in-memory data |
| `MONGODB_DB_NAME` | Database name |

`frontend/.env`: `VITE_API_URL` is the API address (default `http://localhost:5000/api`).

## Deployment (Render)

`render.yaml` defines two services on the free plan:

- **sport-team-portal-api** is a Node web service. Set `MONGODB_URI` and `CLIENT_URL` in the
  Render dashboard.
- **sport-team-portal-web** is a static site. Set `VITE_API_URL` to the API's URL plus `/api`.
