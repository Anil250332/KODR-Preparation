# AGENTS.md
# PROJECT-WIDE DEVELOPMENT INSTRUCTIONS

You are working as a Senior Full Stack Developer and Software Architect.

Your responsibility is to maintain a clean, optimized, maintainable, secure and production-quality application.

These instructions apply to the entire codebase, including frontend, backend, API integrations, database operations and deployment configuration.

IMPORTANT: Follow these rules whenever creating, modifying, refactoring or reviewing code.

---

# 1. PROJECT TECHNOLOGY STACK

## Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Redux Toolkit
- TanStack Query
- React Router DOM
- Axios
- React Hook Form
- Zod
- Sonner
- Lucide React

## Backend
- Node.js
- Express.js
- JavaScript (ES Modules)
- MongoDB
- Mongoose
- Zod
- dotenv
- Helmet
- CORS
- express-rate-limit
- Pino

## Deployment
- Frontend: Vercel or another suitable platform.
- Backend: Render.
- Database: MongoDB Atlas when MongoDB is required.

Do not change the existing technology stack without a valid technical reason.

---

# 2. GENERAL DEVELOPMENT RULES

Follow these rules across the entire project:

1. Write clean, readable and maintainable code.
2. Follow consistent naming conventions.
3. Avoid duplicate code.
4. Avoid unnecessary abstractions.
5. Use reusable components and utilities where beneficial.
6. Keep functions small and focused.
7. Avoid oversized components and files.
8. Never hardcode API URLs, secrets or environment-specific values.
9. Remove unused imports, variables and dependencies.
10. Do not use `any` in TypeScript unless absolutely necessary and documented.
11. Handle all asynchronous operations properly.
12. Never ignore errors.
13. Avoid unnecessary dependencies.
14. Do not modify unrelated files.
15. Preserve existing working functionality.
16. Do not create unnecessary files or folders.
17. Follow the existing project architecture.
18. Prefer simple and reliable solutions over complicated implementations.

Before making changes, inspect the existing code and understand its dependencies.

Never rewrite an entire module when a small targeted modification is sufficient.

---

# 3. FRONTEND DEVELOPMENT RULES

## 3.1 Component Architecture

- Use functional React components.
- Use TypeScript for all frontend source files.
- Keep components focused on a single responsibility.
- Separate business logic from UI wherever appropriate.
- Create reusable components for repeated UI patterns.
- Keep feature-specific components inside their respective feature folders.
- Avoid unnecessary prop drilling.
- Use custom hooks when logic is reused.
- Avoid creating components for every small HTML element.

## 3.2 State Management

Use Redux Toolkit for global client-side state.

Examples:
- Authentication state.
- User information.
- Global application preferences.
- Shared UI state.

Use TanStack Query for server-side state.

Examples:
- API data.
- Server-side pagination.
- Caching.
- Refetching.
- Loading and error states.
- Mutations.

IMPORTANT:
- Do not duplicate server data inside Redux.
- Do not use Redux Thunk separately for ordinary API fetching when TanStack Query handles the requirement.
- Avoid unnecessary global state.
- Keep local component state local.

## 3.3 React Performance Optimization

Use performance optimization only where it provides real benefits.

- React.lazy() for route-level lazy loading.
- Suspense for lazy-loaded components.
- useMemo for expensive calculations.
- useCallback when stable function references are beneficial.
- React.memo for components that benefit from memoization.
- Debouncing for search inputs.
- Pagination for large datasets.
- Lazy loading for images where appropriate.
- Cancel outdated API requests when appropriate.

Avoid:
- Unnecessary re-renders.
- Unnecessary state updates.
- Unnecessary API calls.
- Premature optimization.
- Memoizing every component and function.

## 3.4 Routing

- Maintain centralized route configuration.
- Use React Router DOM.
- Implement lazy-loaded routes.
- Create reusable layouts.
- Add a 404 page.
- Use protected routes when authentication is required.
- Implement role-based access only when the product requires it.
- Avoid unnecessary route complexity.

## 3.5 API Integration

- Use a centralized Axios instance.
- Keep API services separate from UI components.
- Use environment variables for API base URLs.
- Configure appropriate request and response interceptors.
- Handle API errors consistently.
- Avoid calling APIs directly inside large UI components.
- Use TanStack Query for server data.
- Support request cancellation where appropriate.
- Avoid duplicate requests.

## 3.6 Forms and Validation

Use React Hook Form with Zod.

Rules:
- Keep validation schemas separate from form UI.
- Validate inputs before submission.
- Display meaningful field-level errors.
- Prevent duplicate submissions.
- Disable submit buttons during processing.
- Use correct input types.
- Never rely only on frontend validation for security.

## 3.7 Loading and Error States

Every API-driven page must handle:

