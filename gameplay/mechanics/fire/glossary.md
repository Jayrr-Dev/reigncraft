# Fire glossary (ubiquitous language)

Terms for wildfire, campfires, fuel, and fire cells.

## Core concepts

| Term | Meaning |
| ---- | ------- |
| **Fire cell** | One burning tile in Redis (online) or local store (SP): position, kind, fuel, intensity. |
| **Cell kind** | `spreading` (wildfire on flammable material) or `campfire` (utility campfire block). |
| **Ignite** | Start a new fire cell. Costs flint (spread) or wood (campfire light). |
| **Refuel** | Add wood to an existing lit campfire or SP ground fire. Extends `fuelRemainingMs`. |
| **Spread tick** | Server lazy sim every **2000 ms**; adjacent flammable tiles may catch fire. |
| **Flammability** | Per-material **0..1** multiplier on spread roll. |

## Interaction terms

| Term | Meaning |
| ---- | ------- |
| **Interaction radius** | **2** Chebyshev tiles from player to target tile (ignite/refuel). |
| **Flint mode** | `mode: 'flint'` — ignite flammable **placed block** or grass (SP flow). |
| **Campfire mode** | `mode: 'campfire'` — light `utility:campfire` block with **1 wood**. |
| **Equipment gate** | Flint in inventory for spread ignite; wood for campfire light/refuel. |

## Fuel terms

| Term | Meaning |
| ---- | ------- |
| **Fuel wood** | `basic:floor:wood`, `functional:door:wooden`, `functional:sign:wooden` within **2** tiles of campfire (not on campfire tile itself). |
| **Small fuel tier** | **1–3** total wood: **180_000 ms** (3 min) per wood. |
| **Big fuel tier** | **4+** total wood: **60_000 ms** (1 min) per wood. |
| **Max fuel** | **1_200_000 ms** (20 min) stored cap. |
| **Inventory fuel wood count** | Wood consumed at light/refuel; drives flame sprite tier with placed wood. |
| **Fuel dimming** | Flame scale and light soften as `fuelRemainingMs / initialFuelMs` drops. |

## Burn tier (visual)

| Tier | Nearby placed wood | Light radius scale | Brightness |
| ---- | ------------------ | ------------------ | ---------- |
| **weak** | 0 | 0.62 | 0.32 |
| **small** | 1–2 | 0.95 | 0.55 |
| **mid** | 3 | 1.35 | 0.82 |
| **big** | 4+ | 2.2 | 1.0 |

## Spread terms

| Term | Meaning |
| ---- | ------- |
| **Spread base chance** | **0.15** per tick × neighbor `flammability`. |
| **Burn duration** | Per-material ms the spreading cell lasts (e.g. grass **8000**, wood floor **12000**). |
| **Burnt metadata** | Blocks/grass marked burnt after fire passes; fuel wood excluded if `isBurnt`. |

## Render terms

| Term | Meaning |
| ---- | ------- |
| **Fire glow radius** | **56** world-local px warm core |
| **Max visible glows** | **24** per frame (viewport cap) |
| **Campfire flame base scale** | **0.58** (sheets authored large) |
| **Flame intensity tier** | Sprite sheet tier **1–5** from effective wood count |

## Persistence modes

| Term | Meaning |
| ---- | ------- |
| **Online room** | Fire cells in Redis; all players poll `/api/world-fire/cells`. |
| **Single-player local** | `managingWorldPlazaLocalFireCells` when `onlineUserId` is null. |

## Code prefixes

| Prefix | Role |
| ------ | ---- |
| `WORLD_FIRE_DEVVIT_*` | Shared spread/API constants |
| `WORLD_CAMPFIRE_*` | Fuel duration and burn tiers |
| `igniting*` / `adding*` | API and local cell mutations |
| `computingWorldCampfire*` | Fuel math and intensity |
| `countingWorldCampfire*` | Nearby fuel wood |
| `usingWorldPlaza*` | React hooks for ignite/refuel/poll |

## Anti-patterns

| Don't say | Say instead |
| --------- | ----------- |
| "Cooking fire" | **Lit campfire cell** (fire) vs **cook timer** ([cooking-campfire](../cooking-campfire/)) |
| "Flint + wood to light" | Flint for **spread**; **wood only** for **campfire** light |
| "Fire warmth radius" | **72°C** on campfire **tile**; neighbor warming via [environment](../environment/) average |
