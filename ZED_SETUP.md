# Zed Editor Setup Guide

This project is configured to work seamlessly with **Zed** editor, with Biome providing fast linting and formatting.

## Quick Start

1. **Open the project in Zed:**
   ```bash
   cd hello-typescript
   zed .
   ```

2. **That's it!** 🎉 Biome is already configured and will work automatically.

## What's Configured

Zed has **built-in Biome support** - no extensions needed! The project includes:

- `.zed/settings.json` - Project-specific Zed settings
- `biome.jsonc` - Biome configuration for linting and formatting

### Features Enabled

✅ **Format on save** - Code auto-formats when you save  
✅ **Organize imports** - Imports are automatically sorted  
✅ **Fix on save** - Auto-fixes linting issues  
✅ **TypeScript support** - Full TypeScript and TSX support  
✅ **JSON formatting** - Formats JSON and JSONC files  

## Verifying It Works

1. Open any TypeScript file (e.g., `apps/api/src/index.ts`)
2. Make some formatting changes (add extra spaces, wrong indentation)
3. Save the file (Cmd+S or Ctrl+S)
4. Watch it auto-format! ✨

## Customizing Settings

### Project Settings

Edit `.zed/settings.json` to customize project-wide behavior:

```json
{
  "languages": {
    "TypeScript": {
      "formatter": "language_server",
      "format_on_save": "on",
      "code_actions_on_format": {
        "source.organizeImports": true,
        "source.fixAll": true
      }
    }
  }
}
```

### User Settings

For personal preferences, edit your user settings:
- **macOS**: Cmd+, or Zed → Settings → Open Settings
- **Linux**: Ctrl+, or File → Settings

Example user settings:
```json
{
  "theme": "One Dark",
  "buffer_font_size": 14,
  "ui_font_size": 14,
  "tab_size": 2
}
```

## Keyboard Shortcuts

### Formatting
- **Format Document**: Cmd+Shift+I (macOS) / Ctrl+Shift+I (Linux)
- **Save & Format**: Cmd+S (macOS) / Ctrl+S (Linux) - automatic!

### Code Actions
- **Quick Fix**: Cmd+. (macOS) / Ctrl+. (Linux)
- **Organize Imports**: Cmd+Shift+O (macOS) / Ctrl+Shift+O (Linux)

### Navigation
- **Go to File**: Cmd+P (macOS) / Ctrl+P (Linux)
- **Go to Symbol**: Cmd+Shift+O (macOS) / Ctrl+Shift+O (Linux)
- **Command Palette**: Cmd+Shift+P (macOS) / Ctrl+Shift+P (Linux)

## Biome Configuration

The project uses `biome.jsonc` for linting and formatting rules:

### Formatting Standards
- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: Always (better for git diffs)

### Linting Rules
- ✅ No unused variables
- ✅ No unreachable code
- ⚠️ Avoid `any` type (warning)
- ⚠️ Prefer `===` over `==` (warning)
- ✅ Use `const` instead of `let` when possible

## Running Commands from Zed

### Terminal Integration

Open the integrated terminal:
- **macOS**: Cmd+` or Terminal → New Terminal
- **Linux**: Ctrl+` or Terminal → New Terminal

Then run project commands:
```bash
# Check and fix all code
pnpm check

# Format code
pnpm format

# Lint code
pnpm lint

# Run tests
pnpm test

# Start development
pnpm dev
```

### Task Runner

Zed has a built-in task runner. Press Cmd+Shift+P (or Ctrl+Shift+P) and type "task" to see available options.

## Troubleshooting

### Biome Not Working

**Problem**: Code not formatting on save

**Solution**:
1. Check that `biome.jsonc` exists in project root
2. Verify Zed's language server is running:
   - Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
   - Type "diagnostics"
   - Select "View: Open Diagnostics"
3. Check that Biome is installed:
   ```bash
   pnpm biome --version
   ```
4. Restart Zed: Cmd+Q then reopen (macOS) or Ctrl+Q (Linux)

### TypeScript Errors

**Problem**: TypeScript errors not showing

**Solution**:
1. Zed uses the TypeScript language server automatically
2. Check your `tsconfig.json` files are valid
3. Run type check manually:
   ```bash
   pnpm build
   ```
4. Restart the language server:
   - Command Palette → "language server: restart"

### Import Organization Not Working

**Problem**: Imports not organizing on save

