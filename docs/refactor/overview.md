# Refactor Overview

This project will become a monorepo managed by `pnpm`. Existing code under `src/` will be migrated into packages within `packages/`.

Key goals:
- Split parser, runtime, and tooling into their own packages.
- Maintain git history by using `git mv` when moving files.
- Keep builds working after each step.

Individual folders contain `REFACTOR.md` files with detailed steps.