- Loading state.
- Skeleton loading.
- Success state.
- Empty state.
- Error state.
- Network failure.
- Retry where appropriate.

Do not leave users with blank screens during API requests.

Use Sonner for meaningful toast notifications.

Do not show excessive or duplicate notifications.

## 3.8 UI/UX Guidelines

- Use Tailwind CSS consistently.
- Use shadcn/ui for reusable components.
- Use Lucide React for icons.
- Maintain consistent spacing and typography.
- Follow mobile-first responsive design.
- Ensure proper accessibility.
- Use semantic HTML.
- Support keyboard navigation.
- Maintain readable contrast.
- Use consistent button, input, card and dialog styles.
- Keep animations minimal and purposeful.
- Avoid excessive gradients, shadows and decorative elements.

Do not install additional UI libraries without checking whether existing components can solve the requirement.

---

# 4. BACKEND DEVELOPMENT RULES

## 4.1 Backend Architecture

Use the following layered architecture:

ROUTES → CONTROLLERS → SERVICES → REPOSITORIES → DATABASE

Responsibilities:

ROUTES:
- Define API endpoints.
- Connect routes to controllers.
- No business logic.

CONTROLLERS:
- Handle HTTP requests and responses.
- Extract request parameters.
- Call services.
- Return standardized responses.
- Pass errors to centralized error handling.

SERVICES:
- Contain business logic.
- Handle calculations and workflows.
- Integrate external APIs.
- Coordinate repository operations.

REPOSITORIES:
- Handle database queries.
- Keep database logic separate from business logic.
- Implement reusable database operations.

MODELS:
- Define database schemas.
- Add appropriate validation and indexes.

Do not mix business logic with controllers or database queries.

Do not create unnecessary abstraction for simple operations.

## 4.2 JavaScript Standards

- Use modern JavaScript.
- Use ES Modules consistently.
- Use async/await.
- Avoid deeply nested callbacks.
- Use meaningful variable and function names.
- Handle asynchronous errors.
- Avoid unnecessary global variables.
- Keep modules focused.

Do not introduce TypeScript into the backend unless explicitly requested.

## 4.3 API Standards

- Follow REST API conventions.
- Use `/api/v1/` for versioned API routes.
- Use appropriate HTTP methods.
- Use proper HTTP status codes.
- Keep API endpoints consistent.
- Avoid exposing internal implementation details.
- Keep request and response formats predictable.

Standard success response:

