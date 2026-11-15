# Production-Ready Node.js + Express Hackathon Backend Starter

A lightweight, modular, and hackathon-optimized backend foundation built with Node.js, Express (ES Modules), MongoDB/Mongoose, and Zod. Designed for rapid iteration, clean layered architecture, effortless deployment to Render, and team collaboration.

---

## 1. Tech Stack & Dependencies

### Core
- **Node.js**: Modern JavaScript runtime (ES Modules `"type": "module"`).
- **Express.js**: Fast, minimalist web framework.
- **MongoDB & Mongoose**: Flexible document database and ODM with safe startup controls.
- **Zod**: Type-safe schema validation for environment variables and HTTP requests.
- **dotenv**: Environment variable management.
- **Pino & pino-http**: High-performance, structured logging with header/credential redaction.

### Security
- **Helmet**: Essential HTTP security headers.
- **CORS**: Configurable allowed origins with credentials support.
- **express-rate-limit**: Rate limiting to guard against spam and brute-force requests.

### Development & Testing
- **Nodemon**: Auto-reload development server.
- **Vitest & Supertest**: Fast, modern integration and unit testing framework.

### Optional (Install only when required by problem statement)
- `jsonwebtoken`, `bcrypt`: Authentication and password hashing.
- `multer`, `imagekit`: File and image uploads.
- `compression`: Gzip response compression.

---

## 2. Project Folder Structure

```
backend/
│
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection & lifecycle management
│   │   └── env.js                    # Centralized Zod-validated environment config
│   │
│   ├── routes/
│   │   └── index.js                  # Centralized /api/v1 router
│   │
│   ├── controllers/                  # HTTP handlers: request parsing, calls service, returns standard response
│   ├── services/                     # Core business logic & external integrations (supports mock mode)
│   ├── repositories/                 # Direct database / Mongoose queries only
│   ├── models/                       # Mongoose schemas & indexes
│   │
│   ├── middlewares/
│   │   ├── errorHandler.middleware.js # Centralized error handler (ApiError, Zod, CastError, duplicate keys)
│   │   ├── notFound.middleware.js     # Standard 404 handler
│   │   ├── validate.middleware.js     # Reusable Zod validator (body, params, query)
│   │   └── auth.middleware.js         # Modular authentication & authorization guard blueprint
│   │
│   ├── validators/                   # Feature-specific Zod validation schemas
│   │
│   ├── utils/
│   │   ├── ApiError.js               # Standardized operational error class
│   │   ├── apiResponse.js            # Standardized API response format helpers
│   │   └── asyncHandler.js           # Async route wrapper eliminating try/catch boilerplate
│   │
│   ├── lib/
│   │   └── logger.js                 # Pino logger instance with sensitive-field redaction
│   │
│   ├── app.js                        # Express application configuration & middleware pipeline
│   └── server.js                     # Server entrypoint with graceful shutdown & 0.0.0.0 binding
│
├── tests/
│   └── app.test.js                   # Vitest & Supertest test suite
├── .env.example                      # Reference environment variable template
├── .env                              # Local environment variables (git-ignored)
├── .gitignore
├── package.json
└── README.md
```

---

## 3. Layered Architecture Flow

Strict execution pipeline:
$$\text{Routes} \longrightarrow \text{Controllers} \longrightarrow \text{Services} \longrightarrow \text{Repositories} \longrightarrow \text{Database}$$

- **Routes**: Define API endpoints and attach validation/auth middleware. No business logic.
- **Controllers**: Thin controllers using `asyncHandler`. Extract `req.body` / `req.params`, call the service, and return standard responses using `sendSuccess` or `sendPaginated`.
- **Services**: Pure business logic, calculations, workflow orchestration. Call repository methods. Check `env.MOCK_MODE` to return mock data if enabled.
- **Repositories**: Pure database queries (Mongoose models). No HTTP concepts or business rules.
- **Models**: Mongoose schemas with indexes and database validation only.

---

## 4. Environment Variables

Create your local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port number for the HTTP server | `5000` |
| `NODE_ENV` | Environment (`development`, `production`, `test`) | `development` |
| `MONGODB_URI` | MongoDB Atlas / local connection string | `""` |
| `CLIENT_URL` | Frontend origin(s) allowed for CORS (comma-separated) | `http://localhost:5173` |
| `MOCK_MODE` | Enable mock data fallback for hackathon demos | `false` |
| `JWT_ACCESS_SECRET` | Secret key for JWT access tokens (optional) | `""` |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens (optional) | `""` |
| `IMAGEKIT_PUBLIC_KEY`| ImageKit public key (optional) | `""` |
| `IMAGEKIT_PRIVATE_KEY`| ImageKit private key (optional) | `""` |
| `IMAGEKIT_URL_ENDPOINT`| ImageKit URL endpoint (optional) | `""` |

