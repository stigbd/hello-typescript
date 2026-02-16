import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Extend Zod with OpenAPI capabilities
extendZodWithOpenApi(z);

/**
 * Zod schemas with OpenAPI metadata
 */

// Cat schema with discriminator and OpenAPI metadata
export const CatSchema = z
	.object({
		type: z.literal("cat"),
		name: z.string().min(1, "Name is required"),
		age: z.number().int().positive("Age must be a positive integer"),
		livesLeft: z
			.number()
			.int()
			.min(0, "Lives left cannot be negative")
			.max(9, "Cats have a maximum of 9 lives"),
	})
	.openapi("Cat", {
		description: "A cat animal",
		example: {
			type: "cat",
			name: "Nero",
			age: 2,
			livesLeft: 9,
		},
	});

// Dog schema with discriminator and OpenAPI metadata
export const DogSchema = z
	.object({
		type: z.literal("dog"),
		name: z.string().min(1, "Name is required"),
		age: z.number().int().positive("Age must be a positive integer"),
		breed: z.string().min(1, "Breed is required"),
	})
	.openapi("Dog", {
		description: "A dog animal",
		example: {
			type: "dog",
			name: "Buddy",
			age: 5,
			breed: "Labrador",
		},
	});

// Discriminated union schema for all animals
export const AnimalSchema = z
	.discriminatedUnion("type", [CatSchema, DogSchema])
	.openapi("Animal", {
		description: "An animal (cat or dog)",
	});

// Input schemas (without the type discriminator) for creating animals
export const CreateCatSchema = CatSchema.omit({ type: true }).openapi(
	"CreateCat",
	{
		description: "Data required to create a cat",
	},
);

export const CreateDogSchema = DogSchema.omit({ type: true }).openapi(
	"CreateDog",
	{
		description: "Data required to create a dog",
	},
);

// Error response schema
export const ErrorResponseSchema = z
	.object({
		error: z.string(),
		details: z.any().optional(),
	})
	.openapi("ErrorResponse", {
		description: "Error response",
		example: {
			error: "Invalid animal data",
			details: {
				name: {
					_errors: ["Name is required"],
				},
			},
		},
	});

// Not found response schema
export const NotFoundResponseSchema = z
	.object({
		error: z.string(),
	})
	.openapi("NotFoundResponse", {
		description: "Resource not found",
		example: {
			error: "Animal not found",
		},
	});

/**
 * TypeScript types inferred from Zod schemas
 * These are automatically kept in sync with the schemas
 */
export type Cat = z.infer<typeof CatSchema>;
export type Dog = z.infer<typeof DogSchema>;
export type Animal = z.infer<typeof AnimalSchema>;
export type CreateCat = z.infer<typeof CreateCatSchema>;
export type CreateDog = z.infer<typeof CreateDogSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type NotFoundResponse = z.infer<typeof NotFoundResponseSchema>;

/**
 * Type guards for runtime type checking
 */
export function isCat(animal: Animal): animal is Cat {
	return animal.type === "cat";
}

export function isDog(animal: Animal): animal is Dog {
	return animal.type === "dog";
}
