# @hello-typescript/shared

Shared TypeScript types and interfaces for the hello-typescript monorepo.

## Overview

This package contains type definitions that are shared across multiple applications in the monorepo, ensuring type consistency and preventing duplication.

## Installation

This package is automatically available to other workspace packages. To add it to a new app:

```bash
pnpm add @hello-typescript/shared --filter @hello-typescript/your-app --workspace
```

## Usage

### Basic Import

```typescript
import type { Animal, Cat, Dog, AnimalType } from "@hello-typescript/shared";
```

### Example

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

// Create a cat
const cat: Cat = {
  type: "cat",
  name: "Whiskers",
  age: 3,
  livesLeft: 9,
};

// Create a dog
const dog: Dog = {
  type: "dog",
  name: "Buddy",
  age: 5,
  breed: "Labrador",
};

// Use union type
const animals: AnimalType[] = [cat, dog];

// Type narrowing with discriminated union
animals.forEach((animal) => {
  if (animal.type === "cat") {
    console.log(`${animal.name} has ${animal.livesLeft} lives`);
  } else {
    console.log(`${animal.name} is a ${animal.breed}`);
  }
});
```

## Available Types

### `Animal`

Base interface for all animals.

```typescript
interface Animal {
  name: string;
  age: number;
  type: "cat" | "dog";
}
```

### `Cat`

Cat-specific interface with discriminator.

```typescript
interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
}
```

### `Dog`

Dog-specific interface with discriminator.

```typescript
interface Dog extends Animal {
  type: "dog";
  breed: string;
}
```

### `AnimalType`

Discriminated union of all animal types.

```typescript
type AnimalType = Cat | Dog;
```

## Development

### Build

Compile TypeScript and generate type declarations:

```bash
pnpm build
```

### Watch Mode

Automatically rebuild on changes:

```bash
pnpm dev
```

## Package Structure

```
packages/shared/
├── src/
│   ├── index.ts      # Main entry point
│   └── types.ts      # Type definitions
├── dist/             # Compiled output (generated)
│   ├── index.js
│   ├── index.d.ts
│   └── ...
├── package.json
├── tsconfig.json
├── README.md         # This file
└── EXAMPLES.md       # Detailed usage examples
```

## Adding New Types

1. Add your type definition to `src/types.ts`:

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
}
```

2. Rebuild the package:

```bash
pnpm build
```

3. Import and use in your apps:

```typescript
import type { User } from "@hello-typescript/shared";
```

## Type Safety Benefits

- **Single source of truth**: Types defined once, used everywhere
- **Compile-time checking**: TypeScript ensures consistency across apps
- **Refactoring safety**: Changes show you exactly what needs updating
- **IDE support**: Full autocomplete and IntelliSense

## Documentation

- [Using Shared Types Guide](../USING_SHARED_TYPES.md) - Complete guide
- [Usage Examples](./EXAMPLES.md) - Practical code examples

## Best Practices

1. Keep types pure (no business logic)
2. Use discriminated unions for variants
3. Document complex types with JSDoc
4. Rebuild after making changes
5. Run `pnpm build` from root before committing

## Integration with Apps

### In the API (`apps/api`)

The API uses these shared types alongside Zod schemas for runtime validation:

```typescript
import type { Cat } from "@hello-typescript/shared";
import { z } from "zod";

const CatSchema = z.object({
  type: z.literal("cat"),
  name: z.string(),
  age: z.number(),
  livesLeft: z.number(),
});

type ValidatedCat = z.infer<typeof CatSchema>; // Compatible with Cat
```

### In the Web App (`apps/web`)

The web app uses shared types for React state and props:

```typescript
import type { AnimalType } from "@hello-typescript/shared";
import { useState } from "react";

function App() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  // Full type safety in your React components
}
```

## Troubleshooting

### Cannot find module '@hello-typescript/shared'

Build the package first:

```bash
pnpm --filter @hello-typescript/shared build
```

### Types are outdated

Rebuild after making changes:

```bash
pnpm build
```

### Import errors

Ensure the package is in your `package.json` dependencies and has been built.

## License

Private package - not published to npm.
