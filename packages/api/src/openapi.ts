import {
	OpenAPIRegistry,
	OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
	AnimalSchema,
	CatSchema,
	DogSchema,
	ErrorResponseSchema,
	NotFoundResponseSchema,
} from "./models/animal";

// Create a registry for OpenAPI components
export const registry = new OpenAPIRegistry();

// Register schemas as components
registry.register("Cat", CatSchema);
registry.register("Dog", DogSchema);
registry.register("Animal", AnimalSchema);
registry.register("ErrorResponse", ErrorResponseSchema);
registry.register("NotFoundResponse", NotFoundResponseSchema);

// Register GET /animals endpoint
registry.registerPath({
	method: "get",
	path: "/animals",
	summary: "List all animals",
	tags: ["Animals"],
	responses: {
		200: {
			description: "A list of animals",
			content: {
				"application/json": {
					schema: {
						type: "array",
						items: {
							$ref: "#/components/schemas/Animal",
						},
					},
				},
			},
		},
	},
});

// Register GET /animals/:name endpoint
registry.registerPath({
	method: "get",
	path: "/animals/{name}",
	summary: "Get animal by name",
	tags: ["Animals"],
	request: {
		params: z.object({
			name: z.string().openapi({
				description: "Name of the animal",
				example: "Whiskers",
			}),
		}),
	},
	responses: {
		200: {
			description: "Animal found",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/Animal",
					},
				},
			},
		},
		404: {
			description: "Animal not found",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/NotFoundResponse",
					},
				},
			},
		},
	},
});

// Register POST /animals endpoint
registry.registerPath({
	method: "post",
	path: "/animals",
	summary: "Add a new animal",
	tags: ["Animals"],
	request: {
		body: {
			content: {
				"application/json": {
					schema: AnimalSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description:
				"Animal created. Location header contains the URI of the new animal.",
			headers: {
				Location: {
					description: "URI of the newly created animal",
					schema: {
						type: "string",
						example: "/animals/Fluffy",
					},
				},
			},
		},
		400: {
			description: "Invalid animal data",
			content: {
				"application/json": {
					schema: {
						$ref: "#/components/schemas/ErrorResponse",
					},
				},
			},
		},
	},
});

// Generate OpenAPI document
export function generateOpenAPIDocument(): ReturnType<
	OpenApiGeneratorV3["generateDocument"]
> {
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "Animals API",
			version: "1.0.0",
			description: "API for managing animals (cats and dogs)",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
	});
}
