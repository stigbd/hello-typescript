import type { Animal } from "../models/animal";

// In-memory storage for animals
export let animals: Animal[] = [
  { type: "cat", name: "Whiskers", age: 3, livesLeft: 7 },
  { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
];

// Utility to reset the animals array (for testing)
export function resetAnimals() {
  animals = [
    { type: "cat", name: "Whiskers", age: 3, livesLeft: 7 },
    { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
  ];
}
