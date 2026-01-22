import express, { Request, Response } from 'express';
import { Animal } from './models/Animal';
import { Cat } from './models/Cat';
import { Dog } from './models/Dog';
import { animals, AnimalWithType } from './store/animals';

const app: express.Express = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello, World!');
});

// GET /animals - list all animals
app.get('/animals', (req: Request, res: Response) => {
  res.json(animals);
});

// GET /animals/:name - get animal by name
app.get('/animals/:name', (req: Request, res: Response) => {
  const name = req.params.name;
  const animal = animals.find(a => a.name === name);
  if (animal) {
    res.json(animal);
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
        ...data
      };
    }
  } else if (type === 'dog') {
    if (typeof data.name === 'string' && typeof data.age === 'number' && typeof data.breed === 'string') {
      newAnimal = {
        type: 'dog',
        ...data
      };
    }
  }

  if (newAnimal) {
    animals.push(newAnimal);
    res.status(201).json(newAnimal);
  } else {
    res.status(400).json({ error: "Invalid animal data" });
  }
});



export default app;
