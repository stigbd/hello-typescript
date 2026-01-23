# OpenAPI Documentation with Zod-to-OpenAPI

This project uses `@asteasolutions/zod-to-openapi` to automatically generate OpenAPI (Swagger) documentation from Zod schemas.

## 🎉 Benefits

### Before (Manual JSDoc Comments)
- ❌ Duplicate definitions (Zod schemas + JSDoc comments)
- ❌ Manual sync between validation and docs
- ❌ Easy to get out of sync
- ❌ Verbose and repetitive

### After (Zod-to-OpenAPI)
- ✅ Single source of truth (Zod schemas)
- ✅ Automatic OpenAPI generation
- ✅ Always in sync with validation
- ✅ Type-safe and concise

## 📁 Project Structure

```
src/
├── models/
│   └── animal.ts          # Zod schemas with .openapi() metadata
├── openapi.ts             # OpenAPI registry & route definitions
├── index.ts               # Express routes (no more JSDoc comments!)
└── server.ts              # Server entry point
```

## 🔧 How It Works

### 1. Define Schemas with OpenAPI Metadata (`src/models/animal.ts`)

```typescript
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const CatSchema = z
  .object({
    type: z.literal("cat"),
    name: z.string().min(1, "Name is required"),
    age: z.number().int().positive("Age must be a positive integer"),
    livesLeft: z.number().int().min(0).max(9),
  })
  .openapi("Cat", {
    description: "A cat animal",
    example: {
      type: "cat",
      name: "Whiskers",
      age: 3,
      livesLeft: 7,
    },
  });
```

### 2. Register Routes in OpenAPI Registry (`src/openapi.ts`)

```typescript
import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

const registry = new OpenAPIRegistry();

// Register schemas
registry.register("Cat", CatSchema);
registry.register("Dog", DogSchema);

// Register routes
registry.registerPath({
  method: "get",
  path: "/animals",
  summary: "List all animals",
  tags: ["Animals"],
  responses: {
    200: {
      description: "A list of animals",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: { $ref: "#/components/schemas/Animal" },
          },
        },
      },
    },
  },
});
```

### 3. Generate OpenAPI Spec (`src/openapi.ts`)

```typescript
export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: "Animals API",
      version: "1.0.0",
      description: "API for managing animals (cats and dogs)",
    },
  });
}
```

### 4. Serve with Swagger UI (`src/index.ts`)

```typescript
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./openapi";

const openApiSpec = generateOpenAPIDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));
```

## 🚀 Usage

### Start the server
```bash
pnpm dev
```

### View API Documentation
Open your browser to: **http://localhost:3000/api-docs**

You'll see a fully interactive Swagger UI with:
- ✅ All endpoints documented
- ✅ Request/response schemas
- ✅ Validation rules
- ✅ Example values
- ✅ Try-it-out functionality

## 📝 Adding New Endpoints

1. **Define your Zod schema** in `src/models/`:
   ```typescript
   export const BirdSchema = z.object({
     type: z.literal("bird"),
     name: z.string(),
     canFly: z.boolean(),
   }).openapi("Bird", {
     description: "A bird animal",
     example: { type: "bird", name: "Tweety", canFly: true },
   });
   ```

2. **Register the route** in `src/openapi.ts`:
   ```typescript
   registry.register("Bird", BirdSchema);
   
   registry.registerPath({
     method: "post",
     path: "/birds",
     // ... endpoint definition
   });
   ```

3. **Implement the route** in `src/index.ts`:
   ```typescript
   app.post("/birds", (req, res) => {
     const result = BirdSchema.safeParse(req.body);
     // ... handle request
   });
   ```

That's it! Your OpenAPI docs are automatically updated. 🎉

## 🔗 Resources

- [zod-to-openapi GitHub](https://github.com/asteasolutions/zod-to-openapi)
- [Zod Documentation](https://zod.dev)
- [OpenAPI Specification](https://swagger.io/specification/)