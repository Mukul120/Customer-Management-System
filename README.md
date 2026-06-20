# CMS - Customer list Management System

A full-stack customer list management system with asynchronous bulk contact imports.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Queue: BullMQ with Redis and ioredis
- Local Redis runtime: Docker Desktop

## How it works

```text
React and Vite frontend
        |
        v
Express API server  <---->  MongoDB
        |
        v
Redis queue  <---->  BullMQ import worker  <---->  MongoDB
```

The API queues bulk imports in Redis. The worker validates contacts, inserts them into MongoDB, and updates each import-job status.

## Prerequisites

- Node.js and npm
- MongoDB running locally, or a MongoDB connection URI
- Docker Desktop for Redis

## Project structure

```text
CMS/
├── Backend/
│   ├── config/             # MongoDB and Redis connections
│   ├── controllers/        # API request handlers
│   ├── models/             # Mongoose models
│   ├── queue/              # BullMQ queue definitions
│   ├── routes/             # Express routes
│   ├── workers/            # Background import worker
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── api/            # Axios API clients
│   │   ├── components/     # Reusable UI and layout components
│   │   ├── config/         # Environment configuration
│   │   ├── hooks/          # Data and UI hooks
│   │   └── pages/          # Application pages
│   ├── .env.example
│   └── package.json
└── README.md
```

## Environment setup

Create a `.env` file in both `Backend` and `Frontend`. Keep these files private and do not commit them.

### Backend

Copy `Backend/.env.example` to `Backend/.env`, then provide local values:

```env
PORT=
MONGO_URI=
FRONTEND_URL=
REDIS_HOST=
REDIS_PORT=
```

| Variable | Purpose |
| --- | --- |
| `PORT` | Express API server port. |
| `MONGO_URI` | MongoDB connection URI. |
| `FRONTEND_URL` | Frontend URL allowed by CORS. |
| `REDIS_HOST` | Redis hostname. |
| `REDIS_PORT` | Redis port. |

### Frontend

Copy `Frontend/.env.example` to `Frontend/.env`, then provide:

```env
VITE_API_BASE_URL=
```

This is the base URL of the backend API.

## Install dependencies

Backend:

```powershell
cd Backend
npm install
```

Frontend, in another terminal:

```powershell
cd Frontend
npm install
```

## Start the project

Use separate terminals for the backend server, worker, and frontend.

### 1. Start MongoDB

Ensure MongoDB is running and the `MONGO_URI` in `Backend/.env` points to your database.

### 2. Start Redis

Start Docker Desktop. Create the Redis container once:

```powershell
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

For later runs, start the existing container:

```powershell
docker start redis
```

Verify it:

```powershell
docker exec -it redis redis-cli ping
```

Expected result:

```text
PONG
```

### 3. Start the backend API

```powershell
cd Backend
npm start
```

### 4. Start the bulk-import worker

Use a different terminal:

```powershell
cd Backend
npm run worker
```

The worker must run for queued import jobs to be processed.

### 5. Start the frontend

Use another terminal:

```powershell
cd Frontend
npm run dev
```

Set `FRONTEND_URL` in `Backend/.env` to the URL Vite prints in this terminal, then restart the backend.

## Backend API reference

All endpoints are relative to the backend base URL. Replace `listId`, `contactId`, and `importJobId` with valid MongoDB ids.

### List APIs

| Method | Endpoint | Request body | Purpose |
| --- | --- | --- | --- |
| POST | `/api/list` | `name`, optional `description` | Create a list. |
| GET | `/api/list` | None | Get all lists. |
| PUT | `/api/list/:listId` | `name`, `description` | Update a list. |
| DELETE | `/api/list/:listId` | None | Delete a list. |

### Contact APIs

| Method | Endpoint | Request body or query | Purpose |
| --- | --- | --- | --- |
| POST | `/api/contact` | `listId`, `name`, `phone`, optional `email` | Create a contact. |
| GET | `/api/contact/search` | Optional query: `query`, `listId` | Search by name, phone, or email. |
| GET | `/api/contact/list/:listId` | None | Get contacts in one list. |
| GET | `/api/contact/:contactId` | None | Get one contact. |
| PUT | `/api/contact/:contactId` | Any of `name`, `phone`, `email`, `listId` | Update a contact. |
| DELETE | `/api/contact/:contactId` | None | Delete a contact. |

A phone number is unique inside each list. Duplicate contact creation or update returns HTTP 409.

### Bulk import APIs

| Method | Endpoint | Request body | Purpose |
| --- | --- | --- | --- |
| POST | `/api/bulk-import` | `listId`, `contacts` | Queue a contact import job. |
| GET | `/api/bulk-import/:importJobId` | None | Get import job status and results. |

Each item in `contacts` requires `name` and `phone`; `email` is optional. `listId` must be an existing list id. A successful queue request returns HTTP 202.

## Import-job flow

1. The API validates `listId` and the contact array.
2. MongoDB receives an import-job record with status `Pending`.
3. BullMQ stores the job in Redis.
4. The worker changes the status to `Processing`.
5. Contacts are validated and inserted in batches of up to 100.
6. Successful, failed, and duplicate counts are saved on the import job.
7. The job becomes `Completed` or `Failed`.

The worker can process two import jobs concurrently.

## Commands

Redis:

```powershell
docker ps
docker logs redis
docker stop redis
docker start redis
docker exec -it redis redis-cli ping
```

Frontend:

```powershell
cd Frontend
npm run dev
npm run build
npm run lint
```

Backend:

```powershell
cd Backend
npm start
npm run worker
```

## Troubleshooting

### Redis connection refused

- Confirm Docker Desktop is running.
- Start Redis with `docker start redis`.
- Confirm the Redis ping command returns `PONG`.
- Check `REDIS_HOST` and `REDIS_PORT` in `Backend/.env`.
- Restart the backend and worker after changing environment variables.

### Import stays pending

The worker is not processing the queued job. Start it with `npm run worker` from `Backend`.

### Browser CORS error

Set `FRONTEND_URL` in `Backend/.env` to the Vite development URL and restart the backend.
