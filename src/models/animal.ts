import { z } from "zod";

/**
 * Zod schemas define both runtime validation AND compile-time types
 */

// Cat schema with discriminator
export const CatSchema = z.object({
	type: z.literal("cat"),
	name: z.string().min(1, "Name is required"),
	age: z.number().int().positive("Age must be a positive integer"),
	livesLeft: z
		.number()
		.int()
		.min(0, "Lives left cannot be negative")
		.max(9, "Cats have a maximum of 9 lives"),
});

// Dog schema with discriminator
export const DogSchema = z.object({
	type: z.literal("dog"),
	name: z.string().min(1, "Name is required"),
	age: z.number().int().positive("Age must be a positive integer"),
	breed: z.string().min(1, "Breed is required"),
});

// Discriminated union schema for all animals
export const AnimalSchema = z.discriminatedUnion("type", [
	CatSchema,
	DogSchema,
]);

// Input schemas (without the type discriminator) for creating animals
export const CreateCatSchema = CatSchema.omit({ type: true });
export const CreateDogSchema = DogSchema.omit({ type: true });

/**
 * TypeScript types inferred from Zod schemas
 * These are automatically kept in sync with the schemas
 */
export type Cat = z.infer<typeof CatSchema>;
export type Dog = z.infer<typeof DogSchema>;
export type Animal = z.infer<typeof AnimalSchema>;
export type CreateCat = z.infer<typeof CreateCatSchema>;
export type CreateDog = z.infer<typeof CreateDogSchema>;

/**
 * Type guards for runtime type checking
 */
export function isCat(animal: Animal): animal is Cat {
	return animal.type === "cat";
}

export function isDog(animal: Animal): animal is Dog {
	return animal.type === "dog";
}
