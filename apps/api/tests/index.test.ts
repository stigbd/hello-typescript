import request from "supertest";
import app from "../src/index";
import { resetAnimals } from "../src/store/animals";

describe("API Endpoints", () => {
  // Reset animals before each test
  beforeEach(() => {
    resetAnimals();
  });

  describe("GET /", () => {
    it("should return Hello, World!", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.text).toBe("Hello, World!");
    });
  });

  describe("GET /animals", () => {
    it("should return a list of animals", async () => {
      const res = await request(app).get("/animals");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { type: "cat", name: "Whiskers", age: 3, livesLeft: 7 },
        { type: "dog", name: "Buddy", age: 5, breed: "Labrador" },
      ]);
    });
  });

  describe("GET /animals/:name", () => {
    it("should return an animal by name", async () => {
      const res = await request(app).get("/animals/Buddy");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        type: "dog",
        name: "Buddy",
        age: 5,
        breed: "Labrador",
      });
    });

    it("should return 404 if animal not found", async () => {
      const res = await request(app).get("/animals/NonExistent");
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "Animal not found" });
    });
  });

  describe("POST /animals", () => {
    it("should add a new cat", async () => {
      const newCat = { type: "cat", name: "NewCat", age: 1, livesLeft: 9 };
      const res = await request(app).post("/animals").send(newCat);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({});
      expect(res.header).toHaveProperty("location", "/animals/NewCat");
      // Verify the animal was added
      const getRes = await request(app).get("/animals/NewCat");
      expect(getRes.body).toEqual({
        type: "cat",
        name: "NewCat",
        age: 1,
        livesLeft: 9,
      });
    });

    it("should add a new dog", async () => {
      const newDog = { type: "dog", name: "NewDog", age: 2, breed: "Poodle" };
      const res = await request(app).post("/animals").send(newDog);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({});
      expect(res.header).toHaveProperty("location", "/animals/NewDog");
      // Verify the animal was added
      const getRes = await request(app).get("/animals/NewDog");
      expect(getRes.body).toEqual({
        type: "dog",
        name: "NewDog",
        age: 2,
        breed: "Poodle",
      });
    });

    it("should return 400 for invalid animal data", async () => {
      const res = await request(app).post("/animals").send({ type: "cat", name: "InvalidCat" }); // Missing age and livesLeft
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for invalid dog data (missing breed)", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "dog", name: "InvalidDog", age: 4 }); // Missing breed
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for invalid type", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "bird", name: "Tweety", age: 2 }); // Invalid type
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for invalid dog data (missing age)", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "dog", name: "InvalidDog", breed: "Bulldog" }); // Missing age
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for invalid dog data (missing name)", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "dog", age: 4, breed: "Bulldog" }); // Missing name
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for animal with empty name", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "cat", name: "", age: 1, livesLeft: 9 }); // Empty name
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for cat with too many lives", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "cat", name: "ImmortalCat", age: 1, livesLeft: 10 }); // Too many lives
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for cat with negative lives", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "cat", name: "DeadCat", age: 1, livesLeft: -1 }); // Negative lives
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });

    it("should return 400 for animal with negative age", async () => {
      const res = await request(app)
        .post("/animals")
        .send({ type: "dog", name: "TimeTraveler", age: -5, breed: "Beagle" }); // Negative age
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid animal data");
      expect(res.body.details).toBeDefined();
    });
  });

  describe("Type Guards", () => {
    it("should correctly identify a cat using isCat", async () => {
      const { isCat } = await import("../src/models/animal");
      const res = await request(app).get("/animals/Whiskers");
      expect(isCat(res.body)).toBe(true);
    });

    it("should correctly identify a dog using isDog", async () => {
      const { isDog } = await import("../src/models/animal");
      const res = await request(app).get("/animals/Buddy");
      expect(isDog(res.body)).toBe(true);
    });
  });
});
