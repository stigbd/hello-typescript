import { Cat } from '../models/Cat';
import { Dog } from '../models/Dog';

// Type for animals with their specific type tag
export type AnimalWithType = (Cat & { type: 'cat' }) | (Dog & { type: 'dog' });

// In-memory storage for animals
export let animals: AnimalWithType[] = [
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