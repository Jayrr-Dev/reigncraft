# Tile gravity well bounded context (DDD)

|                  |            |
| ---------------- | ---------- |
| **Version**      | 1.0.0      |
| **Last updated** | 2026-07-09 |

Plaza **tile gravity wells** are a reusable pull (or push) toward a grid attractor. Movers keep their own walk/run/steering; gravity only adds acceleration so they can still fight the pull.

## Docs in this folder

| File                           | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| [glossary.md](./glossary.md)   | Ubiquitous language for wells, falloff, settle       |
| [mechanics.md](./mechanics.md) | How pull composes with intentional movement          |
| [catalog.md](./catalog.md)     | Defaults, projectile `gravityPull`, code touchpoints |

## DDD map

### Bounded context

**Plaza Tile Gravity Wells** — pure acceleration samples and velocity/position integration toward an attractor in grid space. Does not own player input, wildlife AI, or collision; callers compose the delta after their intent step.

Touches **Projectile** (`gravityPull` movement behavior), and can be wired into **player locomotion** or **wildlife** ticks later.

### Aggregates

| Aggregate                    | Root                                        | Responsibility                                              |
| ---------------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| **Gravity well**             | `DefiningWorldPlazaTileGravityWell`         | Attractor, acceleration, radius, falloff, settle, max speed |
| **Carried gravity velocity** | `DefiningWorldPlazaTileGravityWellVelocity` | Optional per-mover state so pull accumulates across ticks   |

### Domain services (pure)

| Service                     | File                                                  |
| --------------------------- | ----------------------------------------------------- |
| Acceleration sample         | `computingWorldPlazaTileGravityWellAcceleration.ts`   |
| Velocity / grid-delta step  | `computingWorldPlazaTileGravityWellStep.ts`           |
| Well factory (tile / point) | `creatingWorldPlazaTileGravityWell.ts`                |
| Tile attractor point        | `resolvingWorldPlazaTileGravityWellAttractorPoint.ts` |

### Application layer

| Use case                   | Entry                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Projectile gravity bolt    | `gravityPull` in `definingWorldPlazaProjectileMovementBehaviorRegistry.ts`         |
| Player / wildlife (future) | Add `computingWorldPlazaTileGravityWellGridDelta` to intent delta before collision |

### Declarative registries

| Registry                    | File                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| Default well knobs          | `definingWorldPlazaTileGravityWellConstants.ts`                           |
| Projectile gravity defaults | `definingWorldPlazaProjectileConstants.ts`                                |
| Example archetype           | `gravity-well-bolt` in `definingWorldPlazaProjectileArchetypeRegistry.ts` |

## How to extend

1. Build a well with `creatingWorldPlazaTileGravityWellFromTile` or `FromPoint`.
2. Each tick: either `computingWorldPlazaTileGravityWellVelocityStep` (velocity movers) or `computingWorldPlazaTileGravityWellGridDelta` (position movers).
3. Add the result to intentional movement; run collision after.
4. Update [catalog.md](./catalog.md) if you ship a new default well or archetype.
