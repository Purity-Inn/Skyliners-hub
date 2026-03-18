# Skyliners Hub

A full-stack web platform for the **Kirinyaga University Skyliners Rollball Team**.

It includes:
- a public-facing frontend for players, matches, gallery, and announcements
- an admin area for managing players, matches, gallery approvals, and news
- backend APIs with authentication, image uploads, and optional email notifications

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Media:** Cloudinary + Multer
- **Auth:** JWT
- **Email:** Nodemailer (SMTP)

## Project Structure

```
skyliners-hub/
├── client/   # React + Vite app
└── server/   # Express API
```

## Prerequisites

- Node.js `>=20.19.0`
- npm `>=10`
- MongoDB database (Atlas or local)
- Cloudinary account (for uploads)

## Environment Setup

### 1) Backend env

Create `server/.env` from `server/.env.example` and fill values:

```dotenv
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:5173
PORT=5000

# Optional email notifications
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Skyliners Hub <your_email@example.com>"
```

### 2) Frontend env

Create `client/.env` from `client/.env.example`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

## Install Dependencies

```bash
cd /home/purry/skyliners-hub/client
npm install

cd /home/purry/skyliners-hub/server
npm install
```

## Run Locally

Use two terminals.

### Terminal 1: Backend

```bash
cd /home/purry/skyliners-hub/server
npm run dev
```

### Terminal 2: Frontend

```bash
cd /home/purry/skyliners-hub/client
npm run dev
```

Frontend runs at `http://localhost:5173` by default.

## Available Scripts

### Client (`client/package.json`)

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint

### Server (`server/package.json`)

- `npm run dev` – start server with nodemon
- `npm start` – start server with node

## Core Features

- Authentication and role-based access (`visitor`, `member`, `admin`)
- Team/player management (Men/Women team labels, flexible positions)
- Match management with team-vs-team support
- Rollball score sheet support (periods, overtime, penalties)
- Gallery upload + moderation workflow
- Announcement publishing
- Optional member/admin email notifications for key updates

## Deployment Notes

- **Frontend:** Vercel
- **Backend:** Render
- Ensure production `VITE_API_URL` points to your backend API (`/api`)
- Set backend `CLIENT_URL` to your frontend domain for CORS

## Quick Health Check

After backend starts, open:

- `http://localhost:5000/` (API root/health route)