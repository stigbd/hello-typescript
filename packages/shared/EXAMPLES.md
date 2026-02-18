# Shared Types Usage Examples

This file contains practical examples of how to use the shared types from `@hello-typescript/shared`.

## Table of Contents

1. [Basic Type Usage](#basic-type-usage)
2. [Type Guards and Narrowing](#type-guards-and-narrowing)
3. [Working with Arrays](#working-with-arrays)
4. [Function Signatures](#function-signatures)
5. [React Components](#react-components)
6. [API Handlers](#api-handlers)
7. [Type Utilities](#type-utilities)

---

## Basic Type Usage

### Creating Animal Objects

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

// Create a cat
const myCat: Cat = {
  type: "cat",
  name: "Whiskers",
  age: 3,
  livesLeft: 9,
};

// Create a dog
const myDog: Dog = {
  type: "dog",
  name: "Buddy",
  age: 5,
  breed: "Golden Retriever",
};

// Use the union type
const someAnimal: AnimalType = Math.random() > 0.5 ? myCat : myDog;
```

---

## Type Guards and Narrowing

### Using Discriminated Unions

```typescript
import type { AnimalType } from "@hello-typescript/shared";

function describeAnimal(animal: AnimalType): string {
  // TypeScript narrows the type based on the discriminator
  if (animal.type === "cat") {
    // animal is now known to be Cat
    return `${animal.name} is a cat with ${animal.livesLeft} lives left`;
  } else {
    // animal is now known to be Dog
    return `${animal.name} is a ${animal.breed}`;
  }
}
```

### Custom Type Guards

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

// Type guard for cats
function isCat(animal: AnimalType): animal is Cat {
  return animal.type === "cat";
}

// Type guard for dogs
function isDog(animal: AnimalType): animal is Dog {
  return animal.type === "dog";
}

// Usage
function handleAnimal(animal: AnimalType) {
  if (isCat(animal)) {
    console.log(`Lives left: ${animal.livesLeft}`);
  } else if (isDog(animal)) {
    console.log(`Breed: ${animal.breed}`);
  }
}
```

---

## Working with Arrays

### Filtering Animals

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

const animals: AnimalType[] = [
  { type: "cat", name: "Whiskers", age: 3, livesLeft: 9 },
  { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
  { type: "cat", name: "Mittens", age: 2, livesLeft: 7 },
];

// Filter to get only cats
const cats: Cat[] = animals.filter((a): a is Cat => a.type === "cat");

// Filter to get only dogs
const dogs: Dog[] = animals.filter((a): a is Dog => a.type === "dog");

// Find specific animal
const whiskers = animals.find((a) => a.name === "Whiskers");
```

### Mapping and Transforming

```typescript
import type { AnimalType } from "@hello-typescript/shared";

const animals: AnimalType[] = [
  /* ... */
];

// Get all names
const names: string[] = animals.map((animal) => animal.name);

// Get ages by name
const ageMap: Record<string, number> = animals.reduce(
  (acc, animal) => {
    acc[animal.name] = animal.age;
    return acc;
  },
  {} as Record<string, number>,
);

// Group by type
const grouped: { cats: Cat[]; dogs: Dog[] } = animals.reduce(
  (acc, animal) => {
    if (animal.type === "cat") {
      acc.cats.push(animal);
    } else {
      acc.dogs.push(animal);
    }
    return acc;
  },
  { cats: [] as Cat[], dogs: [] as Dog[] },
);
```

---

## Function Signatures

### Functions Accepting Specific Types

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

// Function that only accepts cats
function feedCat(cat: Cat): void {
  console.log(`Feeding ${cat.name}, who has ${cat.livesLeft} lives left`);
}

// Function that only accepts dogs
function walkDog(dog: Dog): void {
  console.log(`Walking ${dog.name}, a ${dog.breed}`);
}

// Function that accepts any animal
function celebrate(animal: AnimalType): void {
  console.log(`Happy birthday ${animal.name}! You are ${animal.age} years old!`);
}
```

### Functions Returning Typed Results

```typescript
import type { Cat, Dog, AnimalType } from "@hello-typescript/shared";

// Return a specific type
function createCat(name: string, age: number, livesLeft: number): Cat {
  return {
    type: "cat",
    name,
    age,
    livesLeft,
  };
}

// Return a union type
function createAnimal(
  type: "cat" | "dog",
  name: string,
  age: number,
  extra: number | string,
): AnimalType {
  if (type === "cat") {
    return {
      type: "cat",
      name,
      age,
      livesLeft: extra as number,
    };
  } else {
    return {
      type: "dog",
      name,
      age,
      breed: extra as string,
    };
  }
}
```

### Generic Functions

```typescript
import type { AnimalType } from "@hello-typescript/shared";

// Generic function that works with arrays of animals
function findOldest<T extends AnimalType>(animals: T[]): T | undefined {
  if (animals.length === 0) return undefined;
  return animals.reduce((oldest, current) =>
    current.age > oldest.age ? current : oldest,
  );
}

// Usage
const oldestCat = findOldest(cats); // Type: Cat | undefined
const oldestDog = findOldest(dogs); // Type: Dog | undefined
```

---

## React Components

### Component Props with Shared Types

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
import React from "react";

// Component that displays any animal
interface AnimalCardProps {
  animal: AnimalType;
  onDelete?: (name: string) => void;
}

function AnimalCard({ animal, onDelete }: AnimalCardProps) {
  return (
    <div className="animal-card">
      <h3>{animal.name}</h3>
      <p>Age: {animal.age}</p>
      {animal.type === "cat" ? (
        <p>Lives: {animal.livesLeft}</p>
      ) : (
        <p>Breed: {animal.breed}</p>
      )}
      {onDelete && <button onClick={() => onDelete(animal.name)}>Delete</button>}
    </div>
  );
}

// Component specific to cats
interface CatCardProps {
  cat: Cat;
}

function CatCard({ cat }: CatCardProps) {
  return (
    <div className="cat-card">
      <h3>🐱 {cat.name}</h3>
      <p>Lives: {cat.livesLeft}/9</p>
    </div>
  );
}

// Component specific to dogs
interface DogCardProps {
  dog: Dog;
}

function DogCard({ dog }: DogCardProps) {
  return (
    <div className="dog-card">
      <h3>🐶 {dog.name}</h3>
      <p>Breed: {dog.breed}</p>
    </div>
  );
}
```

### State Management with Shared Types

```typescript
import type { AnimalType } from "@hello-typescript/shared";
import { useState } from "react";

function AnimalManager() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);

  const addAnimal = (animal: AnimalType) => {
    setAnimals((prev) => [...prev, animal]);
  };

  const removeAnimal = (name: string) => {
    setAnimals((prev) => prev.filter((a) => a.name !== name));
  };

  return (
    <div>
      {animals.map((animal) => (
        <div key={animal.name} onClick={() => setSelectedAnimal(animal)}>
          {animal.name}
        </div>
      ))}
    </div>
  );
}
```

---

## API Handlers

### Express Route Handlers

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";
import { Request, Response } from "express";

// GET handler returning typed data
function getAllAnimals(req: Request, res: Response) {
  const animals: AnimalType[] = [
    { type: "cat", name: "Whiskers", age: 3, livesLeft: 9 },
    { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
  ];

  res.json(animals);
}

// POST handler accepting typed data
function createAnimal(req: Request, res: Response) {
  const animal = req.body as AnimalType; // After validation

  // Process the animal
  if (animal.type === "cat") {
    console.log(`New cat with ${animal.livesLeft} lives`);
  } else {
    console.log(`New ${animal.breed} dog`);
  }

  res.status(201).json(animal);
}

// GET handler for specific type
function getCatById(req: Request, res: Response) {
  const cat: Cat = {
    type: "cat",
    name: "Whiskers",
    age: 3,
    livesLeft: 9,
  };

  res.json(cat);
}
```

### Service Layer Functions

```typescript
import type { AnimalType, Cat, Dog } from "@hello-typescript/shared";

// Service that manages animals
class AnimalService {
  private animals: AnimalType[] = [];

  addAnimal(animal: AnimalType): void {
    this.animals.push(animal);
  }

  getAnimalByName(name: string): AnimalType | undefined {
    return this.animals.find((a) => a.name === name);
  }

  getCats(): Cat[] {
    return this.animals.filter((a): a is Cat => a.type === "cat");
  }

  getDogs(): Dog[] {
    return this.animals.filter((a): a is Dog => a.type === "dog");
  }

  updateAnimalAge(name: string, newAge: number): boolean {
    const animal = this.getAnimalByName(name);
    if (animal) {
      animal.age = newAge;
      return true;
    }
    return false;
  }
}
```

---

## Type Utilities

### Partial Types

```typescript
import type { Cat, Dog } from "@hello-typescript/shared";

// Create types for updates (all fields optional)
type UpdateCat = Partial<Cat>;
type UpdateDog = Partial<Dog>;

// Usage in update functions
function updateCat(name: string, updates: UpdateCat): Cat {
  const cat = findCatByName(name);
  return { ...cat, ...updates };
}
```

### Pick and Omit

```typescript
import type { Cat, Dog } from "@hello-typescript/shared";

// Create a type with only certain fields
type CatSummary = Pick<Cat, "name" | "age">;

// Create a type without certain fields
type CatWithoutType = Omit<Cat, "type">;

// Usage
const summary: CatSummary = {
  name: "Whiskers",
  age: 3,
};

const catData: CatWithoutType = {
  name: "Whiskers",
  age: 3,
  livesLeft: 9,
};
```

### Custom Utility Types

```typescript
import type { AnimalType } from "@hello-typescript/shared";

// Extract just the name field from any animal
type AnimalName = AnimalType["name"];

// Create a type for animal IDs
type AnimalWithId = AnimalType & { id: string };

// Create a readonly version
type ReadonlyAnimal = Readonly<AnimalType>;

// Usage
const animalWithId: AnimalWithId = {
  id: "123",
  type: "cat",
  name: "Whiskers",
  age: 3,
  livesLeft: 9,
};
```

### Array and Record Types

```typescript
import type { AnimalType } from "@hello-typescript/shared";

// Map of animals by name
type AnimalMap = Record<string, AnimalType>;

// Lookup table by type
type AnimalsByType = {
  cat: Cat[];
  dog: Dog[];
};

// Usage
const animalMap: AnimalMap = {
  whiskers: { type: "cat", name: "Whiskers", age: 3, livesLeft: 9 },
  buddy: { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
};

const animalsByType: AnimalsByType = {
  cat: [{ type: "cat", name: "Whiskers", age: 3, livesLeft: 9 }],
  dog: [{ type: "dog", name: "Buddy", age: 5, breed: "Labrador" }],
};
```

---

## Best Practices Summary

1. **Always use type annotations** for function parameters and return types
2. **Leverage discriminated unions** for type narrowing
3. **Use type guards** for runtime type checking
4. **Keep shared types pure** - no business logic
5. **Document complex types** with JSDoc comments
6. **Use const assertions** when creating literal objects: `as const`
7. **Prefer specific types** over union types when possible
8. **Use utility types** (Pick, Omit, Partial) to derive new types

---

## Related Documentation

- [Using Shared Types Guide](./USING_SHARED_TYPES.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
