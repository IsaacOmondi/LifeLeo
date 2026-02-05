# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LifeLeo is a journaling web application built with AdonisJS v6 (TypeScript). Users authenticate via Google OAuth and can record daily journal entries with mood tracking (good/neutral/challenging) and optional encrypted notes. There's a 5-entry daily limit per user.

## Development Commands

```bash
npm run dev           # Start dev server with HMR
npm run build         # Production build
npm run start         # Run production server
npm run test          # Run test suite
npm run lint          # ESLint
npm run format        # Prettier formatting
npm run typecheck     # TypeScript type checking

# AdonisJS Ace commands
node ace generate:key     # Generate APP_KEY for encryption
node ace migration:run    # Run database migrations
node ace migration:rollback
node ace make:controller <name>
node ace make:model <name>
node ace make:migration <name>
```

## Tech Stack

- **Backend**: AdonisJS v6, Lucid ORM, PostgreSQL
- **Frontend**: Edge.js templates, Bootstrap 5.3, Vite, SCSS
- **Auth**: Google OAuth 2.0 via Ally (session-based)
- **Validation**: VineJS (@vinejs/vine)

## Architecture

### Key Directories
- `app/controllers/` - HTTP request handlers
- `app/models/` - Lucid ORM models
- `app/middleware/` - Auth and request middleware
- `app/validators/` - VineJS form validation schemas
- `config/` - Application configuration (database, auth, ally, etc.)
- `database/migrations/` - Database schema migrations
- `resources/views/` - Edge.js templates
- `start/routes.ts` - Route definitions
- `start/kernel.ts` - Middleware stack

### Import Aliases
The project uses subpath imports (defined in package.json):
- `#controllers/*` → `./app/controllers/*.js`
- `#models/*` → `./app/models/*.js`
- `#middleware/*` → `./app/middleware/*.js`
- `#validators/*` → `./app/validators/*.js`

### Database Models
- **User**: Google OAuth fields (email, full_name, avatar_url)
- **Journal**: user_id, mood (1-3 enum), note (encrypted at rest)
  - Note encryption uses AdonisJS encryption service via `@beforeSave()` hook
  - `reachedDailyLimit()` static method enforces 5-entry daily limit

### Routes
- Public: `/`, `/google/redirect`, `/google/callback`
- Protected (require auth): `/journals/*`, `/dashboard`

## Environment Setup

Requires Node v22+ and PostgreSQL database named 'lifeleo'.

Copy `.env.example` to `.env` and configure:
- `APP_KEY` - Generate via `node ace generate:key`
- `DB_*` - PostgreSQL connection details
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - From Google Cloud Platform
