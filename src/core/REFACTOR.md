# Core Folder Refactor

`src/core` provides foundational utilities used by the parser and runtime. As part of the monorepo transition:

1. Relocate this folder to `packages/spw-compiler/src/core` via `git mv`.
2. Update any import paths referencing `src/core` accordingly.
