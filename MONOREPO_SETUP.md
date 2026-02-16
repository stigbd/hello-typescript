# Monorepo Setup Guide

This document explains the monorepo structure and how to work with it effectively.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Package Structure](#package-structure)
- [Workspace Configuration](#workspace-configuration)
- [Development Workflow](#development-workflow)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses **pnpm workspaces** to manage a TypeScript monorepo containing:

- **API Package**: Express.js REST API backend
- **Web Package**: React frontend with Vite
- **Shared Package**: Common TypeScript types

### Why Monorepo?

- ✅ **Code Sharing**: Share types between frontend and backend
- ✅ **Consistent Tooling**: Same linting, formatting, and TypeScript configs
- ✅ **Atomic Changes**: Update API and frontend together
- ✅ **Simplified Dependencies**: pnpm deduplicates shared dependencies
- ✅ **Easy Testing**: Test all packages together

## Architecture

```
hello-typescript/
├── packages/
│   ├── api/                          # Backend API
│   │   ├── src/
│   │   │   ├── index.ts             # Express app setup
│   │   │   ├── server.ts            # Server entry point
│   │   │   ├── openapi.ts           # OpenAPI documentation
│   │   │   ├── models/              # TypeScript models
│   │   │   └── store/               # In-memory data store
│   │   ├── tests/                   # Jest tests
│   │   ├── dist/                    # Build output
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.js
│   │
│   ├── web/                         # Frontend React app
│   │   ├── src/
│   │   │   ├── main.tsx             # React entry point
│   │   │   ├── App.tsx              # Main App component
│   │   │   ├── App.css              # App styles
│   │   │   └── index.css            # Global styles
│   │   ├── public/                  # Static assets
│   │   ├── dist/                    # Vite build output
│   │   ├── index.html               # HTML template
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   │
│   └── shared/                      # Shared code
│       ├── src/
│       │   ├── types.ts             # Common TypeScript types
│       │   └── index.ts             # Barrel export
│       ├── dist/                    # Build output
│       ├── package.json
│       └── tsconfig.json
│
├── pnpm-workspace.yaml              # Workspace configuration
├── package.json                     # Root package.json
├── pnpm-lock.yaml                   # Lockfile for all packages
└── README.md
```

## Package Structure

### @hello-typescript/api

**Purpose**: REST API for managing animals

**Key Features**:
- Express.js server
- OpenAPI/Swagger documentation
- Zod validation
- In-memory data store
- Comprehensive test suite

**Dependencies**:
- `express` - Web framework
- `zod` - Schema validation
- `@asteasolutions/zod-to-openapi` - OpenAPI generation
- `swagger-ui-express` - API documentation UI

**Scripts**:
```bash
pnpm --filter @hello-typescript/api dev      # Development with hot reload
pnpm --filter @hello-typescript/api build    # Build TypeScript
pnpm --filter @hello-typescript/api test     # Run Jest tests
pnpm --filter @hello-typescript/api start    # Run production build
```

### @hello-typescript/web

**Purpose**: React frontend for the Animal Manager

**Key Features**:
- React 18 with TypeScript
- Vite for fast dev server and builds
- Responsive UI with CSS gradients
- API proxy to avoid CORS issues

**Dependencies**:
- `react` / `react-dom` - UI library
- `vite` - Build tool
- `@vitejs/plugin-react` - React support for Vite

**Scripts**:
```bash
pnpm --filter @hello-typescript/web dev      # Dev server on port 5173
pnpm --filter @hello-typescript/web build    # Production build
pnpm --filter @hello-typescript/web preview  # Preview production build
```

### @hello-typescript/shared

**Purpose**: Shared TypeScript types and utilities

**Key Features**:
- Common type definitions
- No runtime dependencies
- Built with TypeScript declarations

**Exports**:
- `Animal` - Base animal interface
- `Cat` - Cat interface with livesLeft
- `Dog` - Dog interface with breed
- `AnimalType` - Union type of Cat | Dog

**Scripts**:
```bash
pnpm --filter @hello-typescript/shared build  # Build TypeScript declarations
pnpm --filter @hello-typescript/shared dev    # Watch mode
```

## Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

This tells pnpm to treat all directories under `packages/` as workspace packages.

### Root package.json

The root `package.json` contains:
- Workspace-level scripts for running multiple packages
- Shared devDependencies (like `@biomejs/biome`)
- Metadata about the monorepo

**Key Scripts**:
- `pnpm dev` - Run all packages in parallel
- `pnpm build` - Build all packages
- `pnpm test` - Test all packages

## Development Workflow

### Starting Development

1. **Install all dependencies**:
   ```bash
   pnpm install
   ```

2. **Run everything in development mode**:
   ```bash
   pnpm dev
   ```
   This starts:
   - API on http://localhost:3000
   - Web on http://localhost:5173
   - Shared types in watch mode

3. **Or run packages individually**:
   ```bash
   pnpm api:dev   # Just the API
   pnpm web:dev   # Just the web frontend
   ```

### Making Changes

#### Backend Changes (API)

1. Edit files in `packages/api/src/`
2. Server auto-restarts (nodemon)
3. Run tests: `pnpm api:test`
4. Check types: `pnpm api:build`

#### Frontend Changes (Web)

1. Edit files in `packages/web/src/`
2. Browser auto-reloads (Vite HMR)
3. Check types: `pnpm web:build`

#### Shared Types

1. Edit files in `packages/shared/src/`
2. Build: `pnpm shared:build`
3. Both API and Web will pick up changes

### Adding Dependencies

**To a specific package**:
```bash
# Add to API
pnpm --filter @hello-typescript/api add express

# Add dev dependency to Web
pnpm --filter @hello-typescript/web add -D eslint

# Add to shared
pnpm --filter @hello-typescript/shared add lodash
```

**To the root (for tooling)**:
```bash
pnpm add -D -w prettier
```

The `-w` flag means "workspace root".

### Cross-Package Dependencies

To use the shared package in API or Web:

1. Add to `package.json`:
   ```json
   {
     "dependencies": {
       "@hello-typescript/shared": "workspace:*"
     }
   }
   ```

2. Import in code:
   ```typescript
   import { Animal, Cat, Dog } from '@hello-typescript/shared'
   ```

3. Build the shared package first:
   ```bash
   pnpm shared:build
   ```

## Common Tasks

### Build All Packages

```bash
pnpm build
```

This builds in dependency order automatically.

### Run All Tests

```bash
pnpm test
```

### Lint & Format All Code

```bash
pnpm lint
pnpm format
```

### Clean Build Artifacts

```bash
# Remove all dist/ and node_modules/
find packages -name "dist" -type d -exec rm -rf {} +
find packages -name "node_modules" -type d -exec rm -rf {} +
rm -rf node_modules

# Then reinstall
pnpm install
```

### Add a New Package

1. Create directory:
   ```bash
   mkdir packages/my-package
   ```

2. Create `package.json`:
   ```json
   {
     "name": "@hello-typescript/my-package",
     "version": "1.0.0",
     "private": true,
     "main": "dist/index.js"
   }
   ```

3. Add `tsconfig.json` and source files

4. Install dependencies:
   ```bash
   pnpm install
   ```

The workspace will automatically detect it!

### Run Commands in All Packages

```bash
# Run build in all packages
pnpm --recursive run build

# Run script only in packages that have it
pnpm --filter './packages/*' test

# Run in parallel
pnpm --parallel --filter './packages/*' dev
```

### Debugging

**API Debugging**:
```bash
# Start API in debug mode
node --inspect packages/api/dist/server.js

# Or with ts-node
node --inspect -r ts-node/register packages/api/src/server.ts
```

**Web Debugging**:
Use browser DevTools. Source maps are enabled by default in Vite.

## Troubleshooting

### "Package not found in workspace"

**Problem**: `@hello-typescript/shared` not found

**Solution**:
1. Make sure the package name in `package.json` matches
2. Run `pnpm install` to update workspace links
3. Build the shared package: `pnpm shared:build`

### "Module not found" in TypeScript

**Problem**: TypeScript can't find shared types

**Solution**:
1. Build shared package first: `pnpm shared:build`
2. Check `tsconfig.json` has correct paths
3. Restart TypeScript server in your editor

### Port Already in Use

**Problem**: API or Web won't start due to port conflict

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port in code:
# API: packages/api/src/server.ts
# Web: packages/web/vite.config.ts
```

### pnpm Commands Not Working

**Problem**: Filtered commands not running

**Solution**:
- Use full package name: `@hello-typescript/api`
- Check package exists in `pnpm-workspace.yaml` pattern
- Verify package.json has correct name
- Run `pnpm install` to refresh workspace

### Build Failures

**Problem**: TypeScript build errors

**Solution**:
1. Clean and rebuild:
   ```bash
   rm -rf packages/*/dist
   pnpm build
   ```

2. Check TypeScript versions match across packages
3. Clear TypeScript cache:
   ```bash
   find . -name "*.tsbuildinfo" -delete
   ```

### Dependency Installation Issues

**Problem**: Dependencies not installing correctly

**Solution**:
```bash
# Clear everything
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml

# Reinstall
pnpm install
```

## Best Practices

1. **Always build shared package first** before building API or Web
2. **Use workspace scripts** from root for consistency
3. **Keep shared package minimal** - only types and pure functions
4. **Test after changes** - run `pnpm test` frequently
5. **Commit lock file** - `pnpm-lock.yaml` ensures reproducible installs
6. **Use consistent versions** - same TypeScript version across packages
7. **Document scripts** - add comments in package.json scripts

## Resources

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Monorepo Best Practices](https://monorepo.tools/)

## Need Help?

Check the main [README.md](./README.md) for basic usage, or open an issue if you encounter problems!