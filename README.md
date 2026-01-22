# hello-typescript

Minimal Express + TypeScript API for managing animals.

## Install & Run

```sh
pnpm install
pnpm run build
pnpm start   # Runs the compiled output from the dist directory
```

For live reload during development (auto-restart on code changes):

```sh
pnpm run dev
```

## Running Tests

To run the automated tests for the API endpoints:

```sh
pnpm test
```

## Project Structure

```
src/
  index.ts         # Express server
  models/          # TypeScript interfaces for Animal, Cat, Dog
```

## API

### GET /animals

Returns all animals.

```sh
curl http://localhost:3000/animals
```

### GET /animals/:name

Get a single animal by name.

```sh
curl http://localhost:3000/animals/Whiskers
```

Returns the animal object if found, or a 404 error if not.

### POST /animals

Add a new cat or dog.

```sh
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{"type":"cat","name":"Mittens","age":2,"livesLeft":9}'
```

#### Request fields

- For cats: `type: "cat"`, `name`, `age`, `livesLeft`
- For dogs: `type: "dog"`, `name`, `age`, `breed`

#### Response example

```json
{
  "type": "cat",
  "name": "Mittens",
  "age": 2,
  "livesLeft": 9
}
```

## Models

- `Animal`: `name`, `age`, `speak()`
- `Cat` extends `Animal`: `livesLeft`
- `Dog` extends `Animal`: `breed`
