# Named realms bounded context (DDD)

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.1.0      |
| **Last updated** | 2026-07-09 |

Variable-size **named realms** (one-word place names like Summerchurch) that span biomes, plus the shared **worldNotifications** HUD slot for first discovery.

## Docs in this folder

| File | Purpose |
| ---- | ------- |
| [glossary.md](./glossary.md) | Ubiquitous language |
| [mechanics.md](./mechanics.md) | Discovery loop and realm generation |
| [catalog.md](./catalog.md) | Titles, sizing, code touchpoints |

## DDD map

### Bounded context

**Named realms** — geographic landmasses independent of biome kind. HUD shows the place name alone (`Welcome to Summerchurch`). One realm can cover plains, forest, desert, and more. Size varies (small: a few biome cells; large: many). First entry fades the realm name in worldNotifications.

Touches **Codex explored biomes** (kind-level progress stays separate) and **HUD layout**. Does not own climate or biome classification.

### Aggregates

| Aggregate | Root | Responsibility |
| --------- | ---- | -------------- |
| **Discovered realm set** | localStorage + module store | Which realm ids the player has entered |
| **World notification queue** | module store | Ordered banners for the shared HUD slot |

### Declarative registries

| Registry | File |
| -------- | ---- |
| Display name (place only) | `definingWorldPlazaNamedRealmTitleRegistry.ts` |
| Place names | `500_village_names.txt` via `definingWorldPlazaNamedRealmNameCatalog.ts` |
| Size / lattice | `definingWorldPlazaNamedRealmConstants.ts` |

## How to extend

1. Add titles in the title registry.
2. Extend or replace the village name asset.
3. Tune lattice spacing and size weights in constants.
4. Keep `doc-triggers.json` watch paths in sync.
