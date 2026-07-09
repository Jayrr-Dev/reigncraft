# Tile gravity well — catalog

Every default knob, shipped projectile archetype, and code touchpoint.

## Shared utility defaults

| Constant                             | Value    | File                                            |
| ------------------------------------ | -------- | ----------------------------------------------- |
| `DEFAULT_RADIUS_GRID`                | **4**    | `definingWorldPlazaTileGravityWellConstants.ts` |
| `DEFAULT_ACCELERATION_GRID_PER_SEC2` | **1.8**  | same                                            |
| `DEFAULT_SETTLE_RADIUS_GRID`         | **0.12** | same                                            |
| `DEFAULT_MAX_SPEED_GRID_PER_SEC`     | **4.5**  | same                                            |

## Factories

| Helper                                             | Use when                                                     |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `creatingWorldPlazaTileGravityWellFromTile`        | Pull toward a tile diamond `(tileX, tileY)`                  |
| `creatingWorldPlazaTileGravityWellFromPoint`       | Pull toward any grid point (projectile target, entity, etc.) |
| `resolvingWorldPlazaTileGravityWellAttractorPoint` | Resolve tile index → attractor world point                   |

## Pure steppers

| Helper                                              | Returns                                           |
| --------------------------------------------------- | ------------------------------------------------- |
| `computingWorldPlazaTileGravityWellAcceleration`    | `{ accelerationX/Y, strengthRatio, … }`           |
| `computingWorldPlazaTileGravityWellVelocityStep`    | Next `{x,y}` velocity after `a * dt`              |
| `computingWorldPlazaTileGravityWellGridDelta`       | `{ gridDelta, nextVelocity }` for position movers |
| `computingWorldPlazaTileGravityWellAccelerationSum` | Summed acceleration from many wells               |

## Projectile `gravityPull`

| Field on `movement`              | Role                                  |
| -------------------------------- | ------------------------------------- |
| `behaviorId: 'gravityPull'`      | Selects gravity stepper               |
| `speedGridPerSec`                | Launch speed (initial velocity)       |
| `gravityAccelerationGridPerSec2` | Well acceleration override            |
| `gravityRadiusGrid`              | Well radius override                  |
| `gravityFalloff`                 | `none` \| `linear` \| `inverseSquare` |
| `gravitySettleRadiusGrid`        | Settle fade override                  |
| `gravityMaxSpeedGridPerSec`      | Speed clamp override                  |

### Shipped archetype: `gravity-well-bolt`

| Field                | Value                     |
| -------------------- | ------------------------- |
| Launch speed         | **5** grid/s              |
| Gravity acceleration | **4** grid/s²             |
| Gravity radius       | **10** grid               |
| Falloff              | `linear`                  |
| Max speed            | **11** grid/s             |
| Live track           | **no** (frozen spawn aim) |
| Damage               | **16** physical           |
| Lifetime             | **5s**                    |

### Shipped archetype: `gravity-ball` (dev chase)

| Field                | Value                                      |
| -------------------- | ------------------------------------------ |
| Launch speed         | **3.5** grid/s                             |
| Gravity acceleration | **5.5** grid/s²                            |
| Gravity radius       | **14** grid                                |
| Falloff              | `linear`                                   |
| Max speed            | **9** grid/s                               |
| Live track           | **yes** (`tracksLiveTarget`)               |
| Jump dodge           | **no**                                     |
| Damage               | **20** physical                            |
| Lifetime             | **8s**                                     |
| Visual               | `projectile-gravity-ball`, tint `0x3d8bff` |

Dev panel: Combat → Projectiles → **gravity-ball**. Run after spawn to see it curve after you.

**Where added**

| Layer               | File                                                                                              |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Types               | `definingWorldPlazaTileGravityWellTypes.ts`                                                       |
| Constants           | `definingWorldPlazaTileGravityWellConstants.ts`                                                   |
| Acceleration        | `computingWorldPlazaTileGravityWellAcceleration.ts`                                               |
| Step / delta        | `computingWorldPlazaTileGravityWellStep.ts`                                                       |
| Factories           | `creatingWorldPlazaTileGravityWell.ts`                                                            |
| Live aim            | `resolvingWorldPlazaProjectileAimPoint.ts`                                                        |
| Projectile behavior | `definingWorldPlazaProjectileMovementBehaviorRegistry.ts`                                         |
| Projectile defaults | `definingWorldPlazaProjectileConstants.ts`                                                        |
| Example archetypes  | `definingWorldPlazaProjectileArchetypeRegistry.ts`                                                |
| Tests               | `computingWorldPlazaTileGravityWellStep.test.ts`, `resolvingWorldPlazaProjectileAimPoint.test.ts` |

## Checklist: apply a well to a new mover

1. [ ] Create well via tile or point factory
2. [ ] Each tick call velocity step **or** grid delta
3. [ ] Compose with intentional movement (add, do not replace)
4. [ ] Keep collision / hazard after compose
5. [ ] Carry `nextVelocity` across ticks if you want accumulating pull
6. [ ] Update this catalog if you ship a new default archetype or world well
