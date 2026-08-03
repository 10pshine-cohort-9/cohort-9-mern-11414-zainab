# Pearls Notes

## Overview

A full-stack notes application. Built as a 10 Pearls internship project.

> **Status: work in progress.** This README describes what's implemented. In particular: no MySQL instance has been available in the dev environment yet, so while the backend has 12/12 passing unit tests (with the database mocked), it has not been run against a real database.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router, React Quill |
| Backend | Node.js, Express, TypeScript |
| Database | MySQL with Sequelize |
| Logging | Pino |
| Testing | Mocha, Chai, Supertest, Sinon (backend) · Jest, Testing Library (frontend) |

## Project Structure

```
10 Pearls Project/
├── design/                    # Reference mockups (login/signup, dashboard)
├── server/
│   ├── server.ts              # Entry point — loads env, connects DB, starts Express
│   ├── app.ts                 # Express app, middleware, route mounting
│   ├── config/
│   │   ├── db.ts              # Sequelize connection
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
├── client/
│   └── src/
│       ├── pages/                 # Each page ships with a matching .css file
│       │   ├── Auth.tsx           # Combined login/signup (+ Auth.test.tsx)
│       │   ├── Dashboard.tsx      # Notes list, search/filter
│       │   ├── NoteEditor.tsx     # Create/edit a note
│       │   └── Profile.tsx
│       ├── components/
│       │   ├── PaperBackdrop.tsx  # Pencil background
│       │   └── ProtectedRoute.tsx
│       └── utils/
│           ├── api.ts             # Axios instance with auth header
│           ├── auth.ts            # Session storage helpers
│           └── format.ts          # Date/HTML-excerpt helpers (+ format.test.ts)
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
- A running MySQL instance

### Backend

```bash
cd server
npm install
cp config.env.example config.env
# fill in DB_* and JWT_SECRET in config.env
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Backend runs on `http://localhost:8000`, frontend dev server on `http://localhost:5173`.

### Testing

```bash
cd server && npm test    # Mocha/Chai
cd client && npm test    # Jest
```
