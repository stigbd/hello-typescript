import { useCallback, useEffect, useState } from "react";
import "./App.css";

interface Animal {
  name: string;
  age: number;
  type: "cat" | "dog";
}

interface Cat extends Animal {
  type: "cat";
  livesLeft: number;
}

interface Dog extends Animal {
  type: "dog";
  breed: string;
}

type AnimalType = Cat | Dog;

function App() {
  const [animals, setAnimals] = useState<AnimalType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: "cat" as "cat" | "dog",
    name: "",
    age: "",
    livesLeft: "",
    breed: "",
  });

  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/animals");
      if (!response.ok) throw new Error("Failed to fetch animals");
      const data = await response.json();
      setAnimals(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const animal =
      formData.type === "cat"
        ? {
            type: "cat" as const,
            name: formData.name,
            age: parseInt(formData.age, 10),
            livesLeft: parseInt(formData.livesLeft, 10),
          }
        : {
            type: "dog" as const,
            name: formData.name,
            age: parseInt(formData.age, 10),
            breed: formData.breed,
          };

    try {
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(animal),
      });

      if (!response.ok) throw new Error("Failed to add animal");

      await fetchAnimals();
      setFormData({
        type: "cat",
        name: "",
        age: "",
        livesLeft: "",
        breed: "",
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add animal");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="app">
      <h1>🐾 Animal Manager</h1>

      {error && <div className="error">{error}</div>}

      <div className="container">
        <section className="form-section">
          <h2>Add New Animal</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                id="age"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="0"
                placeholder="Enter age"
              />
            </div>

            {formData.type === "cat" ? (
              <div className="form-group">
                <label htmlFor="livesLeft">Lives Left:</label>
                <input
                  id="livesLeft"
                  type="number"
                  name="livesLeft"
                  value={formData.livesLeft}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="9"
                  placeholder="1-9"
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="breed">Breed:</label>
                <input
                  id="breed"
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter breed"
                />
              </div>
            )}

            <button type="submit" className="btn-primary">
              Add Animal
            </button>
          </form>
        </section>

        <section className="animals-section">
          <h2>Animals</h2>
          {loading ? (
            <p>Loading...</p>
          ) : animals.length === 0 ? (
            <p className="empty">No animals yet. Add one to get started!</p>
          ) : (
            <div className="animals-grid">
              {animals.map((animal) => (
                <div key={animal.name} className={`animal-card ${animal.type}`}>
                  <div className="animal-icon">{animal.type === "cat" ? "🐱" : "🐶"}</div>
                  <h3>{animal.name}</h3>
                  <p className="animal-type">{animal.type.toUpperCase()}</p>
                  <p>Age: {animal.age} years</p>
                  {animal.type === "cat" ? (
                    <p>Lives Left: {animal.livesLeft}</p>
                  ) : (
                    <p>Breed: {animal.breed}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
