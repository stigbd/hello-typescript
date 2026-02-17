# Shared Types Implementation Summary

This document summarizes how shared types from `packages/shared` are used across the monorepo.

## What Was Done

### 1. Package Dependencies Added

Both `apps/api` and `apps/web` now have `@hello-typescript/shared` as a workspace dependency:

```json
"dependencies": {
  "@hello-typescript/shared": "workspace:*",
  // ... other dependencies
}
```

This was added using:
```bash
pnpm add @hello-typescript/shared --filter @hello-typescript/api --workspace
pnpm add @hello-typescript/shared --filter @hello-typescript/web --workspace
```

### 2. Types Updated in Web App

**Before** (`apps/web/src/App.tsx`):
```typescript
// Local type definitions (duplicated)
interface Animal {
  name: string;
  age: number;
  type: "cat" | "dog";
}

interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
}

interface Dog extends Animal {
  type: "dog";
  breed: string;
}

type AnimalType = Cat | Dog;
```

**After** (`apps/web/src/App.tsx`):
```typescript
// Import shared types from the monorepo package
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
```

### 3. Types Integrated in API

The API now imports and references the shared types alongside its Zod schemas:

**File**: `apps/api/src/models/animal.ts`
```typescript
// Import shared types from the monorepo package
import type {
  Animal as SharedAnimal,
  Cat as SharedCat,
  Dog as SharedDog,
} from "@hello-typescript/shared";

// ... Zod schemas for runtime validation ...

// Re-export the shared types for convenience
export type { SharedAnimal, SharedCat, SharedDog };
```

This approach gives you:
- **Runtime validation** with Zod in the API
- **Compile-time type checking** with shared types
- **Type consistency** across the monorepo

## How It Works

### Build Order

1. `packages/shared` is built first (compiles TypeScript to JavaScript + `.d.ts` files)
2. `apps/api` and `apps/web` can then import from the compiled package

```bash
# Build everything (automatically builds in correct order)
pnpm build
```

### Type Flow

```
packages/shared/src/types.ts
  └─> Compiled to dist/types.d.ts
      ├─> Imported by apps/web/src/App.tsx
      └─> Imported by apps/api/src/models/animal.ts
```

### Import Examples

#### In React Components (Web App)
```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
import { useState } from "react";

function App() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  
  // TypeScript knows the exact shape of each animal
  animals.forEach((animal) => {
    if (animal.type === "cat") {
      console.log(animal.livesLeft); // ✓ Type-safe
    } else {
      console.log(animal.breed); // ✓ Type-safe
    }
  });
}
```

#### In API Routes (API)
```typescript
import type { AnimalType } from "@hello-typescript/shared";
import { Request, Response } from "express";

function getAnimals(req: Request, res: Response) {
  const animals: AnimalType[] = [...]; // Type-safe
  res.json(animals);
}
```

## Benefits

### 1. Single Source of Truth
Types are defined once in `packages/shared` and used everywhere. No duplication.

### 2. Type Consistency
The API and web app always agree on what an `Animal`, `Cat`, or `Dog` looks like.

### 3. Refactoring Safety
When you change a type in `packages/shared`, TypeScript immediately shows you all places that need updating:

```typescript
// Add a new field to Cat in packages/shared/src/types.ts
interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
  favoriteFood: string; // NEW FIELD
}

// TypeScript will error in both apps until you handle the new field
```

### 4. IDE Support
Full autocomplete and IntelliSense for shared types across all apps.

## Development Workflow

### When Making Type Changes

1. Edit `packages/shared/src/types.ts`
2. Rebuild the shared package:
   ```bash
   pnpm --filter @hello-typescript/shared build
   ```
3. Fix any TypeScript errors in apps that use the changed types
4. Test your changes

### Watch Mode (Recommended)

Run the shared package in watch mode during development:

```bash
# Terminal 1: Watch shared types (auto-rebuild on changes)
pnpm --filter @hello-typescript/shared dev

# Terminal 2: Run the API
pnpm --filter @hello-typescript/api dev

# Terminal 3: Run the web app
pnpm --filter @hello-typescript/web dev
```

## Verification

Everything builds and tests successfully:

```bash
$ pnpm build
✓ packages/shared built
✓ apps/api built
✓ apps/web built

$ pnpm test
✓ All 17 tests pass

$ pnpm check
✓ No lint or format errors
```

## Documentation

Comprehensive documentation has been created:

1. **[USING_SHARED_TYPES.md](./USING_SHARED_TYPES.md)** - Complete guide to using shared types
2. **[packages/shared/README.md](./packages/shared/README.md)** - Package reference
3. **[packages/shared/EXAMPLES.md](./packages/shared/EXAMPLES.md)** - Practical code examples

## Current Shared Types

### Animal Types (in `packages/shared/src/types.ts`)

```typescript
export interface Animal {
  name: string;
  age: number;
  type: "cat" | "dog";
}

export interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
}

export interface Dog extends Animal {
  type: "dog";
  breed: string;
}

export type AnimalType = Cat | Dog;
```

## Adding New Shared Types

1. Edit `packages/shared/src/types.ts`:
   ```typescript
   export interface User {
     id: string;
     email: string;
     name: string;
   }
   ```

2. Rebuild:
   ```bash
   pnpm --filter @hello-typescript/shared build
   ```

3. Import and use:
   ```typescript
   import type { User } from "@hello-typescript/shared";
   
   const user: User = {
     id: "123",
     email: "user@example.com",
     name: "John Doe",
   };
   ```

## Best Practices

1. **Keep types pure** - Only type definitions, no business logic
2. **Use discriminated unions** - Like the `Animal` type with its `type` field
3. **Document complex types** - Add JSDoc comments
4. **Rebuild after changes** - Run `pnpm build` before committing
5. **Let TypeScript guide you** - Type errors show what needs updating

## Quick Reference

```bash
# Build shared package
pnpm --filter @hello-typescript/shared build

# Watch shared package
pnpm --filter @hello-typescript/shared dev

# Build everything
pnpm build

# Run tests
pnpm test

# Check code quality
pnpm check
```

## Next Steps

As your monorepo grows, you can add more shared types:
- User authentication types
- API request/response types
- Configuration types
- Utility types
- Validation schemas

The pattern is always the same:
1. Define in `packages/shared`
2. Build the package
3. Import in your apps
4. Enjoy type safety! 🎉
