# <Context name> bounded context (DDD)

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.0.0      |
| **Last updated** | YYYY-MM-DD |

Replace `<Context name>` with the player-facing feature name (e.g. Hunger, Combat).

## Docs in this folder

| File | Purpose |
| ---- | ------- |
| [glossary.md](./glossary.md) | Ubiquitous language |
| [mechanics.md](./mechanics.md) | Player loop and runtime pipeline |
| [catalog.md](./catalog.md) | Optional: every registry entry and code touchpoints |

## DDD map

### Bounded context

**<What this context owns>**

### Aggregates

| Aggregate | Root | Responsibility |
| --------- | ---- | -------------- |
| | | |

### Declarative registries

| Registry | File |
| -------- | ---- |
| | `src/client/world/.../defining*.ts` |

## How to extend

1. Add data to the `defining*` registry.
2. Wire application entry (eat, tick, input, etc.) if new source.
3. Update `catalog.md` and `glossary.md` if new terms appear.
4. Add or update row in [`../doc-triggers.json`](../doc-triggers.json).