All variables are strictly validated on boot by `src/config/env.js`. If any required configuration is invalid, the process exits cleanly with descriptive error logs.

---

## 5. API Response & Error Standards

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
Stack traces are automatically stripped in production mode.
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## 6. Request Validation Example

Use `validate` middleware with Zod schemas:

```javascript
import { z } from 'zod';
import { validate } from '../middlewares/validate.middleware.js';

const createItemSchema = {
  body: z.object({
    title: z.string().min(3),
    price: z.number().positive(),
  }),
  query: z.object({
    category: z.string().optional(),
  }),
};

router.post('/items', validate(createItemSchema), itemController.create);
```

---

## 7. Mock Mode (Hackathon Demo Safety)

During hackathon presentations, internet drops or external APIs going down can break a demo.
Set in `.env`:
```env
MOCK_MODE=true
```
In your services:
```javascript
import { env } from '../config/env.js';

export const getItems = async () => {
  if (env.MOCK_MODE) {
    return [
      { id: 'mock-1', title: 'Sample Hackathon Item', price: 99 }
    ];
  }
  return await itemRepository.findAll();
};
```
- Safe: Server boots even without a MongoDB connection when `MOCK_MODE=true`.
- Explicit: Logs notify the team whenever mock mode is active.

---

## 8. Render Deployment Guide

The starter is pre-configured for zero-friction Render deployment:
- Listens on `process.env.PORT` bound to `0.0.0.0`.
- Graceful shutdown handles `SIGTERM` signals emitted by Render on redeployments and restarts.
- Health check endpoint `/health` works instantly without database dependencies.

### Render Settings
1. **Service Type**: Web Service
2. **Runtime**: `Node`
3. **Root Directory**: `backend` (if repo root contains both frontend/backend) or leave empty if backend is root.
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Health Check Path**: `/health`

### Render Environment Variables
Configure in the Render Dashboard:
- `NODE_ENV`: `production`
- `PORT`: (automatically provided by Render)
- `CLIENT_URL`: `https://your-frontend.onrender.com`
- `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/dbname`
- `MOCK_MODE`: `false`

> **Note on Render Free Tier**: Free tier instances spin down after 15 minutes of inactivity. The first request may experience a ~50-second cold start. The `/health` endpoint is ideal for keep-alive pings (e.g. via Cron-job.org or UptimeRobot).

---

## 9. Team Git Collaboration Workflow

To minimize merge conflicts during rapid hackathon sprints:

### Branch Strategy
- `main`: Production-ready code only. Never commit directly to `main`.
- `develop`: Integration branch where team members merge features.
- `feature/<name>`: Individual feature branches (e.g., `feature/auth`, `feature/payment`, `feature/ai`).

### Team Collaboration Rules
1. **Pull Latest Develop First**: Always `git pull origin develop` before creating a branch.
2. **File Ownership**: Assign feature modules by folder (`feature/auth` owns `controllers/auth.controller.js`, `services/auth.service.js`, etc.).
3. **Small PRs**: Merge small, self-contained endpoints into `develop` frequently.
4. **Never Commit Secrets**: Ensure `.env` is never committed (protected by `.gitignore`).

---

## 10. Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start development server with Nodemon & live reload |
| `npm start` | Start production server with Node.js |
| `npm test` | Run test suite with Vitest |

---

## 11. Verification Checklist

- [x] Node.js ES Modules configured (`type: module`).
- [x] Zod environment variable parsing with fail-fast boot validation.
- [x] Safe MongoDB connection with `MOCK_MODE` fallback.
- [x] Strict Layered Architecture (`Routes -> Controllers -> Services -> Repositories -> Database`).
- [x] Centralized error middleware handling ApiError, Zod, and Mongoose errors.
- [x] Standard JSON response & pagination helpers.
- [x] Security: Helmet, CORS, and Express Rate Limit.
- [x] Structured logging using Pino & pino-http with credential redaction.
- [x] Render deployment ready (`0.0.0.0` binding, graceful shutdown, `/health`).
- [x] Automated test suite passing with Vitest and Supertest.
