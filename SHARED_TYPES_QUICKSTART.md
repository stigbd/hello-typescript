# Shared Types Quick Start Guide

Get started with shared types in 5 minutes!

## TL;DR

```typescript
// 1. Import shared types in your app
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";

// 2. Use them!
const cat: Cat = {
  type: "cat",
  name: "Whiskers",
  age: 3,
  livesLeft: 9,
};
```

## Step-by-Step Example

### 1. Check Available Types

Current types in `packages/shared/src/types.ts`:

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

### 2. Build the Shared Package

**First time only:**
```bash
pnpm --filter @hello-typescript/shared build
```

Or build everything:
```bash
pnpm build
```

### 3. Import in Your Code

#### In React (apps/web)

```typescript
import type { AnimalType } from "@hello-typescript/shared";
import { useState } from "react";

function MyComponent() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  
  return (
    <div>
      {animals.map((animal) => (
        <div key={animal.name}>
          {animal.name} - {animal.age} years old
        </div>
      ))}
    </div>
  );
}
```

#### In Express API (apps/api)

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
import { Request, Response } from "express";

function getAnimals(req: Request, res: Response) {
  const animals: AnimalType[] = [
    { type: "cat", name: "Whiskers", age: 3, livesLeft: 9 },
    { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
  ];
  
  res.json(animals);
}
```

### 4. Type Narrowing with Discriminated Unions

```typescript
import type { AnimalType } from "@hello-typescript/shared";

function describeAnimal(animal: AnimalType): string {
  // TypeScript automatically narrows the type
  if (animal.type === "cat") {
    // animal is Cat here
    return `Cat with ${animal.livesLeft} lives`;
  } else {
    // animal is Dog here
    return `${animal.breed} dog`;
  }
}
```

## Adding Your Own Types

### 1. Edit `packages/shared/src/types.ts`

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
}
```

### 2. Rebuild

```bash
pnpm --filter @hello-typescript/shared build
```

### 3. Import and Use

```typescript
import type { User } from "@hello-typescript/shared";

const user: User = {
  id: "123",
  email: "user@example.com",
  name: "John Doe",
};
```

## Development Tips

### Watch Mode

Run this in a terminal to auto-rebuild on changes:

```bash
pnpm --filter @hello-typescript/shared dev
```

### Full Development Setup

```bash
# Terminal 1: Watch shared types
pnpm --filter @hello-typescript/shared dev

# Terminal 2: Run API
pnpm --filter @hello-typescript/api dev

# Terminal 3: Run web app
pnpm --filter @hello-typescript/web dev
```

### Before Committing

Always run:
```bash
pnpm build   # Build everything
pnpm test    # Run all tests
pnpm check   # Lint and format
```

## Common Patterns

### Arrays

```typescript
import type { AnimalType, Cat } from "@hello-typescript/shared";

const animals: AnimalType[] = [/* ... */];
const cats: Cat[] = animals.filter((a): a is Cat => a.type === "cat");
```

### Optional Fields

```typescript
import type { Cat } from "@hello-typescript/shared";

type UpdateCat = Partial<Cat>; // All fields optional

function updateCat(name: string, updates: UpdateCat) {
  // Updates can have any Cat fields
}
```

### Function Parameters

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

// Accept specific type
function feedCat(cat: Cat): void {
  console.log(`Feeding ${cat.name}`);
}

// Accept any animal
function celebrate(animal: AnimalType): void {
  console.log(`Happy birthday ${animal.name}!`);
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
  return <div onClick={() => onSelect?.(animal.name)}>{animal.name}</div>;
}
```

## Troubleshooting

### "Cannot find module '@hello-typescript/shared'"

**Fix:** Build the shared package first
```bash
pnpm --filter @hello-typescript/shared build
```

### Types are outdated after changes

**Fix:** Rebuild
```bash
pnpm build
```

### Import not working

**Check:**
1. Is `@hello-typescript/shared` in your `package.json`?
2. Has the package been built? (Check `packages/shared/dist/`)
3. Are you using the correct import path?

## Real-World Example

Here's how it all works together:

```typescript
// ============================================
// packages/shared/src/types.ts
// ============================================
export interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
}

// ============================================
// apps/api/src/routes/cats.ts
// ============================================
import type { Cat } from "@hello-typescript/shared";

function createCat(req: Request, res: Response) {
  const cat: Cat = req.body;
  // Save to database...
  res.status(201).json(cat);
}

// ============================================
// apps/web/src/CatCard.tsx
// ============================================
import type { Cat } from "@hello-typescript/shared";

interface Props {
  cat: Cat;
}

function CatCard({ cat }: Props) {
  return (
    <div>
      <h3>{cat.name}</h3>
      <p>Lives: {cat.livesLeft}</p>
    </div>
  );
}
```

**Result:** API and Web app share the exact same `Cat` type!

## Quick Reference

```bash
# Build shared package
pnpm --filter @hello-typescript/shared build

# Watch mode (auto-rebuild)
pnpm --filter @hello-typescript/shared dev

# Build everything
pnpm build

# Run tests
pnpm test

# Check quality
pnpm check
```

## Learn More

- [Complete Guide](./USING_SHARED_TYPES.md) - Detailed documentation
- [Examples](./packages/shared/EXAMPLES.md) - More code examples
- [Package README](./packages/shared/README.md) - Package reference

---

**You're all set!** Start using shared types across your monorepo. 🎉
