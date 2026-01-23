import type { Animal } from "./Animal";

export interface Cat extends Omit<Animal, "speak"> {
	livesLeft: number;
}
