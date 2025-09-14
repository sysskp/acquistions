# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for an "acquistions" application using modern JavaScript (ES modules), Drizzle ORM with PostgreSQL (Neon), and a layered architecture pattern.

## Development Commands

**Development server:**

```bash
npm run dev
```

Uses Node.js `--watch` flag for automatic restarts on file changes.

**Code quality:**

```bash
npm run lint              # Check for linting errors
npm run lint:fix          # Auto-fix linting errors
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
```

**Database operations:**

```bash
npm run db:generate       # Generate Drizzle migration files
npm run db:migrate        # Apply pending migrations
npm run db:studio         # Open Drizzle Studio (database GUI)
```

## Architecture

### Entry Points

- `src/index.js` - Main entry point, loads environment and starts server
- `src/server.js` - Server configuration and startup
- `src/app.js` - Express application setup with middleware and routes

### Directory Structure

The codebase uses a layered architecture with path aliases (defined in package.json `imports`):

- `#config/*` → Configuration files (database, logging)
- `#models/*` → Drizzle ORM schema definitions
- `#controllers/*` → HTTP request handlers
- `#services/*` → Business logic layer
- `#routes/*` → Express route definitions
- `#middlewares/*` → Custom middleware functions
- `#utils/*` → Helper utilities (JWT, cookies, formatting)
- `#validations/*` → Zod schema validation

### Key Components

**Database Layer:**

- Uses Drizzle ORM with Neon PostgreSQL serverless
- Schema defined in `src/models/*.js` files
- Database instance exported from `src/config/database.js`

**Authentication Flow:**

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Zod validation for request data
- Cookie utilities for secure token management

**Logging:**

- Winston logger configured in `src/config/logger.js`
- Separate error and combined log files in `/logs`
- Console output in non-production environments

## Code Standards

**ESLint Configuration:**

- 2-space indentation with switch case indentation
- Single quotes for strings
- Semicolons required
- Unix line endings
- Arrow functions preferred
- No unused variables (except those prefixed with `_`)

**Prettier Configuration:**

- 80 character line width
- Single quotes
- Trailing commas (ES5)
- LF line endings

## Environment Setup

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (use secure random string in production)

## Development Patterns

**Request Flow:**

1. Route (`#routes/*.js`) receives request
2. Controller (`#controllers/*.js`) handles request, validates input
3. Service (`#services/*.js`) contains business logic
4. Model (`#models/*.js`) defines database schema
5. Response formatted and sent back

**Error Handling:**

- Validation errors formatted through `#utils/format.js`
- Service layer throws meaningful error messages
- Controllers catch and respond with appropriate HTTP status codes
- All errors logged through Winston

**Import Aliases:**
Always use the `#` aliases instead of relative paths for imports within the `src/` directory to maintain clean and consistent import statements.

## API Endpoints

Current endpoints:

- `GET /` - Basic health check
- `GET /health` - Detailed health information
- `GET /api` - API status
- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)
