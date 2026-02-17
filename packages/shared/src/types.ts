export interface Animal {
  name: string;
  age: number;
  type: "cat" | "dog";
}

export interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
}

export interface Dog extends Animal {
  type: "dog";
  breed: string;
}

export type AnimalType = Cat | Dog;
