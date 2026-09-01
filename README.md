# Pearls Notes

## Overview

A full-stack notes application with user authentication, rich-text notes,
and per-user data isolation. Built as a 10 Pearls internship project.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router, React Quill |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL with Sequelize |
| Logging | Pino |
| Testing | Mocha, Chai, Supertest, Sinon (backend) · Jest, Testing Library (frontend) |
| Code Quality | SonarCloud |

## Features

- **Auth**: sign up, log in, log out, JWT-based sessions, bcrypt-hashed passwords
- **Notes**: create, edit, delete, rich-text editing (bold/italic/underline,
  headings, ordered/bullet/checklist lists, blockquote), search/filter
- **Global exception handling**: centralized error middleware, all errors
  logged via Pino, meaningful HTTP status codes
- **Logging**: Pino throughout — HTTP request/response logging, user
  activity (signup, login, note CRUD), and errors
- **MySQL via Sequelize**: relational schema (`users` ⟶ `notes`, one-to-many),
  verified against a live managed MySQL instance (Aiven, over TLS) — not
  just against mocks

## Project Structure

```
10 Pearls Project/
├── design/                    # Reference mockups (login/signup, dashboard)
├── backend/
│   ├── server.ts              # Entry point — loads env, connects DB, starts Express
│   ├── app.ts                 # Express app, middleware, route mounting
│   ├── config/
│   │   ├── db.ts              # Sequelize connection (TLS-aware for managed MySQL)
│   │   └── logger.ts          # Pino logger
│   ├── middleware/
│   │   ├── auth.ts            # JWT auth middleware
│   │   └── errorHandler.ts    # AppError + centralized error handler
│   ├── models/
│   │   ├── User.ts
│   │   └── Note.ts            # belongsTo User
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── noteController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── noteRoutes.ts
│   └── test/                  # Mocha/Chai backend tests (+ setup.ts for test env vars)
├── frontend/
│   └── src/
│       ├── pages/                 # Each page ships with a matching .css file
│       │   ├── Auth.tsx           # Combined login/signup (+ Auth.test.tsx)
│       │   ├── Dashboard.tsx      # Notes list, search/filter, profile view toggle
│       │   └── NoteEditor.tsx     # Create/edit a note (+ NoteEditor.test.tsx)
│       ├── components/
│       │   ├── PaperBackdrop.tsx  # Pencil background
│       │   ├── ProtectedRoute.tsx
│       │   └── ProfilePanel.tsx   # Inline profile view (name/email/creation date)
│       └── utils/
│           ├── api.ts             # Axios instance with auth header
│           ├── auth.ts            # Session storage helpers
│           └── format.ts          # Date/HTML-excerpt helpers (+ format.test.ts)
├── sonar-project.properties    # SonarCloud scanner config
└── README.md
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register (`name`, `email`, `password`) |
| POST | `/api/auth/login` | — | Log in (`email`, `password`) |
| GET | `/api/auth/profile` | ✓ | Get the current user |
| GET | `/api/notes` | ✓ | List the current user's notes |
| POST | `/api/notes` | ✓ | Create a note (`title`, `content`) |
| GET | `/api/notes/:id` | ✓ | Get a single note |
| PUT | `/api/notes/:id` | ✓ | Update a note |
| DELETE | `/api/notes/:id` | ✓ | Delete a note |

Authenticated requests send `Authorization: Bearer <token>`.

## Getting Started

### Prerequisites

- Node.js v18+
- A running MySQL instance (local, or a managed provider like Aiven)

### Backend

```bash
cd backend
npm install
cp config.env.example config.env
# fill in DB_* and JWT_SECRET in config.env
# CORS_ORIGIN defaults to the Vite dev server (http://localhost:5173)
# DB_SSL_CA is only needed for managed MySQL providers that require TLS
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8000`, frontend dev server on `http://localhost:5173`.

### Testing

```bash
cd backend && npm test    # Mocha/Chai — 12/12 passing
cd frontend && npm test   # Jest — 14/14 passing
```

### Code Quality

Analyzed with SonarCloud (`sonar-project.properties`). Run manually via
the scanner-for-npm; see the project's SonarCloud dashboard for the
current report.

## Status

Core app (auth, notes CRUD, rich text, logging, exception handling,
MySQL — verified live) is merged. Additional work — a checklist/to-do
note format, an inline profile panel with change-password support, and
CORS/security hardening — is complete and passing tests, currently in
open pull requests awaiting review.
