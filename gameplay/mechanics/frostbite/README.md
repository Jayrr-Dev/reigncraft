# Frostbite bounded context (DDD)

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.0.0      |
| **Last updated** | 2026-07-09 |

## Docs in this folder

| File | Purpose |
| ---- | ------- |
| [glossary.md](./glossary.md) | Ubiquitous language |
| [mechanics.md](./mechanics.md) | Player loop and runtime pipeline |
| [catalog.md](./catalog.md) | Stages, constants, code touchpoints |

## DDD map

### Bounded context

Frostbite stack progression from environmental cold damage ticks: stages, warm decay, percent frost damage, and stage debuffs.

### Aggregates

| Aggregate | Root | Responsibility |
| --------- | ---- | -------------- |
| Frostbite meter | `frostbite` on entity health | Stack count, active stage, sleep-spell progress |
| Stage effects | Scoped buff instance ids | Movement, stamina, outgoing damage, heal block |

### Declarative registries

| Registry | File |
| -------- | ---- |
| Stage thresholds | `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry.ts` |
| Tunables | `src/client/world/health/domains/definingWorldPlazaEntityFrostbiteConstants.ts` |
| Stage debuffs | `src/client/world/health/domains/definingWorldPlazaEntityBuffRegistry.ts` |

## How to extend

1. Edit stage rows or constants in the `defining*` modules.
2. Add or adjust hide-from-HUD buffs linked from `buffIds`.
3. Update `catalog.md` and `glossary.md`.
4. Keep `gameplay/doc-triggers.json` watch paths in sync.
