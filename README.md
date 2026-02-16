# hello-typescript

A TypeScript monorepo for managing animals with a REST API backend and React frontend.

## 📦 Monorepo Structure

This project uses **pnpm workspaces** to manage multiple packages with a clear separation between deployable applications and reusable packages:

```
hello-typescript/
├── apps/                    # Deployable applications
│   ├── api/                # Express + TypeScript REST API
│   └── web/                # React + TypeScript frontend
├── packages/                # Shared, reusable packages
│   └── shared/             # Shared TypeScript types
├── pnpm-workspace.yaml
└── package.json
```

### Why apps/ vs packages/?

- **apps/** - Deployable applications that run as services (API server, web frontend)
- **packages/** - Reusable libraries and shared code (types, utilities, configs)

This separation makes it clear what can be deployed vs what is imported by other packages.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+

Install pnpm if you don't have it:
```sh
npm install -g pnpm
```

### Installation

Install all dependencies across all packages:

```sh
pnpm install
```

### Development

Run both API and web frontend together:

```sh
pnpm dev
```

This starts:
- 🚀 API Server: http://localhost:3000
- 🎨 Web Frontend: http://localhost:5173
- 📚 API Docs: http://localhost:3000/api-docs

Or run them individually:

```sh
# Run API only
pnpm api:dev

# Run web frontend only
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

Run all tests:

```sh
pnpm test
```

Run API tests only:

```sh
pnpm api:test
```

## 📚 Applications

### @hello-typescript/api

Express + TypeScript REST API for managing animals (cats and dogs).

**Location:** `apps/api/`

**Endpoints:**
- `GET /animals` - Get all animals
- `GET /animals/:name` - Get animal by name
- `POST /animals` - Add a new animal

**Features:**
- Express.js server
- OpenAPI/Swagger documentation
- Zod schema validation
- Comprehensive test suite (Jest + Supertest)
- In-memory data store

**Development:**
```sh
pnpm api:dev      # Start with hot reload
pnpm api:build    # Build TypeScript
pnpm api:test     # Run tests
pnpm api:start    # Run production build
```

### @hello-typescript/web

React + TypeScript frontend for the Animal Manager.

**Location:** `apps/web/`

**Features:**
- React 18 with TypeScript
- Vite for fast dev server and builds
- Responsive UI with beautiful gradients
- API proxy configuration (no CORS issues)
- Add and view cats and dogs

**Development:**
```sh
pnpm web:dev      # Dev server on port 5173
pnpm web:build    # Production build
pnpm web:preview  # Preview production build
```

## 📦 Packages

### @hello-typescript/shared

Shared TypeScript types and utilities used by both frontend and backend.

**Location:** `packages/shared/`

**Exports:**
- `Animal` - Base animal interface
- `Cat` - Cat interface with livesLeft
- `Dog` - Dog interface with breed
- `AnimalType` - Union type of Cat | Dog

**Development:**
```sh
pnpm shared:build  # Build TypeScript declarations
pnpm shared:dev    # Watch mode
```

## 🛠️ Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps in development mode (parallel) |
| `pnpm build` | Build all packages and apps |
| `pnpm test` | Run tests in all packages |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format all code |

### Application Specific

| Command | Description |
|---------|-------------|
| `pnpm api:dev` | Run API in development mode |
| `pnpm api:build` | Build API |
| `pnpm api:test` | Run API tests |
| `pnpm api:start` | Run production API build |
| `pnpm web:dev` | Run web in development mode |
| `pnpm web:build` | Build web frontend |
| `pnpm web:preview` | Preview production build |

### Package Specific

| Command | Description |
|---------|-------------|
| `pnpm shared:build` | Build shared package |
| `pnpm shared:dev` | Run shared in watch mode |

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

## 📚 Documentation Index

This repository includes comprehensive documentation:

- **[README.md](./README.md)** (this file) - Project overview, quick start, and general usage
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute getting started guide
- **[APPS_VS_PACKAGES.md](./APPS_VS_PACKAGES.md)** - Explains the apps/ vs packages/ structure and why it matters
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture guide, design principles, and scaling
- **[MONOREPO_SETUP.md](./MONOREPO_SETUP.md)** - Comprehensive monorepo setup, workflow, and troubleshooting
- **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - History of the monorepo reorganization
- **[OPENAPI_DOCS.md](./OPENAPI_DOCS.md)** - API documentation and OpenAPI specification

**Start here:**
- New to the project? → [QUICKSTART.md](./QUICKSTART.md)
- Want to understand the structure? → [APPS_VS_PACKAGES.md](./APPS_VS_PACKAGES.md)
- Need architecture details? → [ARCHITECTURE.md](./ARCHITECTURE.md)
- Having issues? → [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) (Troubleshooting section)

### Example API Calls

**Get all animals:**
```sh
curl http://localhost:3000/animals
```

**Get animal by name:**
```sh
curl http://localhost:3000/animals/Whiskers
```

**Add a new cat:**
```sh
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cat",
    "name": "Mittens",
    "age": 2,
    "livesLeft": 9
  }'
```

**Add a new dog:**
```sh
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{
    "type": "dog",
    "name": "Buddy",
    "age": 5,
    "breed": "Golden Retriever"
  }'
```

## 🎨 Frontend

The web interface runs on `http://localhost:5173` and provides:

- Interactive form to add cats and dogs
- Grid display of all animals with emoji icons
- Different color themes for cats vs dogs
- Real-time updates
- Responsive design
- API proxy configuration (requests to `/api/*` are proxied to the backend)

## 🤝 Development Workflow

### Making Changes

**Backend (API):**
1. Edit files in `apps/api/src/`
2. Server auto-restarts (nodemon)
3. Run tests: `pnpm api:test`
4. Check types: `pnpm api:build`

**Frontend (Web):**
1. Edit files in `apps/web/src/`
2. Browser auto-reloads (Vite HMR)
3. Check types: `pnpm web:build`

**Shared Types:**
1. Edit files in `packages/shared/src/`
2. Build: `pnpm shared:build`
3. Both API and Web will pick up changes

### Adding Dependencies

**To an app:**
```sh
# Add to API
pnpm --filter @hello-typescript/api add express

# Add dev dependency to Web
pnpm --filter @hello-typescript/web add -D eslint
```

**To a package:**
```sh
# Add to shared
pnpm --filter @hello-typescript/shared add lodash
```

**To the root (for tooling):**
```sh
pnpm add -D -w prettier
```

The `-w` flag means "workspace root".

### Cross-Package Dependencies

To use the shared package in apps:

1. Add to `package.json`:
   ```json
   {
     "dependencies": {
       "@hello-typescript/shared": "workspace:*"
     }
   }
   ```

2. Import in code:
   ```typescript
   import { Animal, Cat, Dog } from '@hello-typescript/shared'
   ```

3. Build the shared package first:
   ```bash
   pnpm shared:build
   ```

## 📝 Adding New Packages

### Adding a New App

Create a new deployable application:

```sh
mkdir apps/my-app
cd apps/my-app
pnpm init
```

Add `"name": "@hello-typescript/my-app"` to `package.json`.

### Adding a New Package

Create a new shared package:

```sh
mkdir packages/my-package
cd packages/my-package
pnpm init
```

Add `"name": "@hello-typescript/my-package"` to `package.json`.

The workspace will automatically detect it!

## 🧹 Common Tasks

**Clean build artifacts:**
```sh
rm -rf apps/*/dist packages/*/dist
pnpm build
```

**Clean everything and reinstall:**
```sh
rm -rf node_modules apps/*/node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install
```

**Run commands in all apps:**
```sh
pnpm --filter './apps/*' build
```

**Run commands in all packages:**
```sh
pnpm --filter './packages/*' build
```

## 🐛 Troubleshooting

### Port Already in Use
```sh
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

