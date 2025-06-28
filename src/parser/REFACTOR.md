# Parser Folder Refactor

`src/parser` holds all parser constructs and tests. When moving to a package:

1. Move this folder to `packages/spw-compiler/src/parser` with `git mv`.
2. Keep test files under `packages/spw-compiler/src/parser/tests`.
3. Ensure relative imports inside parser modules still resolve after the move.
