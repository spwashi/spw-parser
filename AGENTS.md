# Repository Guidelines

This project contains the Spw parser and is being refactored into a monorepo.

## Development
- Use Node 18 or newer.
- Prefer 2-space indentation for JavaScript and TypeScript files.
- Source files use ESM with `.mts` or `.ts` extensions.
- Preserve git history by using `git mv` when relocating files.
- Record refactor notes in `docs/refactor/` or in a `REFACTOR.md` inside the affected folder.

## Testing
Run these commands before committing:

```sh
npm run build
node public/js/parser/tests/test.mjs
```
