# Harvest glossary (ubiquitous language)

Terms for tree chopping, wood yield, and chop persistence.

## Core concepts

| Term                       | Meaning                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| **Chop swing**             | Timed hold interaction; on complete, removes up to **3** visual trunk layers. |
| **Visual layer**           | One vertical slice of the drawn tree column; tall trees have more layers.     |
| **Standing surface layer** | World layer the player stands on; trunk cannot chop below this floor.         |
| **Choppable layers**       | `remainingVisualLayer − standingSurfaceLayer`.                                |
| **Stump**                  | Tree fully felled; `isStump: true`, short trunk mesh (**14 px** height).      |

## Yield and timing

| Term                    | Meaning                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| **Wood per layer**      | **2** wood granted per layer removed.                                  |
| **Layers per swing**    | **3** max removed per completed swing.                                 |
| **Base swing duration** | **500 ms** before layer scaling.                                       |
| **Per-layer duration**  | **+75 ms** per remaining choppable layer (taller = longer next swing). |

## Range and targeting

| Term                      | Meaning                                                         |
| ------------------------- | --------------------------------------------------------------- |
| **Player range**          | **2** Chebyshev tiles from player position to tree tile center. |
| **Pointer hit radius**    | **0.85** tiles minimum around trunk foot.                       |
| **Canopy hit multiplier** | **1.08** × painted canopy footprint for crown clicks.           |
| **Candidate search**      | **3** tile radius around pointer + **2** extra around player.   |
| **Trunk hit padding**     | **8** screen px padded around trunk silhouette.                 |

## Equipment and gates

| Term                  | Meaning                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Axe gate**          | `equipment.checkingEquippedToolKind('axe')` required to start chop.                |
| **Progress icon**     | `game-icons:wood-axe` on timed interaction ring.                                   |
| **Held item overlay** | 8-direction tool sprite drawn on the avatar for the equipped tool.                 |
| **Direction pose**    | Per-facing hand offset, carry tilt, and behind-avatar flag for the overlay.        |
| **Behind-avatar row** | Facing-away directions (UpRight, Up, UpLeft) where the tool draws behind the body. |

## Persistence

| Term                    | Meaning                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| **Tile key**            | `"tileX,tileY"` for chop state maps.                                  |
| **localStorage prefix** | `world-plaza-chopped-trees` (SP / offline owner).                     |
| **Redis chop**          | Online room persists via `worldHarvest` API when Reddit user present. |
| **Persistence owner**   | `redditUserId` online or `localPersistenceOwnerId` offline.           |

## Outcomes

| Term               | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| **eligible**       | In range, not stump, layers remain above standing layer.   |
| **out-of-range**   | Player farther than **2** tiles.                           |
| **already-felled** | Stump or no choppable layers left.                         |
| **chopped**        | Mutation success; returns `woodQuantity`, `layersRemoved`. |

## Code prefixes

| Prefix                                          | Role                       |
| ----------------------------------------------- | -------------------------- |
| `definingWorldPlazaTreeChop*`                   | Client constants           |
| `WORLD_TREE_CHOP_*`                             | Shared server/client rules |
| `checkingWorldTreeChop*`                        | Eligibility                |
| `computingWorldTreeChop*`                       | Mutation math              |
| `choppingWorldPlaza*` / `choppingWorldHarvest*` | Apply chop                 |
| `managingWorldPlazaLocalChoppedTrees`           | SP state store             |

## Anti-patterns

| Don't say      | Say instead                           |
| -------------- | ------------------------------------- |
| "Tree HP"      | **Visual layers** remaining           |
| "Instant chop" | **Timed swing** with duration scaling |
| "Any tool"     | **Axe equipped** gate                 |
