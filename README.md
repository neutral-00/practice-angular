# PracticeAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Add Tailwind CSS to Angular Project (Angular 21+)

### Reference

> https://angular.dev/guide/tailwind

```sh
ng add tailwindcss
```

## Switch from CSS to SCSS

**Short answer:** Yes, you can switch your Angular project from plain CSS to SCSS even with TailwindCSS configured. Tailwind and SCSS don’t conflict — Tailwind is processed via PostCSS, while SCSS is compiled by Angular’s build pipeline. The latest guidance shows they work together smoothly if you configure imports correctly.

---

## 🔎 Step‑by‑Step: Switching to SCSS with TailwindCSS

### 1. Change Angular project style to SCSS

- Update `angular.json`:
  ```json
  "styles": [
    "src/styles.scss"
  ]
  ```
- Rename `src/styles.css` → `src/styles.scss`.
- If you want component styles in SCSS, run:
  ```sh
  ng config schematics.@schematics/angular:component.style scss
  ```
  This ensures new components use `.scss`.
- In `src/styles.scss`, import Tailwind:

  ```scss
  @use 'tailwindcss';

  // Your custom SCSS after Tailwind
  body {
    font-family: sans-serif;
  }
  ```

  > ⚠️ Note: Tailwind v4 deprecated `@import "tailwindcss";` in SCSS. Use `@use "tailwindcss";` instead.

---

## ⚠️ Risks & Trade‑offs

- **Import order matters**: Always load Tailwind first (`@use "tailwindcss";`) then your SCSS overrides.
- **@apply limitations**: Tailwind’s `@apply` works in SCSS, but avoid applying responsive variants (`sm:`, `md:`) inside SCSS — use them directly in templates.
- **Build performance**: SCSS + Tailwind adds compilation steps, but Angular CLI handles them efficiently.

---

## generate a card componet to test tailwind css

Let's generate a card component with inline template and inline style

```sh
ng g c component/card --skip-tests -t -s
```

update it as:

```ts

```

## Vs Code Extension Setup

- https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
- https://marketplace.visualstudio.com/items?itemName=prettier.prettier-vscode

```sh
pnpm add -D prettier-plugin-tailwindcss
```

create `.prettierrc`

```
{
    "plugins": ["prettier-plugin-tailwindcssS"]
}
```

Update vs code setting

- set formatter to prettier
  ![setting](image.png)

## ✅ Recommendation

- Switch your global styles to SCSS (`styles.scss`).
- Use `@use "tailwindcss";` at the top of `styles.scss`.
- Keep component styles in SCSS for nesting/variables, and use Tailwind utilities in templates.
