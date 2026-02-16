# Apps vs Packages: Reorganization Summary

This document explains the final reorganization of the monorepo into the **apps/** and **packages/** structure, which is a best practice for TypeScript monorepos.

## What Changed?

We reorganized the monorepo from:

```
hello-typescript/
└── packages/
    ├── api/
    ├── web/
    └── shared/
```

To:

```
hello-typescript/
├── apps/
│   ├── api/
│   └── web/
└── packages/
    └── shared/
```

## Why Apps vs Packages?

This separation provides **semantic clarity** about the role of each workspace:

### Apps (`apps/`)
- **Purpose**: Deployable applications that run as services
- **Characteristics**: 
  - Have entry points (servers, frontends, CLIs)
  - Run in production environments
  - Consume packages but aren't consumed themselves
  - Have their own runtime configurations
  - Can be deployed independently

### Packages (`packages/`)
- **Purpose**: Shared, reusable libraries
- **Characteristics**:
  - Imported by apps or other packages
  - No runtime of their own
  - Export types, utilities, components, or configs
  - Should be modular and focused
  - Designed for reuse

## Real-World Analogy

Think of it like a restaurant:

- **Apps** = The restaurant locations (deployable, customer-facing)
  - `apps/api/` = Kitchen (serves food/data)
  - `apps/web/` = Dining room (customer experience)

- **Packages** = Shared recipes and ingredients (reusable resources)
  - `packages/shared/` = Recipe book (types/interfaces)
  - `packages/ui/` = Standard plating techniques (UI components)
  - `packages/utils/` = Kitchen tools (helper functions)

## Benefits of This Structure

### 1. **Clarity of Intent**
Looking at the directory structure immediately tells you:
- What can be deployed → `apps/`
- What is imported → `packages/`

### 2. **Scalability**
Easy to grow the monorepo:

```
apps/
├── api/              # REST API
├── web/              # React frontend
├── mobile/           # React Native app (future)
├── admin/            # Admin dashboard (future)
└── worker/           # Background jobs (future)

packages/
├── shared/           # Common types
├── ui/               # UI components (future)
├── database/         # Database client (future)
└── utils/            # Helper functions (future)
```

### 3. **Industry Standard**
This pattern is used by major projects:
- **Vercel/Next.js**: Uses apps for examples, packages for core code
- **Microsoft**: Uses apps for applications, packages for libraries
- **Google**: Separates deployable binaries from shared libraries
- **Turborepo**: Recommends this structure in their docs

### 4. **Clear Dependencies**
Apps depend on packages, never the reverse:

```
apps/api  ──→  packages/shared
apps/web  ──→  packages/shared

packages/shared  ✗  apps/api  (NEVER!)
```

### 5. **Independent Deployment**
Each app in `apps/` can be deployed separately:
- `apps/api/` → Deploy to Railway, Heroku, AWS
- `apps/web/` → Deploy to Vercel, Netlify, Cloudflare

## Updated Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

This tells pnpm to look in both directories for workspaces.

### Root package.json Scripts

```json
{
  "scripts": {
    "dev": "pnpm --parallel --filter './apps/*' dev",
    "build": "pnpm --recursive build",
    "test": "pnpm --recursive test",
    "api:dev": "pnpm --filter @hello-typescript/api dev",
    "web:dev": "pnpm --filter @hello-typescript/web dev",
    "shared:build": "pnpm --filter @hello-typescript/shared build"
  }
}
```

Notice:
- `pnpm dev` runs all **apps** in parallel
- Individual scripts target specific workspaces
- `pnpm build` builds everything in dependency order

## Migration Impact

### No Breaking Changes ✅
- All code still works exactly the same
- All tests still pass (17/17)
- All builds succeed
- All commands work with new paths

### What Changed
- **File locations**: Moved from `packages/` to `apps/` or `packages/`
- **Workspace config**: Updated to include both directories
- **Documentation**: Updated to reflect new structure

### What Stayed the Same
- Package names: Still `@hello-typescript/api`, etc.
- Dependencies: Exact same dependencies
- Functionality: No code changes
- Scripts: Same commands, same behavior

## Working with the New Structure

### Running Apps

```bash
# All apps
pnpm dev

# Individual apps
pnpm api:dev
pnpm web:dev
```

### Building

```bash
# Build everything
pnpm build

# Build specific workspace
pnpm api:build
pnpm web:build
pnpm shared:build
```

### Adding New Workspaces

**New App:**
```bash
mkdir apps/my-app
cd apps/my-app
pnpm init
# Set name to "@hello-typescript/my-app"
```

**New Package:**
```bash
mkdir packages/my-package
cd packages/my-package
pnpm init
# Set name to "@hello-typescript/my-package"
```

### Filtering Commands

```bash
# Run command in all apps
pnpm --filter './apps/*' build

# Run command in all packages
pnpm --filter './packages/*' build

# Run command in specific workspace
pnpm --filter @hello-typescript/api test
```

## Common Patterns

### Apps Import Packages

```typescript
// apps/api/src/index.ts
import { Animal, Cat, Dog } from '@hello-typescript/shared';

// apps/web/src/App.tsx
import { Animal } from '@hello-typescript/shared';
```

### Packages Never Import Apps

```typescript
// ❌ WRONG - Package importing app
// packages/shared/src/types.ts
import { something } from '@hello-typescript/api';  // DON'T DO THIS!

// ✅ CORRECT - Package is self-contained
// packages/shared/src/types.ts
export interface Animal {
  name: string;
  age: number;
}
```

### Apps Can Import Multiple Packages

```typescript
// apps/web/src/App.tsx
import { Animal } from '@hello-typescript/shared';
import { Button } from '@hello-typescript/ui';        // future
import { formatDate } from '@hello-typescript/utils'; // future
```

### Packages Can Import Other Packages

```typescript
// packages/ui/src/AnimalCard.tsx
import { Animal } from '@hello-typescript/shared';
import { formatName } from '@hello-typescript/utils';

export function AnimalCard({ animal }: { animal: Animal }) {
  return <div>{formatName(animal.name)}</div>;
}
```

## Best Practices

### DO ✅

1. **Put deployable code in apps/**
   - Web servers, frontends, CLIs, workers

2. **Put reusable code in packages/**
   - Types, utilities, components, configs

3. **Make packages focused**
   - One clear purpose per package

4. **Apps can be complex**
   - Apps contain business logic, routes, pages, etc.

5. **Build packages before apps**
   - Packages have no dependencies, apps depend on packages

### DON'T ❌

1. **Don't put apps in packages/**
   - If it runs as a service, it's an app

2. **Don't put packages in apps/**
   - If it's imported by multiple places, it's a package

3. **Don't create circular dependencies**
   - Apps → Packages (one direction only)

4. **Don't make packages too large**
   - Split into focused, modular packages

5. **Don't duplicate code across apps**
   - Extract to a shared package instead

## Future Growth Examples

### Adding More Apps

```
apps/
├── api/              # Current: REST API
├── web/              # Current: React frontend
├── mobile/           # Future: React Native mobile app
├── admin/            # Future: Admin dashboard
├── cli/              # Future: Command-line tool
├── worker/           # Future: Background job processor
└── docs/             # Future: Documentation site
```

### Adding More Packages

```
packages/
├── shared/           # Current: Common types
├── ui/               # Future: Shared React components
├── utils/            # Future: Helper functions
├── database/         # Future: Database client & models
├── auth/             # Future: Authentication utilities
├── api-client/       # Future: Type-safe API client
├── tsconfig/         # Future: Shared TypeScript configs
├── eslint-config/    # Future: Shared linting rules
└── test-utils/       # Future: Testing utilities
```

## Comparison with Other Patterns

### Single Package (Before Migration)
```
✗ Everything mixed together
✗ Hard to separate concerns
✗ Difficult to deploy parts independently
```

### Flat Packages (First Iteration)
```
packages/
├── api/
├── web/
└── shared/

✓ Better than single package
✗ Unclear which are apps vs libraries
✗ Doesn't scale well
```

### Apps + Packages (Current)
```
apps/
├── api/
└── web/

packages/
└── shared/

✓ Clear separation of concerns
✓ Semantic meaning (deploy vs import)
✓ Scales to many apps and packages
✓ Industry best practice
```

## Tools That Support This Pattern

- **Turborepo**: Explicitly recommends apps/packages
- **Nx**: Supports apps and libs directories
- **Rush**: Supports this pattern
- **Lerna**: Works with any structure
- **pnpm workspaces**: Agnostic, works great with this

## Conclusion

The **apps/** vs **packages/** structure provides:

✅ **Clarity**: Immediately clear what's deployable vs reusable  
✅ **Scalability**: Easy to add new apps and packages  
✅ **Best Practice**: Used by major companies and projects  
✅ **Maintainability**: Clear boundaries and dependencies  
✅ **Flexibility**: Deploy apps independently, share packages freely  

This reorganization sets up the project for long-term success as it grows from a simple API + frontend to a complex multi-app, multi-package ecosystem.

---

**Further Reading:**
- [Turborepo Handbook - Structuring a Repository](https://turbo.build/repo/docs/handbook)
- [Monorepo Tools - Best Practices](https://monorepo.tools/)
- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)

**Related Documentation:**
- [README.md](./README.md) - Project overview and usage
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture guide
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Monorepo setup and workflow
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Migration history