**Solution**:
1. Check `.zed/settings.json` has `"source.organizeImports": true`
2. Verify Biome's assist feature is enabled in `biome.jsonc`
3. Try manually: Cmd+Shift+O (macOS) / Ctrl+Shift+O (Linux)

### File Not Formatting

**Problem**: Specific file not formatting

**Solution**:
1. Check file extension is supported (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`)
2. Check file is not in ignored paths (like `node_modules`, `dist`)
3. Try manual format: Cmd+Shift+I (macOS) / Ctrl+Shift+I (Linux)
4. Check for syntax errors - Biome won't format invalid code

## Extensions & Plugins

Zed has minimal extensions since most features are built-in. Useful ones for this project:

- **None required!** Biome support is built-in
- TypeScript support is built-in
- Git support is built-in

## Tips & Tricks

### Multiple Cursors
- **Alt+Click** - Add cursor
- **Cmd+D** (macOS) / **Ctrl+D** (Linux) - Select next occurrence
- **Cmd+Shift+L** (macOS) / **Ctrl+Shift+L** (Linux) - Select all occurrences

### Split Editor
- **Cmd+K, Cmd+S** (macOS) / **Ctrl+K, Ctrl+S** (Linux) - Split editor
- **Cmd+1/2/3** (macOS) / **Ctrl+1/2/3** (Linux) - Focus split

### Project-Wide Search
- **Cmd+Shift+F** (macOS) / **Ctrl+Shift+F** (Linux) - Search in files
- **Cmd+Shift+H** (macOS) / **Ctrl+Shift+H** (Linux) - Replace in files

### Git Integration
- **Cmd+Shift+G** (macOS) / **Ctrl+Shift+G** (Linux) - Git panel
- Zed shows git status in the gutter automatically

### Zen Mode
- **Cmd+K, Z** (macOS) / **Ctrl+K, Z** (Linux) - Enter Zen mode
- Escape - Exit Zen mode

## Recommended Workflow

1. **Start your day:**
   ```bash
   cd hello-typescript
   zed .
   ```

2. **Before starting work:**
   ```bash
   pnpm check    # Ensure code is clean
   pnpm test     # Run tests
   ```

3. **While coding:**
   - Save frequently - auto-format happens automatically
   - Check diagnostics panel for errors
   - Use Cmd+. (Ctrl+.) for quick fixes

4. **Before committing:**
   ```bash
   pnpm check    # Lint and format
   pnpm test     # Run tests
   pnpm build    # Verify builds
   ```

## Performance

Zed is incredibly fast! It's written in Rust and designed for performance.

**Tips for best performance:**
- Let Zed index the project on first open
- Use project-wide search for large searches
- Biome is 10-100x faster than ESLint+Prettier

## Collaboration

### Sharing Settings

The project settings in `.zed/settings.json` are committed to git, so your team gets the same configuration automatically.

### Team Members Using Different Editors

That's fine! The project also works with:
- VS Code (install Biome extension)
- WebStorm/IntelliJ (install Biome plugin)
- Vim/Neovim (use null-ls or similar)

Everyone gets the same formatting because it's defined in `biome.jsonc`.

## Remote Development

Zed supports remote development via SSH:

1. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "remote"
3. Select "Remote: Connect to Server"
4. Enter SSH details

Your local settings will sync to the remote environment.

## Updating Biome

Keep Biome up to date for bug fixes and new features:

```bash
pnpm update @biomejs/biome
```

Then restart Zed to use the new version.

## Resources

- **Zed Documentation**: https://zed.dev/docs
- **Zed Community**: https://zed.dev/community
- **Biome Documentation**: https://biomejs.dev/
- **This Project's Docs**: [LINTING_AND_FORMATTING.md](./LINTING_AND_FORMATTING.md)

## Common Questions

**Q: Do I need to install any Zed extensions?**  
A: No! Biome support is built into Zed.

**Q: Can I use Prettier or ESLint instead?**  
A: You can, but Biome is faster and simpler. It's already configured!

**Q: Will this work with my existing Zed settings?**  
A: Yes! Project settings in `.zed/settings.json` only apply to this project.

**Q: How do I disable format-on-save?**  
A: Edit `.zed/settings.json` and change `"format_on_save": "on"` to `"format_on_save": "off"`.

**Q: Can I customize the formatting rules?**  
A: Yes! Edit `biome.jsonc` to change formatting and linting rules.

---

**Happy coding with Zed!** ⚡

If you have issues, check [LINTING_AND_FORMATTING.md](./LINTING_AND_FORMATTING.md) for detailed troubleshooting.
