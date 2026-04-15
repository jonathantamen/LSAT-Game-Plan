Learnings from this task:
- Always ensure the correct package manager (`pnpm`) is used in CI workflows if the project strictly enforces it (via `pnpm-lock.yaml`).
- Vite and Rollup's strict static imports will fail the build if a module like `../firebase-applet-config.json` doesn't exist, even if `npm ci` was run without errors. Changing to `pnpm install` in the CI environments resolved the module resolution mismatch.
- Remember to configure `resolveJsonModule: true` in `tsconfig.json` for Vite setups using typescript where json is imported directly.
