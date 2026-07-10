# Fishing bounded context (DDD)

|                  |                                      |
| ---------------- | ------------------------------------ |
| **Version**      | 1.0.1                                |
| **Last updated** | 2026-07-10 (catch inventory add SFX) |

## Docs in this folder

| File                           | Purpose                                |
| ------------------------------ | -------------------------------------- |
| [glossary.md](./glossary.md)   | Ubiquitous language                    |
| [mechanics.md](./mechanics.md) | Player loop and runtime pipeline       |
| [catalog.md](./catalog.md)     | Constants, items, and code touchpoints |

## DDD map

### Bounded context

**Casting a line on adjacent liquid water, channeling a timed catch, and granting raw fish food.**

### Aggregates

| Aggregate        | Root                | Responsibility                             |
| ---------------- | ------------------- | ------------------------------------------ |
| Fishing cast     | Selected water tile | Eligibility, channel duration, catch grant |
| Equipped fishrod | Hotbar slot         | Tool gate, tier speed, durability wear     |

### Declarative registries

| Registry          | File                                                                        |
| ----------------- | --------------------------------------------------------------------------- |
| Fishing constants | `src/client/world/fishing/domains/definingWorldPlazaFishingConstants.ts`    |
| Tool tier stats   | `src/client/world/equipment/domains/definingWorldPlazaToolTierConstants.ts` |

## How to extend

1. Add catch table rows or tier timings in `definingWorldPlazaFishingConstants.ts`.
2. Wire eligibility in `checkingWorldPlazaFishingCastEligibility.ts`.
3. Update `catalog.md` and register `gameplay/doc-triggers.json` if new items appear.
