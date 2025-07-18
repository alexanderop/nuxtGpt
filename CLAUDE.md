# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 application using Vue 3 Composition API, TypeScript, and UnoCSS. The project is based on the Vitesse for Nuxt 3 template.

## Essential Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Development server with hot reload
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build for production
pnpm build

# Preview production build locally
pnpm preview

# Generate static site
pnpm generate
```

## Architecture

### Core Stack

- **Nuxt 3** with Vue 3 Composition API and `<script setup>` syntax
- **TypeScript** for type safety
- **UnoCSS** for atomic CSS with attributify mode
- **Pinia** for state management (stores in composables)
- **Vite** for fast builds and HMR

### Directory Structure

- `/app/` - Main application code
  - `components/` - Auto-imported Vue components
  - `composables/` - Auto-imported composition utilities and Pinia stores
  - `pages/` - File-based routing
  - `layouts/` - Application layouts
  - `config/` - App configuration (PWA config)
- `/server/` - Nitro server with API routes
- `/public/` - Static assets

### Key Patterns

1. **Auto-imports**: Components and composables are automatically imported - no need for explicit imports
2. **File-based routing**: Create files in `/app/pages/` to add routes
3. **Server API**: Add API endpoints in `/server/api/`
4. **State management**: Use Pinia stores defined in `/app/composables/`
5. **Styling**: Use UnoCSS atomic classes with attributify mode (e.g., `<div text-xl font-bold>`)

### Module Configuration

Key modules configured in `nuxt.config.ts`:

- `@vite-pwa/nuxt` - PWA support with offline capabilities
- `@nuxtjs/color-mode` - Dark/light mode switching
- `@unocss/nuxt` - Atomic CSS
- `@vueuse/nuxt` - Composition utilities
- `@nuxt/eslint` - ESLint integration

### Development Notes

- Uses pnpm workspace with catalogs for dependency management
- Nuxt 4 compatibility features enabled
- Full TypeScript support with auto-generated types
- ESLint configured with @antfu/eslint-config for consistent code style
- Follows Conventional Commits specification for commit messages

### OpenAI Chat Integration

This project includes a live-streaming chat interface powered by OpenAI:

- Set `OPENAI_API_KEY` environment variable before running
- Chat UI available at the home page (/)
- Streaming responses using Server-Sent Events
- API endpoint at `/server/api/chat.post.ts`

## Git Workflow Commands

### Create Conventional Commit and Push

When asked to "commit and push" or similar, follow these steps:

1. Check git status and review all changes
2. Create a conventional commit with appropriate type (feat, fix, docs, style, refactor, test, chore)
3. Push to the current branch

Example command: "commit and push the latest changes"

### Conventional Commit Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that don't affect code meaning (formatting, missing semicolons, etc)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding or updating tests
- `chore:` - Changes to build process or auxiliary tools

## Development Workflow

### Code Quality Checks

**IMPORTANT**: After making any file changes, always run the following commands to ensure code quality:

```bash
# Run linting to check code style
pnpm lint

# Run type checking to ensure TypeScript correctness
pnpm typecheck
```

These commands must be run after every file modification to maintain code quality and catch potential issues early.
