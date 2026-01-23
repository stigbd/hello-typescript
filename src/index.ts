import express, { type Request, type Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { type Animal, AnimalSchema } from "./models/animal";
import { animals } from "./store/animals";

const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Animals API",
			version: "1.0.0",
			description: "API for managing animals (cats and dogs)",
		},
	},
	apis: ["./src/index.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app: express.Express = express();
const _port = 3000;

app.use(express.json());

// Serve OpenAPI docs at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req: Request, res: Response) => {
	res.status(200).send("Hello, World!");
});

// GET /animals - list all animals
/**
 * @openapi
 * /animals:
 *   get:
 *     summary: List all animals
 *     responses:
 *       200:
 *         description: A list of animals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - $ref: '#/components/schemas/Cat'
 *                   - $ref: '#/components/schemas/Dog'
 */
app.get("/animals", (_req: Request, res: Response) => {
	res.json(animals);
});

// GET /animals/:name - get animal by name
/**
 * @openapi
 * /animals/{name}:
 *   get:
 *     summary: Get animal by name
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the animal
 *     responses:
 *       200:
 *         description: Animal found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Cat'
 *                 - $ref: '#/components/schemas/Dog'
 *       404:
 *         description: Animal not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Animal not found
 */
app.get("/animals/:name", (req: Request, res: Response) => {
	const name = req.params.name;
	const animal = animals.find((a) => a.name === name);
	if (animal) {
		res.json(animal);
	} else {
		res.status(404).json({ error: "Animal not found" });
	}
});

// POST /animals - add a new animal (expects type: 'cat' or 'dog')
/**
 * @openapi
 * /animals:
 *   post:
 *     summary: Add a new animal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/Cat'
 *               - $ref: '#/components/schemas/Dog'
 *     responses:
 *       201:
 *         description: Animal created. Location header contains the URI of the new animal. No response body.
 *         headers:
 *           Location:
 *             description: URI of the newly created animal
 *             schema:
 *               type: string
 *         content: {}
 *       400:
 *         description: Invalid animal data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid animal data
 */
app.post("/animals", (req: Request, res: Response) => {
	// Validate the entire animal object using Zod
	const result = AnimalSchema.safeParse(req.body);

	if (!result.success) {
		// Return detailed validation errors
		return res.status(400).json({
			error: "Invalid animal data",
			details: result.error.format(),
		});
	}

	const newAnimal: Animal = result.data;
	animals.push(newAnimal);
	res.status(201).location(`/animals/${newAnimal.name}`).send();
});

/**
 * @openapi
 * components:
 *   schemas:
 *     Cat:
 *       type: object
 *       required:
 *         - type
 *         - name
 *         - age
 *         - livesLeft
 *       properties:
 *         type:
 *           type: string
 *           enum: [cat]
 *         name:
 *           type: string
 *         age:
 *           type: number
 *         livesLeft:
 *           type: number
 *           minimum: 0
 *           maximum: 9
 *     Dog:
 *       type: object
 *       required:
 *         - type
 *         - name
 *         - age
 *         - breed
 *       properties:
 *         type:
 *           type: string
 *           enum: [dog]
 *         name:
 *           type: string
 *         age:
 *           type: number
 *         breed:
 *           type: string
 */

export default app;
