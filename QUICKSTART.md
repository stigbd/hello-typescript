# Quick Start Guide

Get up and running with the Animal Manager monorepo in 5 minutes!

## Prerequisites

- **Node.js** 18 or higher
- **pnpm** 8 or higher

Install pnpm if you don't have it:
```bash
npm install -g pnpm
```

## Installation

```bash
# Clone the repository (if needed)
cd hello-typescript

# Install all dependencies
pnpm install
```

## Development

### Option 1: Run Everything (Recommended)

Start both API and web frontend together:

```bash
pnpm dev
```

This will start:
- 🚀 API Server: http://localhost:3000
- 🎨 Web Frontend: http://localhost:5173
- 📚 API Docs: http://localhost:3000/api-docs

### Option 2: Run Separately

Run API only:
```bash
pnpm api:dev
```

Run Web only:
```bash
pnpm web:dev
```

## Using the Application

1. **Open your browser** to http://localhost:5173

2. **Add an animal**:
   - Choose "Cat" or "Dog"
   - Fill in the name and age
   - For cats: Enter lives left (1-9)
   - For dogs: Enter breed
   - Click "Add Animal"

3. **View animals**: All animals appear in the grid below the form

4. **API Documentation**: Visit http://localhost:3000/api-docs to see the Swagger UI

## Testing

Run all tests:
```bash
pnpm test
```

Run API tests only:
```bash
pnpm api:test
```

## Building for Production

Build all packages:
```bash
pnpm build
```

Build outputs:
- API: `packages/api/dist/`
- Web: `packages/web/dist/`
- Shared: `packages/shared/dist/`

## Project Structure

```
hello-typescript/
├── apps/          # Deployable applications
│   ├── api/       # Express REST API
│   └── web/       # React frontend
├── packages/      # Shared, reusable packages
│   └── shared/    # Shared TypeScript types
└── package.json   # Root workspace config
```

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in development mode |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm format` | Format all code |
| `pnpm api:dev` | Start API only |
| `pnpm web:dev` | Start web only |

## API Endpoints

### GET /animals
Get all animals
```bash
curl http://localhost:3000/animals
```

### GET /animals/:name
Get animal by name
```bash
curl http://localhost:3000/animals/Whiskers
```

### POST /animals
Add a new cat
```bash
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{
    "type": "cat",
    "name": "Mittens",
    "age": 2,
    "livesLeft": 9
  }'
```

Add a new dog
```bash
curl -X POST http://localhost:3000/animals \
  -H "Content-Type: application/json" \
  -d '{
    "type": "dog",
    "name": "Buddy",
    "age": 5,
    "breed": "Golden Retriever"
  }'
```

## Troubleshooting

### Port already in use
If you see "Port 3000 is already in use":
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>
```

### Module not found
If you see module errors:
```bash
# Reinstall dependencies
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install
```

### Build errors
```bash
# Clean build artifacts
rm -rf packages/*/dist
pnpm build
```

## Next Steps

- 📖 Read [README.md](./README.md) for detailed documentation
- 🏗️ Check [docs/MONOREPO_SETUP.md](./docs/MONOREPO_SETUP.md) for monorepo architecture
- 🔧 Explore the code in `apps/api/src` and `apps/web/src`
- 🧪 Add more tests in `apps/api/tests`
- 🎨 Customize the UI in `apps/web/src`

## Need Help?

- Check if dependencies are installed: `pnpm list`
- Verify Node.js version: `node --version` (should be 18+)
- Verify pnpm version: `pnpm --version` (should be 8+)
- Read the full documentation in README.md

Happy coding! 🎉
