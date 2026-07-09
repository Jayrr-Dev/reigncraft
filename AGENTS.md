You are writing a Devvit web application that will be executed on Reddit.com.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Vite
- **Backend**: Node.js v22 serverless environment (Devvit), Hono, TRPC
- **Communication**: tRPC v11 for end-to-end type safety

## Layout & Architecture

- `/src/server`: **Backend Code**. This runs in a secure, serverless environment.
  - `trpc.ts`: Defines the API router and procedures.
  - `index.ts`: Main server entry point (Hono app).
  - Access `redis`, `reddit`, and `context` here via `@devvit/web/server`.
- `/src/client`: **Frontend Code**. This is executed inside of an iFrame on reddit.com
  - To add an entrypoint, create a HTML file and add to the mapping inside of `devvit.json`
  - Entrypoints:
    - `game.html`: The main React entry point (Expanded View).
    - `splash.html`: The initial React entry point (Inline View). This will be shown in the reddit.com feed. Please keep it fast and keep heavy dependencies inside of `game.html`
- `/src/shared`: **Shared Code**. Code to share between the client and server

### Game engines (plaza world)

When changing world gameplay, combat, terrain sync, collision, depth, inventory, or related Pixi systems, **read `memory/game-engines-reference.md` first**. It maps all engines, entry hooks, registries, and common task → file paths. The main integration point is `src/client/world/components/renderingWorldPlazaPixiScene.tsx`.

### Lore and narrative content

When working on lore, narrative, flavor text, item descriptions, NPC dialogue, or codex content, **read `memory/lore-canon-reference.md` first**. It holds the settled canon (the world is Corpus, Manus, the ladder, the Twelve Apostles, factions, Soulcore semantics), the canonical term list, and the writing style rules. The full world bible lives under `lore/`; check `lore/meta/open-questions.md` before answering any open mystery in shipped copy.

## Frontend

### Icons

- Prefer [Iconify](https://iconify.design/) via `Icon` from `@/components/ui/icon` for new UI work.
- Browse sets at [iconify.design](https://iconify.design/) and pass icons as `prefix:name` (e.g. `mdi:home`, `ph:users-three`, `solar:gamepad-bold`).
- Pick icons from varied sets (Material Design Icons, Phosphor, Solar, etc.) instead of defaulting to Lucide.
- **Register every new Iconify icon** in `src/client/components/ui/registeringBundledIconifyIcons.ts` — Devvit blocks Iconify CDN fetches at runtime.
- `lucide-react` remains in the project for existing code; migrate to Iconify when touching a file, but avoid drive-by refactors.

### Rules

- Instead of `window.location` or `window.assign`, use `navigateTo` from `@devvit/web/client`

### Limitations

- `window.alert`: Use `showToast` or `showForm` from `@devvit/web/client`
- File downloads: Use clipboard API with `showToast` to confirm
- Geolocation, camera, microphone, and notifications web APIs: No alternatives
- Inline script tags inside of `html` files: Use a script tag and separate js/ts file

## Commands

- `npm run type-check`: Check typescript types
- `npm run lint`: Check the linter
- `npm run test -- my-file-name`: Run tests isolated to a file

## Code Style

- Prefer type aliases over interfaces when writing typescript
- Prefer named exports over default exports
- Never cast typescript types
- **Prefer declarative code** when possible: put config and behavior trees in `defining*` modules, resolve them with pure `resolving*` / `computing*` / `checking*` helpers, and keep `rendering*` components and `using*` hooks thin. Use registries and typed layout objects instead of long imperative `if/else` or `switch` chains. See `.cursor/rules/declarative-code.mdc` for the full convention.

## Global Rules

- You may find code that references blocks or `@devvit/public-api` while building a feature. Do NOT use this code as this project is configured to use Devvit web only.
- Whenever you add an endpoint for a new menu item action, ensure that you've added the corresponding mapping to `devvit.json` so that it is properly registered

Docs: https://developers.reddit.com/docs/llms.txt.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
