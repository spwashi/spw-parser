# Source Folder Refactor

The current `src/` directory contains parser, core, and runtime code. During the monorepo transition these modules will move into `packages`.

Steps:
1. Create `packages/spw-compiler` and copy the existing `src/` tree into `packages/spw-compiler/src` using `git mv`.
2. Update import paths to match the new package locations.
3. Adjust `tsconfig.json` paths so builds succeed.