### Module Not Found
```sh
# Rebuild shared package
pnpm shared:build

# Reinstall dependencies
rm -rf node_modules apps/*/node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
```sh
# Clear TypeScript cache
find . -name "*.tsbuildinfo" -delete
pnpm build
```

## 📚 Additional Documentation

- [QUICKSTART.md](./QUICKSTART.md) - 5-minute getting started guide
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Detailed architecture and workflow
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Migration history and changes

## 🏗️ Monorepo Best Practices

1. **Apps vs Packages**: Keep deployable apps in `apps/`, reusable code in `packages/`
2. **Build Order**: Always build packages before apps that depend on them
3. **Shared Code**: Put common types and utilities in `packages/shared`
4. **Independent Versions**: Each package can have its own version
5. **Consistent Tooling**: Use the same TypeScript, linting, and formatting configs
6. **Test Often**: Run `pnpm test` frequently to catch issues early
7. **Commit Lock File**: Always commit `pnpm-lock.yaml` for reproducible builds

## 📖 Data Models

- `Animal`: Base interface with `name`, `age`, `type`
- `Cat` extends `Animal`: Adds `livesLeft` (1-9)
- `Dog` extends `Animal`: Adds `breed` (string)

## 📄 License

MIT

---

**Built with ❤️ using TypeScript, pnpm, Express, and React**