# Shared Types Guide

This guide explains how to use shared types from `packages/shared` across your monorepo apps.

## Quick Start (5 Minutes)

### 1. Import Types

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
```

### 2. Use Them

```typescript
const cat: Cat = {
  type: "cat",
  name: "Whiskers",
  age: 3,
  livesLeft: 9,
};
```

### 3. Build First (If Needed)

```bash
pnpm --filter @hello-typescript/shared build
```

That's it! Now read on for details.

---

## Table of Contents

- [Overview](#overview)
- [Available Types](#available-types)
- [How It Works](#how-it-works)
- [Using in Apps](#using-in-apps)
- [Development Workflow](#development-workflow)
- [Adding New Types](#adding-new-types)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The `@hello-typescript/shared` package contains TypeScript types used across multiple apps in the monorepo. This ensures:

✅ **Type consistency** - API and web app always agree on data shapes  
✅ **Single source of truth** - Define types once, use everywhere  
✅ **Refactoring safety** - Change propagates to all consumers  
✅ **No duplication** - Share common types across packages  

### Package Structure

```
packages/shared/
├── src/
│   ├── index.ts      # Exports all types
│   └── types.ts      # Type definitions
├── dist/             # Compiled output (.d.ts files)
├── package.json
└── tsconfig.json
```

## Available Types

All types are defined in `packages/shared/src/types.ts`:

### Animal (Base Interface)

```typescript
export interface Animal {
  name: string;
  age: number;
  type: "cat" | "dog";
}
```

### Cat (Extends Animal)

```typescript
export interface Cat extends Animal {
  type: "cat";
  livesLeft: number;  // 0-9
}
```

### Dog (Extends Animal)

```typescript
export interface Dog extends Animal {
  type: "dog";
  breed: string;
}
```

### AnimalType (Discriminated Union)

```typescript
export type AnimalType = Cat | Dog;
```

This is a **discriminated union** - TypeScript can narrow the type based on the `type` field:

```typescript
function describeAnimal(animal: AnimalType) {
  if (animal.type === "cat") {
    // TypeScript knows this is a Cat
    console.log(`Lives left: ${animal.livesLeft}`);
  } else {
    // TypeScript knows this is a Dog
    console.log(`Breed: ${animal.breed}`);
  }
}
```

## How It Works

### Build Process

The shared package must be built before use:

```bash
# Build shared package only
pnpm --filter @hello-typescript/shared build

# Or build everything (automatically builds in correct order)
pnpm build
```

**What happens:**
1. TypeScript compiles `src/types.ts` → `dist/types.js`
2. Type declarations are generated → `dist/types.d.ts`
3. Source maps are created for debugging

### Dependency Flow

```
packages/shared/src/types.ts
  └─> Compiled to dist/types.d.ts
      ├─> Imported by apps/web/src/App.tsx
      └─> Imported by apps/api/src/models/animal.ts
```

### Workspace Dependencies

Both apps reference the shared package in their `package.json`:

```json
{
  "dependencies": {
    "@hello-typescript/shared": "workspace:*"
  }
}
```

The `workspace:*` protocol tells pnpm to use the local package.

## Using in Apps

### In React (apps/web)

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
import { useState } from "react";

function App() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  
  const addCat = (name: string, age: number, livesLeft: number) => {
    const cat: Cat = { type: "cat", name, age, livesLeft };
    setAnimals([...animals, cat]);
  };

  return (
    <div>
      {animals.map((animal) => (
        <div key={animal.name}>
          <h3>{animal.name}</h3>
          {animal.type === "cat" ? (
            <p>Lives: {animal.livesLeft}</p>
          ) : (
            <p>Breed: {animal.breed}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### In Express API (apps/api)

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
import { Request, Response } from "express";

// Type-safe storage
const animals: AnimalType[] = [];

// Type-safe endpoint
function getAnimals(req: Request, res: Response) {
  res.json(animals);
}

function addAnimal(req: Request, res: Response) {
  const animal: AnimalType = req.body;
  animals.push(animal);
  res.status(201).json(animal);
}
```

### Integration with Runtime Validation

In the API, we combine shared types with Zod for runtime validation:

```typescript
// apps/api/src/models/animal.ts
import type { Cat as SharedCat } from "@hello-typescript/shared";
import { z } from "zod";

// Zod schema for runtime validation
export const CatSchema = z.object({
  type: z.literal("cat"),
  name: z.string().min(1),
  age: z.number().int().positive(),
  livesLeft: z.number().int().min(0).max(9),
});

// Inferred type from Zod (compatible with SharedCat)
export type Cat = z.infer<typeof CatSchema>;

// Re-export shared type for reference
export type { SharedCat };
```

**Benefits:**
- Runtime validation with Zod
- Compile-time type checking with shared types
- Type consistency across frontend and backend

## Development Workflow

### Option 1: Build Once

Build the shared package before starting development:

```bash
pnpm --filter @hello-typescript/shared build
pnpm dev
```

Rebuild when you change types:

```bash
pnpm --filter @hello-typescript/shared build
```

### Option 2: Watch Mode (Recommended)

Run the shared package in watch mode for auto-rebuild:

```bash
# Terminal 1: Watch shared types (auto-rebuild on changes)
pnpm --filter @hello-typescript/shared dev

# Terminal 2: Run API
pnpm --filter @hello-typescript/api dev

# Terminal 3: Run web app
pnpm --filter @hello-typescript/web dev
```

### Before Committing

