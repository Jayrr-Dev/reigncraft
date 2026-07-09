# Gameplay documentation

Player-facing mechanics docs for Reigncraft plaza. Organized by **bounded context** (DDD). Checked into git and kept in sync when code extends a feature.

**Master map:** [DOMAIN-MAP.md](./DOMAIN-MAP.md)

## Why this folder exists

| Layer | Path | Audience |
| ----- | ---- | -------- |
| **Gameplay** | `gameplay/` | Designers, contributors, agents: what the player experiences |
| **Memory** | `memory/` | AI quick refs: tuning numbers and engine file paths |
| **Code** | `src/client/world/` | Implementation |

## Folder layout (per bounded context)

```
gameplay/mechanics/<context>/
  README.md       — DDD map: aggregates, domain services, code entry points
  glossary.md     — Ubiquitous language
  mechanics.md    — What happens in play + runtime pipeline
  catalog.md      — Optional: every entity/entry and code touchpoints
```

Copy from [`_template/`](./_template/) when creating a new context.

## Subdomain index

### Shared kernel

| Context | Folder | Status |
| ------- | ------ | ------ |
| In-game time | [shared/in-game-time.md](./shared/in-game-time.md) | Done |

### Survival

| Context | Folder | Status |
| ------- | ------ | ------ |
| Hunger | [mechanics/hunger/](./mechanics/hunger/) | **Complete** |
| Disease | [mechanics/disease/](./mechanics/disease/) | **Complete** |
| Inventory / food | [mechanics/inventory-food/](./mechanics/inventory-food/) | **Complete** |
| Buffs | [mechanics/buffs/](./mechanics/buffs/) | **Complete** |

### Combat

| Context | Folder | Status |
| ------- | ------ | ------ |
| Combat | [mechanics/combat/](./mechanics/combat/) | **Complete** |
| Movement / stamina | [mechanics/movement-stamina/](./mechanics/movement-stamina/) | **Complete** |
| Characters | [mechanics/characters/](./mechanics/characters/) | **Complete** |

### Ecology

| Context | Folder | Status |
| ------- | ------ | ------ |
| Wildlife | [mechanics/wildlife/](./mechanics/wildlife/) | **Complete** |
| Cooking / campfire | [mechanics/cooking-campfire/](./mechanics/cooking-campfire/) | **Complete** |

### World

| Context | Folder | Status |
| ------- | ------ | ------ |
| Day / night | [mechanics/day-night/](./mechanics/day-night/) | **Complete** |
| Environment | [mechanics/environment/](./mechanics/environment/) | **Complete** |
| Fire | [mechanics/fire/](./mechanics/fire/) | **Complete** |
| Harvest | [mechanics/harvest/](./mechanics/harvest/) | **Complete** |
| Building | [mechanics/building/](./mechanics/building/) | **Complete** |

### Social

| Context | Folder | Status |
| ------- | ------ | ------ |
| Multiplayer | [mechanics/multiplayer/](./mechanics/multiplayer/) | **Complete** |

See [mechanics/README.md](./mechanics/README.md) for a flat index.

## Automation

| File | Role |
| ---- | ---- |
| [`doc-triggers.json`](./doc-triggers.json) | Code paths → doc folders; `playerFacingGuides` + per-trigger `relatedGuides` |
| `.cursor/hooks/check-gameplay-doc-drift.mjs` | On agent `stop`, diffs git and requests doc + Guide sync if drift |
| `.cursor/rules/gameplay-docs.mdc` | Agent rule: extend feature → update gameplay docs + Guide surfaces |

### Player-facing Guide companions

When a mechanic trigger fires, the stop hook also lists related Guide surfaces (Controls, Mechanics, Biomes, Bestiary). Update those files if the change is player-visible there, or mark N/A if not.

## Doc style

- Use tables and mermaid for flows where helpful.
- Link to real file paths under `src/client/`.
- Point engine wiring to [memory/game-engines-reference.md](../memory/game-engines-reference.md).
