# hello-typescript

A TypeScript monorepo for managing animals with a REST API backend and React frontend.

## 📦 Monorepo Structure

This project uses pnpm workspaces to manage multiple packages:

```
hello-typescript/
├── packages/
│   ├── api/          # Express + TypeScript REST API
│   ├── web/          # React + TypeScript frontend
│   └── shared/       # Shared types and utilities
├── pnpm-workspace.yaml
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Installation

Install all dependencies across all packages:

```sh
pnpm install
```

### Development

Run both API and web frontend in development mode:

```sh
pnpm dev
```

Or run them individually:

```sh
# Run API only (http://localhost:3000)
pnpm api:dev

# Run web frontend only (http://localhost:5173)
pnpm web:dev
```

### Building

Build all packages:

```sh
pnpm build
```

Or build individually:

```sh
pnpm api:build
pnpm web:build
pnpm shared:build
```

### Testing

Run tests across all packages:

```sh
pnpm test
```

## 📚 Packages

### @hello-typescript/api

Express + TypeScript REST API for managing animals (cats and dogs).

**Endpoints:**
- `GET /animals` - Get all animals
- `GET /animals/:name` - Get animal by name
- `POST /animals` - Add a new animal

**Location:** `packages/api/`

### @hello-typescript/web

React + TypeScript frontend for interacting with the Animal API.

**Features:**
- Add new animals (cats/dogs)
- View all animals
- Responsive UI with beautiful gradients

**Location:** `packages/web/`

### @hello-typescript/shared

Shared TypeScript types and utilities used by both frontend and backend.

**Location:** `packages/shared/`

## 🛠️ Available Scripts

### Root Level

- `pnpm dev` - Run all packages in development mode
- `pnpm build` - Build all packages
- `pnpm test` - Run tests in all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code in all packages

### Package Specific

- `pnpm api:dev` - Run API in development mode
- `pnpm api:build` - Build API
- `pnpm api:test` - Run API tests
- `pnpm web:dev` - Run web frontend in development mode
- `pnpm web:build` - Build web frontend
- `pnpm web:preview` - Preview production build
- `pnpm shared:build` - Build shared package

## 🔧 Tech Stack

- **Language:** TypeScript
- **Package Manager:** pnpm with workspaces
- **Backend:** Express.js
- **Frontend:** React 18 + Vite
- **API Docs:** OpenAPI/Swagger
- **Validation:** Zod
- **Testing:** Jest + Supertest
- **Code Quality:** Biome (linting + formatting)

## 📖 API Documentation

When running the API, OpenAPI documentation is available at:

```
http://localhost:3000/api-docs
```

## 🎨 Frontend

The web interface runs on `http://localhost:5173` and provides:

- Interactive form to add cats and dogs
- Grid display of all animals
- Real-time updates
- API proxy configuration (no CORS issues)

## 🤝 Development Workflow

1. Make changes in any package
2. The dev servers will hot-reload automatically
3. Run tests: `pnpm test`
4. Format code: `pnpm format`
5. Lint code: `pnpm lint`
6. Build for production: `pnpm build`

## 📝 Adding New Packages

To add a new package to the monorepo:

1. Create a new directory under `packages/`
2. Add a `package.json` with name `@hello-typescript/package-name`
3. The workspace will automatically pick it up
4. Install dependencies with `pnpm install`

## Models

- `Animal`: Base interface with `name`, `age`, `type`
- `Cat` extends `Animal`: Adds `livesLeft`
- `Dog` extends `Animal`: Adds `breed`

## License

MIT