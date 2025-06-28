# Runtime Folder Refactor

`src/runtime` implements environment-specific runtime helpers.

Steps:
1. Move this folder to `packages/spw-compiler/src/runtime` using `git mv`.
2. Verify that any imports from runtime to parser or core still work after relocation.
