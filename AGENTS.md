# Repository Guidelines

Whatever action you can do yourself, please do it by yourself. This includes starting apps and performing verification.

## Project Structure & Module Organization

This is a Vite React application. App source lives in `src/`, with the entry point in `src/main.jsx` and the main component in `src/App.jsx`. Component-specific styling currently lives in `src/App.css`, while global styles live in `src/index.css`. Static assets imported by React should go in `src/assets/`; files served directly from the site root, such as `favicon.svg` and `icons.svg`, belong in `public/`. Production build output is generated in `dist/` and is ignored by ESLint.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Vite dev server with hot module replacement.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally for verification.
- `npm run lint`: run ESLint across JavaScript and JSX files.

## Coding Style & Naming Conventions

Use modern ES modules and React function components. Follow the existing style: two-space indentation, single quotes, no semicolons, and JSX split across lines when props or children become long. Name React components in `PascalCase`, hooks and local variables in `camelCase`, and static assets with descriptive lowercase names such as `hero.png`. Keep imports grouped by external packages, local assets, then styles.

## Testing Guidelines

No test framework is configured yet. Before adding tests, choose a Vite-friendly setup such as Vitest with React Testing Library. Place tests near the code they cover using names like `App.test.jsx` or under a future `src/__tests__/` directory. Until automated tests exist, run `npm run lint` and `npm run build` before submitting changes.

## Commit & Pull Request Guidelines

This repository has no existing commit history, so use clear imperative commit messages such as `Add hero assets` or `Update Vite config`. Keep commits focused on one logical change. Pull requests should include a short summary, verification steps, linked issues when applicable, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips

Do not commit secrets, local environment files, or generated build output. Keep dependency updates intentional and verify them with `npm run lint` and `npm run build`.