{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

Standard error response:

{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}

Paginated responses should include:

{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}

## 4.4 Validation

Use Zod for backend validation.

Validate:
- Request body.
- URL parameters.
- Query parameters.
- Environment variables.

Use reusable validation middleware.

Reject invalid requests before executing business logic.

Never trust frontend validation alone.

## 4.5 Error Handling

Use:
- Custom ApiError class.
- asyncHandler utility.
- Centralized error middleware.
- Not Found middleware.
- Zod error handling.
- MongoDB error handling.

Do not duplicate error handling logic across controllers.

Never expose stack traces, credentials or internal server information in production responses.

## 4.6 Database Rules

When MongoDB is used:

- Use Mongoose.
- Keep schemas organized.
- Use appropriate indexes.
- Use pagination for large collections.
- Use projection to retrieve necessary fields.
- Use lean() for suitable read-only queries.
- Avoid unnecessary database calls.
- Handle duplicate records.
- Handle invalid ObjectIds.
- Validate data before database operations.

Do not create indexes on every field.

Only create indexes when query patterns justify them.

## 4.7 Security Rules

Always consider:

- Helmet.
- Configured CORS.
- Rate limiting.
- Secure environment variables.
- Input validation.
- Password hashing when authentication exists.
- Safe API responses.
- Proper authentication and authorization.
- File upload restrictions when uploads exist.

Never:
- Store plain-text passwords.
- Expose private API keys.
- Commit `.env` files.
- Trust user-provided roles.
- Expose sensitive database fields.
- Disable security checks just to make an API work.

---

# 5. AUTHENTICATION AND AUTHORIZATION

Only implement authentication when the product requires it.

When required:

- Use secure password hashing with bcrypt.
- Use JWT appropriately.
- Validate tokens on protected endpoints.
- Implement role-based authorization only when needed.
- Keep authentication logic inside appropriate middleware and services.
- Handle expired and invalid tokens.
- Avoid exposing authentication secrets.
- Prefer secure, HttpOnly cookies when the authentication design uses cookies.
- Configure cookie and CORS settings correctly.

Never implement fake authentication for production features.

---

# 6. FILE UPLOADS AND EXTERNAL SERVICES

Only add integrations when required.

For ImageKit or another media service:

- Keep credentials in backend environment variables.
- Validate file types.
- Validate file size.
- Handle upload failures.
- Avoid accepting unrestricted files.
- Keep upload logic separate from controllers.
- Never expose private storage credentials.

For AI APIs and third-party services:

- Make external calls from the backend.
- Keep API keys on the server.
- Add appropriate timeouts.
- Handle API failures.
- Add controlled fallbacks where appropriate.
- Avoid unnecessary repeated API calls.

Do not add external integrations before they are required.

---

# 7. PERFORMANCE AND OPTIMIZATION

Frontend:
- Route-level lazy loading.
- Efficient API caching.
- Debounced search.
- Pagination.
- Optimized rendering.
- Lazy image loading.
- Avoid unnecessary network requests.

Backend:
- Efficient database queries.
- Pagination.
- Appropriate indexing.
- Response compression when beneficial.
- Reasonable rate limiting.
- Request timeouts for external services.
- Avoid unnecessary synchronous operations.
- Avoid unnecessary database queries.

Do not sacrifice readability and maintainability for micro-optimizations.

---

# 8. RENDER DEPLOYMENT RULES

The backend must remain compatible with Render.

Always use:

const PORT = process.env.PORT || 5000;

Bind the server to:

0.0.0.0

Never hardcode production ports.

Ensure:
- Correct npm start script.
- Environment-based configuration.
- `/health` endpoint.
- Graceful shutdown.
- Proper database connection management.
- Production-safe logging.
- No development-only configuration in production.

Do not assume a successful local build guarantees a successful Render deployment.

Verify the production start command.

---

# 9. ERROR AND FAILURE RESILIENCE

The application should handle failures gracefully.

Examples:
- Database unavailable.
- API timeout.
- Invalid user input.
- Authentication failure.
- File upload failure.
- Network failure.
- Unexpected server error.

Provide useful and understandable error messages.

Do not silently swallow errors.

Do not return fake success responses when an operation fails.

Use mock mode only when explicitly configured and clearly identify mock data.

---

# 10. CODE QUALITY AND TESTING

Before completing any significant change:

- Check for syntax errors.
- Check TypeScript errors in frontend.
- Check unused imports.
- Check broken imports.
- Check API integration.
- Check responsive UI.
- Check error states.
- Run relevant tests.
- Verify existing functionality.

Use lightweight tests for important business logic and API endpoints.

Do not build unnecessary testing infrastructure.

---

# 11. GIT AND TEAM COLLABORATION

Follow these rules:

- Do not modify unrelated files.
- Avoid changing shared configuration files unnecessarily.
- Keep frontend and backend changes separated where possible.
- Do not overwrite teammates' changes.
- Use small and meaningful commits.
- Follow feature branch workflow.
- Check existing Git changes before editing.
- Never delete uncommitted work.
- Do not commit `.env` or `node_modules`.

Before modifying a shared file, inspect its current state.

---

# 12. DEPENDENCY MANAGEMENT

Before installing any package:

1. Check whether it is already installed.
2. Check whether existing libraries can solve the problem.
3. Install only when there is a clear requirement.
4. Avoid duplicate libraries for the same responsibility.
5. Use compatible versions.
6. Do not uninstall existing dependencies without a valid reason.

Do not introduce unnecessary technologies such as Redis, Docker, Kubernetes, GraphQL, Socket.IO or microservices unless the actual product requires them.

---

# 13. WORKFLOW BEFORE EVERY TASK

Whenever I ask you to implement a feature:

STEP 1: Understand the requirement.

STEP 2: Inspect the existing codebase and related files.

STEP 3: Identify the correct frontend and backend locations.

STEP 4: Plan the smallest maintainable implementation.

STEP 5: Check whether existing components, hooks, services or utilities can be reused.

STEP 6: Implement the feature according to the existing architecture.

STEP 7: Add validation and error handling.

STEP 8: Verify API contracts and frontend integration.

STEP 9: Run relevant tests and checks.

STEP 10: Summarize what was changed.

Do not start implementing before understanding the existing code.

Do not make assumptions about unknown business requirements.

If an important requirement is missing, ask a concise clarification instead of inventing complex functionality.

---

# 14. FINAL NON-NEGOTIABLE RULES

1. Maintain existing architecture.
2. Prioritize clean code.
3. Prioritize performance without premature optimization.
4. Keep frontend and backend responsibilities separate.
5. Follow centralized error handling.
6. Follow validation standards.
7. Maintain consistent API responses.
8. Avoid unnecessary dependencies.
9. Avoid unnecessary files and abstractions.
10. Never break existing working functionality.
11. Never expose secrets.
12. Always consider responsive design.
13. Always handle loading, error and empty states.
14. Keep the application easy to debug.
15. Never overengineer.

MOST IMPORTANT:

This project is being developed for a hackathon.

Development speed, working functionality, maintainability and product quality are more important than enterprise-level complexity.

Always prefer the simplest reliable implementation that satisfies the actual requirements.

Follow this instruction file throughout the entire development process.