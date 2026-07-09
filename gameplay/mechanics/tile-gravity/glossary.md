# Tile gravity well — glossary

Terms used consistently across code, docs, and caller sites for plaza gravity wells.

| Term                         | Meaning                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **Gravity well**             | Declarative attractor config: point, acceleration, radius, falloff, settle, optional max speed.   |
| **Attractor**                | Grid-space point the well pulls toward (usually a tile diamond at `(tileX, tileY)`).              |
| **Acceleration**             | Pull strength in **grid / s²**. Positive pulls in; negative repels.                               |
| **Radius**                   | Distance beyond which the well applies **zero** acceleration.                                     |
| **Falloff**                  | How strength drops with distance: `none`, `linear`, or `inverseSquare`.                           |
| **Settle radius**            | Soft fade near the attractor so movers do not jitter on the exact point.                          |
| **Strength ratio**           | 0..1 after falloff × settle; scales acceleration.                                                 |
| **Carried gravity velocity** | Optional `{x,y}` grid/s state kept across ticks so pull builds like real gravity.                 |
| **Grid delta**               | Position change for one tick (`velocity * deltaSeconds`) to add onto walk/run/steering.           |
| **Intentional movement**     | Player WASD/click-walk, wildlife steering, projectile launch velocity. Gravity never replaces it. |
| **`gravityPull`**            | Projectile movement behavior that integrates the shared well utility toward `targetPoint`.        |