Always run these checks:

```bash
pnpm build    # Build everything
pnpm test     # Run all tests
pnpm check    # Lint and format
```

## Adding New Types

### Step 1: Define the Type

Edit `packages/shared/src/types.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}
```

### Step 2: Rebuild

```bash
pnpm --filter @hello-typescript/shared build
```

### Step 3: Import and Use

```typescript
import type { User } from "@hello-typescript/shared";

const user: User = {
  id: "123",
  email: "user@example.com",
  name: "John Doe",
  role: "user",
};
```

### Adding to a New App

If you create a new app, add the shared package as a dependency:

```bash
pnpm add @hello-typescript/shared --filter @hello-typescript/your-new-app --workspace
```

## Best Practices

### DO ✅

1. **Keep types pure** - Only type definitions, no business logic
2. **Use discriminated unions** - Enables type narrowing
3. **Document complex types** - Add JSDoc comments
4. **Rebuild after changes** - Always rebuild before testing
5. **Version carefully** - Changes affect all apps
6. **Use optional fields** - Easier to extend without breaking changes

```typescript
// ✓ Good: Discriminated union
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

// ✓ Good: Optional field for backward compatibility
interface User {
  id: string;
  email: string;
  phoneNumber?: string;  // New optional field
}
```

### DON'T ❌

1. **Don't add runtime code** - Keep it types-only
2. **Don't include framework-specific code** - Stay generic
3. **Don't make breaking changes lightly** - Affects all apps
4. **Don't use string unions for complex types** - Use discriminated unions

```typescript
// ✗ Avoid: Makes type narrowing difficult
interface Animal {
  type: string;
  livesLeft?: number;
  breed?: string;
}

// ✓ Better: Discriminated union
type Animal = Cat | Dog;
```

## Common Patterns

### Arrays

```typescript
import type { AnimalType, Cat } from "@hello-typescript/shared";

const animals: AnimalType[] = [/* ... */];

// Type narrowing with type guards
const cats: Cat[] = animals.filter((a): a is Cat => a.type === "cat");
```

### Partial Updates

```typescript
import type { Cat } from "@hello-typescript/shared";

// All fields optional
type UpdateCat = Partial<Cat>;

function updateCat(name: string, updates: UpdateCat) {
  // Updates can have any Cat fields
}
```

### React Props

```typescript
import type { AnimalType } from "@hello-typescript/shared";

interface AnimalCardProps {
  animal: AnimalType;
  onSelect?: (name: string) => void;
}

function AnimalCard({ animal, onSelect }: AnimalCardProps) {
  return (
    <div onClick={() => onSelect?.(animal.name)}>
      <h3>{animal.name}</h3>
      <p>Age: {animal.age}</p>
    </div>
  );
}
```

### API Response Types

```typescript
import type { AnimalType } from "@hello-typescript/shared";

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

type AnimalsResponse = ApiResponse<AnimalType[]>;

async function fetchAnimals(): Promise<AnimalsResponse> {
  const response = await fetch("/api/animals");
  return response.json();
}
```

## Troubleshooting

### "Cannot find module '@hello-typescript/shared'"

**Cause:** Shared package not built or not installed

**Fix:**
```bash
# Build the shared package
pnpm --filter @hello-typescript/shared build

# Or reinstall dependencies
pnpm install
```

### Types Are Outdated

**Cause:** Shared package not rebuilt after changes

**Fix:**
```bash
pnpm --filter @hello-typescript/shared build

# Or rebuild everything
pnpm build
```

### Import Path Not Resolving

**Cause:** Missing dependency or wrong package name

**Fix:**
1. Check `package.json` has `@hello-typescript/shared` in dependencies
2. Verify you're using the correct import path
3. Check that `dist/` folder exists in `packages/shared/`
4. Restart your editor's TypeScript server

### Type Errors After Updating

**Cause:** Shared types changed - this is expected!

**Fix:** Update your code to match the new type structure. TypeScript shows you exactly what needs fixing.

### Build Errors

**Cause:** TypeScript configuration or syntax errors

**Fix:**
```bash
# Check for syntax errors
cd packages/shared
pnpm build

# Clear build cache
rm -rf dist *.tsbuildinfo
pnpm build
```

## Quick Reference

### Commands

```bash
# Build shared package
pnpm --filter @hello-typescript/shared build

# Watch mode (auto-rebuild)
pnpm --filter @hello-typescript/shared dev

# Build everything
pnpm build

# Run tests
pnpm test

# Check code quality
pnpm check
```

### Import Syntax

```typescript
// Import specific types
import type { Animal, Cat, Dog } from "@hello-typescript/shared";

// Import type alias
import type { AnimalType } from "@hello-typescript/shared";

// Import everything
import type * as SharedTypes from "@hello-typescript/shared";
```

### Type Narrowing

```typescript
import type { AnimalType } from "@hello-typescript/shared";

function handle(animal: AnimalType) {
  if (animal.type === "cat") {
    // animal is Cat here
    console.log(animal.livesLeft);
  } else {
    // animal is Dog here
    console.log(animal.breed);
  }
}
```

## Related Documentation

- [Monorepo Setup Guide](./MONOREPO_SETUP.md) - Workspace configuration and workflow
- [Architecture Overview](./ARCHITECTURE.md) - System design and patterns
- [Apps vs Packages](./APPS_VS_PACKAGES.md) - Understanding the monorepo structure

---

**You're all set!** Start using shared types across your monorepo. 🎉
