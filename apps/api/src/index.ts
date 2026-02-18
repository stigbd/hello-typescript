import express, { type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";
import { type Animal, AnimalSchema } from "./models/animal";
import { generateOpenAPIDocument } from "./openapi";
import { animals } from "./store/animals";

const app: express.Express = express();
const _port = 3000;

app.use(express.json());

// Generate OpenAPI spec from Zod schemas
const openApiSpec = generateOpenAPIDocument();

// Serve OpenAPI docs at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Hello, World!");
});

app.get("/animals", (_req: Request, res: Response) => {
  res.json(animals);
});

app.get("/animals/:name", (req: Request, res: Response) => {
  const name = req.params.name;
  const animal = animals.find((a) => a.name === name);
  if (animal) {
    res.json(animal);
  } else {
    res.status(404).json({ error: "Animal not found" });
  }
});

app.post("/animals", (req: Request, res: Response) => {
  // Validate the entire animal object using Zod
  const result = AnimalSchema.safeParse(req.body);

  if (!result.success) {
    // Return detailed validation errors using z.treeifyError
    return res.status(400).json({
      error: "Invalid animal data",
      details: z.treeifyError(result.error),
    });
  }

  const newAnimal: Animal = result.data;
  animals.push(newAnimal);
  res.status(201).location(`/animals/${newAnimal.name}`).send();
});

export default app;
