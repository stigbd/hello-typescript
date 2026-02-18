# Linting and Formatting Guide

This project uses **Biome** for code linting and formatting. Biome is a fast, modern toolchain that replaces ESLint and Prettier with a single, unified tool.

## Table of Contents

- [Why Biome?](#why-biome)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Editor Integration](#editor-integration)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Commands Reference](#commands-reference)
- [Rules and Standards](#rules-and-standards)
- [Troubleshooting](#troubleshooting)

## Why Biome?

**Biome** is an excellent choice for TypeScript monorepos:

✅ **Fast**: Written in Rust, 10-100x faster than ESLint + Prettier  
✅ **Unified**: Single tool for linting and formatting  
✅ **Zero Config**: Works great with sensible defaults  
✅ **TypeScript Native**: First-class TypeScript support  
✅ **Monorepo Friendly**: Handles workspace configurations easily  
✅ **Compatible**: Drop-in replacement for ESLint/Prettier  
✅ **Import Sorting**: Automatically organizes imports  

### Biome vs ESLint + Prettier

| Feature | Biome | ESLint + Prettier |
|---------|-------|-------------------|
| Speed | ⚡ Extremely fast | 🐢 Slower |
| Configuration | 1 file | 2+ files |
| Installation | 1 package | 5+ packages |
| Import sorting | Built-in | Needs plugin |
| JSON support | Built-in | Needs plugin |
| Learning curve | Low | Medium-High |

## Installation

Biome is already installed in this project:

```json
{
  "devDependencies": {
    "@biomejs/biome": "2.3.11"
  }
}
```

To install in a new project:

```bash
pnpm add -D @biomejs/biome
```

## Configuration

The project uses a root `biome.jsonc` configuration that applies to all workspaces:

```
hello-typescript/
├── biome.jsonc           # Root configuration
├── apps/
│   ├── api/             # Uses root config
│   └── web/             # Uses root config
└── packages/
    └── shared/          # Uses root config
```

### Root Configuration

The `biome.jsonc` file defines:

- **Formatting rules**: Indentation, line width, quotes, etc.
- **Linting rules**: Code quality and correctness checks
- **Import organization**: Automatic import sorting
- **VCS integration**: Uses `.gitignore` automatically

Key settings:

```jsonc
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100,
    "lineEnding": "lf"
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always",
      "trailingCommas": "all"
    }
  }
}
```

## Usage

### From the Command Line

**Root level (recommended):**

```bash
# Check all files
pnpm lint              # Lint only
pnpm format            # Format all files
pnpm format:check      # Check formatting without changing
pnpm check             # Lint + format + organize imports
```

**Individual apps/packages:**

```bash
# API
pnpm api:lint
pnpm api:format

# Web
pnpm web:lint
pnpm web:format
```

### Common Workflows

**Before committing:**
```bash
pnpm check
```

**Check what would change:**
```bash
pnpm format:check
```

**Fix all issues automatically:**
```bash
pnpm check
```

**Fix including unsafe changes:**
```bash
pnpm biome check --write --unsafe .
```

## Editor Integration

### Zed (Recommended)

Zed has built-in Biome support! No extension needed.

1. **Biome works automatically** - Zed detects `biome.jsonc` in your project

2. **Settings are already configured** in `.zed/settings.json`:
   - Format on save: ✅ Enabled
   - Organize imports on save: ✅ Enabled
   - Default formatter: Biome (via language server)

3. **Just open the project** in Zed and it works! 🚀

### VS Code

1. **Install the Biome extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Biome"
   - Install "Biome" by biomejs

2. **Configure settings** - Create `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "biomejs.biome",
     "editor.codeActionsOnSave": {
       "quickfix.biome": "explicit",
       "source.organizeImports.biome": "explicit"
     }
   }
   ```

3. **Restart VS Code** after installing the extension

### Other Editors

**WebStorm/IntelliJ:**
- Install "Biome" plugin from marketplace
- Set Biome as default formatter in settings

**Vim/Neovim:**
```vim
" Using null-ls
require("null-ls").setup({
  sources = {
    require("null-ls").builtins.formatting.biome,
  },
})
```

**Emacs:**
```elisp
(add-hook 'typescript-mode-hook
  (lambda ()
    (add-hook 'before-save-hook 'biome-format nil 'local)))
```

### Verifying Editor Integration

**In Zed:**
1. Open a TypeScript file
2. Add extra spaces or change indentation
3. Save the file (Cmd/Ctrl+S)
4. File should auto-format immediately ✨

If not working:
- Check `biome.jsonc` exists in project root
- Check Zed's language server logs: View → Diagnostics
- Restart Zed

**In VS Code:**
1. Open a TypeScript file
2. Add extra spaces or change indentation
3. Save the file
4. File should auto-format immediately

If not working:
- Check extension is installed and enabled
- Reload VS Code window (Ctrl+Shift+P → "Reload Window")
- Check Output panel → Biome for errors

## Pre-commit Hooks

To enforce code quality before commits, use git hooks.

### Option 1: Husky + lint-staged (Recommended)

Install:
```bash
pnpm add -D husky lint-staged
pnpm exec husky init
```

Configure `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json}": [
      "biome check --write --no-errors-on-unmatched"
    ]
  }
}
```

Create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

### Option 2: Simple Git Hook

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
pnpm check
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

## Commands Reference

### Root Level Commands

| Command | Description |
|---------|-------------|
| `pnpm lint` | Lint all files |
| `pnpm lint:fix` | Lint and fix issues |
| `pnpm format` | Format all files |
| `pnpm format:check` | Check formatting without changing |
| `pnpm check` | Lint + format + organize imports |

### Package Level Commands

Each app/package has the same scripts:

| Command | Description |
|---------|-------------|
| `pnpm <pkg>:lint` | Lint package only |
| `pnpm <pkg>:format` | Format package only |
| `pnpm <pkg>:check` | Check package only |

Examples:
```bash
pnpm api:lint
pnpm web:format
pnpm shared:check
```

### Direct Biome Commands

```bash
# Check specific files
pnpm biome check apps/api/src/index.ts

# Format specific directory
pnpm biome format --write apps/web/src

# Lint with unsafe fixes
pnpm biome lint --write --unsafe .

# CI mode (exit with error if issues found)
pnpm biome ci .

# Explain a rule
pnpm biome explain noUnusedVariables
```

## Rules and Standards

### Enabled Rules

**Correctness:**
- ✅ No unused variables
- ✅ No unreachable code
- ✅ Valid for-loop direction
- ✅ Proper use of `parseInt` (with radix)

**Style:**
- ✅ Use `const` instead of `let` when possible
- ✅ Prefer template literals over string concatenation
- ✅ Consistent naming conventions

**Suspicious:**
- ⚠️ Avoid `any` type (warning)
- ⚠️ Prefer `===` over `==` (warning)
- ✅ No duplicate cases in switch
- ✅ No fallthrough in switch statements

### Formatting Standards

- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: Always (helps with diffs)
- **Arrow function parentheses**: Always
- **Line endings**: LF (Unix-style)

### Import Organization

Biome automatically organizes imports:

```typescript
// Before
import { z } from 'zod';
import express from 'express';
import { Animal } from '@hello-typescript/shared';
import { useState } from 'react';

// After (organized)
import express from 'express';
import { useState } from 'react';
import { z } from 'zod';
import { Animal } from '@hello-typescript/shared';
```

Order:
1. Node built-ins
2. External packages (alphabetical)
3. Internal packages (alphabetical)
4. Relative imports

## Troubleshooting

### "Biome not found" Error

**Problem**: Command not found or editor can't find Biome

**Solution**:
```bash
# Reinstall dependencies
pnpm install

# Check Biome is installed
pnpm biome --version

# For VS Code, set explicit path in settings.json (if needed)
"biome.lspBin": "./node_modules/@biomejs/biome/bin/biome"

# For Zed, it auto-detects from node_modules
```

### Editor Not Formatting on Save

**Problem**: Files not formatting automatically

**Solution for Zed**:
1. Check `.zed/settings.json` exists with correct settings
2. Verify `biome.jsonc` is in project root
3. Check Zed diagnostics: View → Diagnostics
4. Restart Zed if needed
5. Run `pnpm biome check apps/` to verify Biome works

**Solution for VS Code**:
1. Check Biome extension is installed and enabled
2. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
3. Create `.vscode/settings.json` with formatter settings
4. Check Output panel → Biome for errors
5. Verify file type is supported (check file extension)

### Configuration Errors

**Problem**: `biome.jsonc` has errors

**Solution**:
```bash
# Validate configuration
pnpm biome check --config-path=./biome.jsonc

# Migrate old config
pnpm biome migrate

# Start fresh
rm biome.jsonc
pnpm biome init
```

### Conflicts with ESLint/Prettier

**Problem**: Both Biome and ESLint/Prettier running

**Solution**:
1. Remove ESLint and Prettier from `package.json`
2. Delete `.eslintrc`, `.prettierrc` files
3. In Zed: No action needed - Biome takes priority automatically
4. In VS Code: Update settings to disable them:
   ```json
   {
     "eslint.enable": false,
     "prettier.enable": false
   }
   ```

### Formatting Differences in CI

**Problem**: Local and CI formatting differ

**Solution**:
- Ensure same Biome version everywhere
- Commit `biome.jsonc` to version control
- Use `pnpm biome ci .` in CI pipeline
- Check line endings are consistent (LF vs CRLF)

### Performance Issues

**Problem**: Biome is slow on large codebases

**Solution**:
```bash
# Use VCS ignore (already enabled)
# Excludes files in .gitignore

# Limit file scope
pnpm biome check apps/

# Use incremental checks (only changed files)
pnpm biome check --changed
```

## Best Practices

### DO ✅

1. **Run `pnpm check` before committing**
2. **Enable format-on-save in your editor** (already configured for Zed!)
3. **Use pre-commit hooks** to enforce standards
4. **Keep Biome updated** for bug fixes and new features
5. **Use `pnpm biome ci apps/ packages/` in CI/CD** to catch issues
6. **Organize imports automatically** (it's enabled by default)
7. **Share `biome.jsonc` and `.zed/settings.json`** across the team via git

### DON'T ❌

1. **Don't mix Biome with ESLint/Prettier** - causes conflicts
2. **Don't ignore all linting errors** - they catch real bugs
3. **Don't skip formatting** - consistency matters
4. **Don't use `--unsafe` without reviewing** - can break code
5. **Don't commit unformatted code** - breaks team standards
6. **Don't edit `biome.jsonc` without testing** - validate changes
7. **Don't use different configs per package** - keep it simple

## CI/CD Integration

### GitHub Actions

```yaml
name: Lint and Format

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm biome ci .
```

### GitLab CI

```yaml
lint:
  stage: test
  script:
    - pnpm install
    - pnpm biome ci .
```

### Pre-merge Checks

Add to your PR workflow:
```bash
# In your CI script
pnpm install
pnpm biome ci .
if [ $? -ne 0 ]; then
  echo "❌ Code quality checks failed"
  exit 1
fi
```

## Migration from ESLint + Prettier

If migrating from ESLint/Prettier:

1. **Backup configs** (just in case)
   ```bash
   cp .eslintrc.json .eslintrc.json.backup
   cp .prettierrc .prettierrc.backup
   ```

2. **Remove old tools**
   ```bash
   pnpm remove eslint prettier
   pnpm remove eslint-config-* eslint-plugin-*
   pnpm remove prettier-plugin-*
   ```

3. **Biome is already installed** in this project

4. **Run check** to see issues
   ```bash
   pnpm check
   ```

5. **Review and commit** changes

6. **Update CI/CD** pipelines to use Biome

7. **Update team documentation**

## Resources

- **Official Docs**: https://biomejs.dev/
- **Zed Integration**: Built-in! Just works with `biome.jsonc`
- **VS Code Extension**: https://marketplace.visualstudio.com/items?itemName=biomejs.biome
- **GitHub**: https://github.com/biomejs/biome
- **Discord**: https://biomejs.dev/chat
- **Migration Guide**: https://biomejs.dev/guides/migrate-eslint-prettier/

## Quick Reference Card

```bash
# Most common commands
pnpm check                    # Fix everything
pnpm format                   # Format files
pnpm lint                     # Check for errors

# Before commit
pnpm check                    # Always run this

# In CI/CD
pnpm biome ci .               # Strict check mode

# Explain a rule
pnpm biome explain <rule>     # Learn about rules

# Version
pnpm biome --version          # Check version
```

---

**Need Help?**
- Check the [Official Documentation](https://biomejs.dev/)
- Open an issue in the project repository
- Ask the team in your chat channel

**Remember**: Consistent code formatting improves readability and reduces merge conflicts! 🎉

## Related Documentation

- [README.md](../README.md) - Project overview and usage
- [QUICKSTART.md](../QUICKSTART.md) - 5-minute getting started guide
- [ZED_SETUP.md](./ZED_SETUP.md) - Zed editor configuration
- [MONOREPO_SETUP.md](./MONOREPO_SETUP.md) - Monorepo setup and workflow
