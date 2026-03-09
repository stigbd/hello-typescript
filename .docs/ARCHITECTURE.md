# Architecture Guide

This document explains the architectural decisions and patterns used in this monorepo.

## Table of Contents

- [Monorepo Pattern: Apps vs Packages](#monorepo-pattern-apps-vs-packages)
- [Project Structure](#project-structure)
- [Design Principles](#design-principles)
- [Package Dependencies](#package-dependencies)
- [Build Pipeline](#build-pipeline)
- [Deployment Strategy](#deployment-strategy)
- [Scaling Considerations](#scaling-considerations)

## Monorepo Pattern: Apps vs Packages

This project follows a **two-tier architecture** that separates deployable applications from reusable libraries.

### Apps Directory (`apps/`)

**Purpose**: Contains deployable applications - things that run as standalone services.

**Characteristics**:
- Can be deployed independently
- Have their own runtime environments
- Consume packages but typically aren't consumed by others
- Have entry points (servers, frontends, CLIs)
- May include app-specific configurations

**Examples in this project**:
- `apps/api/` - Express.js REST API server
- `apps/web/` - React frontend application

**Naming Convention**: `@hello-typescript/<app-name>`

### Packages Directory (`packages/`)

**Purpose**: Contains shared, reusable code - things that are imported by apps or other packages.

**Characteristics**:
- No runtime of their own
- Designed to be consumed by apps
- Should be modular and focused
- Typically export utilities, types, components, or configurations
- Should have minimal external dependencies

**Examples in this project**:
- `packages/types/` - Common TypeScript type definitions

**Future packages could include**:
- `packages/ui/` - Shared React components
- `packages/utils/` - Helper functions and utilities
- `packages/validation/` - Shared validation schemas
- `packages/config/` - Shared configurations

**Naming Convention**: `@hello-typescript/<package-name>`

## Project Structure

```
hello-typescript/
│
├── apps/                           # Deployable Applications
│   ├── api/                        # Backend API Service
│   │   ├── src/
│   │   │   ├── server.ts          # Entry point
│   │   │   ├── index.ts           # Express app
│   │   │   ├── openapi.ts         # API documentation
│   │   │   ├── models/            # Domain models
│   │   │   └── store/             # Data persistence
│   │   ├── tests/                 # API tests
│   │   ├── package.json           # API dependencies
│   │   ├── tsconfig.json          # API TS config
│   │   └── jest.config.js         # Test configuration
│   │
│   └── web/                        # Frontend Application
│       ├── src/
│       │   ├── main.tsx           # Entry point
│       │   ├── App.tsx            # Root component
│       │   └── *.css              # Styles
│       ├── public/                # Static assets
│       ├── package.json           # Web dependencies
│       ├── tsconfig.json          # Web TS config
│       ├── vite.config.ts         # Build configuration
│       └── index.html             # HTML template
│
├── packages/                       # Shared Libraries
│   └── types/                      # TypeScript Types
│       ├── src/
│       │   ├── types.ts           # Type definitions
│       │   └── index.ts           # Exports
│       ├── package.json           # Package metadata
│       └── tsconfig.json          # TS config
│
├── pnpm-workspace.yaml            # Workspace configuration
├── package.json                   # Root workspace config
├── pnpm-lock.yaml                 # Dependency lock file
└── README.md                      # Documentation
```

## Design Principles

### 1. Separation of Concerns

**Apps are isolated**: Each app has its own concerns and can be deployed independently.

```
apps/api/     → Handles HTTP requests, business logic, data storage
apps/web/     → Handles UI, user interactions, state management
```

**Packages are focused**: Each package has a single, well-defined purpose.

```
packages/types/   → Only types, no runtime logic
```

### 2. Dependency Direction

Dependencies flow in one direction: **Apps depend on Packages, never the reverse.**

```
apps/api  ──→  packages/types
apps/web  ──→  packages/types

packages/types  ✗  apps/api    (NEVER!)
```

This prevents circular dependencies and keeps the architecture clean.

### 3. Workspace References

We use pnpm workspace protocol to reference internal packages:

```json
{
  "dependencies": {
    "@hello-typescript/types": "workspace:*"
  }
}
```

Benefits:
- Always uses the local version
- Type-safe during development
- No need to publish packages

### 4. Type Safety Across Boundaries

The `types` package ensures type consistency between frontend and backend:

```typescript
// packages/types/src/types.ts
export interface Animal {
  name: string;
  age: number;
  type: 'cat' | 'dog';
}

// apps/api/src/index.ts
import { Animal } from '@hello-typescript/types';

// apps/web/src/App.tsx
import { Animal } from '@hello-typescript/types';
```

Both apps use the exact same types, preventing API contract mismatches.

## Package Dependencies

### Dependency Graph

```
┌─────────────┐
│  apps/api   │
└──────┬──────┘
       │
       │ imports
       ↓
┌─────────────┐
│  packages/  │
│    types    │
└──────┬──────┘
       ↑
       │ imports
       │
┌──────┴──────┐
│  apps/web   │
└─────────────┘
```

### Current Dependencies

**apps/api**:
- Production: `express`, `zod`, `swagger-ui-express`, `@asteasolutions/zod-to-openapi`
- Development: `typescript`, `ts-node`, `nodemon`, `jest`, `@types/*`
- Internal: `@hello-typescript/types` (future)

**apps/web**:
- Production: `react`, `react-dom`
- Development: `typescript`, `vite`, `@vitejs/plugin-react`, `@types/*`
- Internal: `@hello-typescript/types` (future)

**packages/types**:
- Production: None (types only)
- Development: `typescript`
- Internal: None

### Shared DevDependencies

Common tooling is installed at the root level:
- `@biomejs/biome` - Linting and formatting
- `typescript` - Type checking (also per-package for version control)

## Build Pipeline

### Build Order

The build system respects package dependencies:

```bash
pnpm build
```

Build order:
1. `packages/types` - Types must be built first
2. `apps/api` - Can now import built types
3. `apps/web` - Can now import built types

pnpm automatically handles this with `--recursive`.

### Development Mode

In development, we run apps in parallel:

```bash
pnpm dev
```

This runs:
- `apps/api` with `nodemon` (auto-restart on changes)
- `apps/web` with `vite` (hot module replacement)

### Per-Package Scripts

Each workspace can define its own scripts:

```json
{
  "scripts": {
    "dev": "...",      // Development mode
    "build": "...",    // Production build
    "test": "...",     // Run tests
    "lint": "...",     // Lint code
    "format": "..."    // Format code
  }
}
```

Root scripts orchestrate across all workspaces.

## Deployment Strategy

### Application Deployment

Each app in `apps/` can be deployed independently:

**API Deployment** (`apps/api`):
```bash
cd apps/api
pnpm build           # Compile TypeScript
pnpm start           # Run production server
```

Deployment targets:
- Docker container
- Cloud platform (Heroku, Railway, Render)
- VPS with Node.js
- Serverless (AWS Lambda, Vercel Functions)

**Web Deployment** (`apps/web`):
```bash
cd apps/web
pnpm build           # Build static assets
```

The `dist/` folder contains static files that can be served by:
- CDN (Cloudflare, Netlify, Vercel)
- Static hosting (AWS S3 + CloudFront)
- Web servers (Nginx, Apache)

### Package Publishing

Packages in `packages/` are currently private (internal use only).

If you want to publish them to npm:
1. Remove `"private": true` from `package.json`
2. Configure npm registry
3. Use `pnpm publish` from package directory

## Scaling Considerations

### Adding New Apps

When the project grows, add more apps to `apps/`:

```
apps/
├── api/              # Existing REST API
├── web/              # Existing frontend
├── mobile/           # NEW: React Native mobile app
├── admin/            # NEW: Admin dashboard
├── cli/              # NEW: Command-line tool
└── worker/           # NEW: Background job processor
```

Each app:
- Has its own deployment pipeline
- Can scale independently
- Shares code via packages

### Adding New Packages

Extract common code into focused packages:

```
packages/
├── types/            # Existing types
├── ui/               # NEW: Shared React components
├── utils/            # NEW: Helper functions
├── database/         # NEW: Database client & models
├── auth/             # NEW: Authentication logic
├── api-client/       # NEW: Type-safe API client
├── config/           # NEW: Shared configurations
└── validation/       # NEW: Shared validation schemas
```

Benefits:
- Reduce code duplication
- Maintain consistency
- Update once, use everywhere

### Workspace Filtering

Run commands on specific subsets:

```bash
# Only apps
pnpm --filter './apps/*' dev

# Only packages
pnpm --filter './packages/*' build

# Specific workspace
pnpm --filter @hello-typescript/api test

# Multiple workspaces
pnpm --filter @hello-typescript/api --filter @hello-typescript/web build
```

### Performance Optimization

**Build Caching**: pnpm caches builds automatically.

**Parallel Execution**: Use `--parallel` for independent tasks:
```bash
pnpm --parallel --filter './apps/*' dev
```

**Incremental Builds**: TypeScript's `--incremental` flag speeds up rebuilds.

**Selective Testing**: Run tests only in changed packages:
```bash
pnpm --filter @hello-typescript/api test
```

## Best Practices

### DO ✅

1. **Keep apps deployable** - Each app should run independently
2. **Keep packages focused** - One clear purpose per package
3. **Share code via packages** - Don't duplicate logic across apps
4. **Use workspace protocol** - Reference internal packages with `workspace:*`
5. **Build packages first** - Before building apps that depend on them
6. **Version consistently** - Use same TypeScript version across workspaces
7. **Test at package level** - Each package/app has its own tests
8. **Document dependencies** - Make it clear what depends on what

### DON'T ❌

1. **Don't create circular dependencies** - Packages shouldn't import apps
2. **Don't mix concerns** - Keep app logic out of packages
3. **Don't duplicate dependencies** - Use pnpm's deduplication
4. **Don't skip the build step** - Always build packages before apps
5. **Don't hardcode paths** - Use package names, not relative paths
6. **Don't make packages too large** - Keep them focused and modular
7. **Don't forget to update lockfile** - Commit `pnpm-lock.yaml`

## Future Architecture Considerations

### Microservices

If the API grows, split into multiple services:

```
apps/
├── api-gateway/      # API Gateway (routing)
├── user-service/     # User management service
├── animal-service/   # Animal management service
└── notification-service/  # Notifications
```

All services can share packages like `types`, `database`, `utils`.

### Microfrontends

If the web app grows, split into multiple frontends:

```
apps/
├── web-shell/        # Shell application (routing)
├── web-dashboard/    # Dashboard module
├── web-admin/        # Admin module
└── web-reports/      # Reports module
```

All frontends can share `packages/ui` components.

### Shared Infrastructure

Add infrastructure packages:

```
packages/
├── docker/           # Docker configurations
├── kubernetes/       # K8s manifests
├── terraform/        # Infrastructure as code
└── ci-cd/            # CI/CD scripts
```

## Conclusion

The apps/packages pattern provides:

- **Clear boundaries** between deployable apps and shared code
- **Scalability** to add new apps and packages easily
- **Maintainability** through code sharing and consistency
- **Flexibility** to deploy apps independently
- **Developer experience** with fast builds and clear structure

This architecture supports growth from a simple monorepo to a complex multi-app, multi-package system while maintaining clarity and organization.

---

**References**:
- [Monorepo Tools](https://monorepo.tools/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)

**Related Documentation:**
- [README.md](../README.md) - Project overview and usage
- [APPS_VS_PACKAGES.md](./APPS_VS_PACKAGES.md) - Apps vs packages structure
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Monorepo setup and workflow
- [SHARED_TYPES.md](./SHARED_TYPES.md) - Using shared types
