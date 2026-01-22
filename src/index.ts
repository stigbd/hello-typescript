import express, { Request, Response } from 'express';
import { Animal } from './models/Animal';
import { Cat } from './models/Cat';
import { Dog } from './models/Dog';

const app = express();
const port = 3000;

app.use(express.json());

// In-memory storage for animals
type AnimalWithType = (Cat & { type: 'cat' }) | (Dog & { type: 'dog' });

let animals: AnimalWithType[] = [
  { type: "cat", name: "Whiskers", age: 3, livesLeft: 7, speak: () => "Meow" },
  { type: "dog", name: "Buddy", age: 5, breed: "Labrador", speak: () => "Woof" },
];

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, World!');
});

// GET /animals - list all animals
app.get('/animals', (req: Request, res: Response) => {
  // Remove the speak function from the response for serialization
  const animalsWithoutSpeak = animals.map(a => {
    const { speak, ...rest } = a;
    return rest;
  });
  res.json(animalsWithoutSpeak);
});

// GET /animals/:name - get animal by name
app.get('/animals/:name', (req: Request, res: Response) => {
  const name = req.params.name;
  const animal = animals.find(a => a.name === name);
  if (animal) {
    const { speak, ...rest } = animal;
    res.json(rest);
  } else {
    res.status(404).json({ error: "Animal not found" });
  }
});

// POST /animals - add a new animal (expects type: 'cat' or 'dog')
app.post('/animals', (req: Request, res: Response) => {
  const { type, ...data } = req.body;

  let newAnimal: AnimalWithType | null = null;

  if (type === 'cat') {
    if (typeof data.name === 'string' && typeof data.age === 'number' && typeof data.livesLeft === 'number') {
      newAnimal = {
        type: 'cat',
        ...data,
        speak: () => "Meow"
      };
    }
  } else if (type === 'dog') {
    if (typeof data.name === 'string' && typeof data.age === 'number' && typeof data.breed === 'string') {
      newAnimal = {
        type: 'dog',
        ...data,
        speak: () => "Woof"
      };
    }
  }

  if (newAnimal) {
    animals.push(newAnimal);
    // Remove speak function before sending response
    const { speak, ...rest } = newAnimal;
    res.status(201).json(rest);
  } else {
    res.status(400).json({ error: "Invalid animal data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
