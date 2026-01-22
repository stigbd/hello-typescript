import { Animal } from "./Animal";

export interface Dog extends Omit<Animal, "speak"> {
  breed: string;
}