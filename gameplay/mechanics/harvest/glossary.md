# Harvest glossary (ubiquitous language)

Terms for tree chopping, rock mining, wood/stone yield, and harvest persistence.

## Core concepts

| Term                       | Meaning                                                                       |
| -------------------------- | ----------------------------------------------------------------------------- |
| **Chop swing**             | Timed hold interaction; on complete, removes up to **3** visual trunk layers. |
| **Visual layer**           | One vertical slice of the drawn tree column; tall trees have more layers.     |
| **Standing surface layer** | World layer the player stands on; trunk cannot chop below this floor.         |
| **Choppable layers**       | `remainingVisualLayer − standingSurfaceLayer`.                                |
| **Stump**                  | Tree fully felled; `isStump: true`, short trunk mesh (**14 px** height).      |
| **Mine swing**             | Timed hold on a mega-boulder; on complete, removes up to **3** rock layers.  |
| **Mineable layers**        | `remainingVisualLayer − ground layer` on a column rock.                      |
| **Depleted rock**          | Boulder fully mined; `isDepleted: true`, column mesh and collision gone.     |
| **Rock anchor**            | Spacing-cell origin tile for a multi-tile boulder footprint.                 |

## Yield and timing

| Term                    | Meaning                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| **Wood per layer**      | **2** wood granted per tree layer removed.                             |
| **Stone per layer**     | **2** stone granted per rock layer removed.                            |
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
| **Axe gate**          | Soft for trees today (speed/durability); docs treat axe as the chop tool.          |
| **Pickaxe gate**      | Hard: `checkingEquippedToolKind('pickaxe')` required to start mine.                |
| **Progress icon**     | Tree: `game-icons:wood-axe`. Rock: `game-icons:war-pick`.                          |
| **Held item overlay** | 8-direction tool sprite on the avatar for the equipped tool. **Off** while `DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED` is `false`. |
| **Direction pose**    | Per-facing hand offset, carry tilt, and behind-avatar flag for the overlay.        |
| **Behind-avatar row** | Facing-away directions (UpRight, Up, UpLeft) where the tool draws behind the body. |
| **Swing move set**    | Per-facing keyframe track played over the carry pose during a tool action.         |
| **Swing keyframe**    | Exact phase (0..1) pinning a rotation offset and hand drift on the swing track.    |
| **Swing cycle**       | One windup-strike-recover loop; **520 ms** for the chop arc, loops until done.     |

## Persistence

| Term                    | Meaning                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| **Tile key**            | `"tileX,tileY"` for chop and mine state maps (mine keys are anchors). |
| **localStorage prefix** | Trees: `world-plaza-chopped-trees`. Rocks: `world-plaza-mined-rocks`. |
| **Redis harvest**       | Online room via `worldHarvest` (`chopped-trees` / `mined-rocks`).     |
| **Persistence owner**   | `redditUserId` online or `localPersistenceOwnerId` offline.           |

## Outcomes

| Term               | Meaning                                                    |
| ------------------ | ---------------------------------------------------------- |
| **eligible**       | In range, not stump, layers remain above standing layer.   |
| **out-of-range**   | Player farther than **2** tiles.                           |
| **already-felled** | Stump or no choppable layers left.                         |
| **chopped**        | Tree mutation success; `woodQuantity`, `layersRemoved`.    |
| **already-depleted** | Rock gone or no mineable layers left.                    |
| **mined**          | Rock mutation success; `stoneQuantity`, `layersRemoved`.   |

## Code prefixes

| Prefix                                          | Role                       |
| ----------------------------------------------- | -------------------------- |
| `definingWorldPlazaTreeChop*` / `RockMine*`     | Client constants           |
| `WORLD_TREE_CHOP_*` / `WORLD_ROCK_MINE_*`       | Shared server/client rules |
| `checkingWorldTreeChop*` / `RockMine*`          | Eligibility                |
| `computingWorldTreeChop*` / `RockMine*`         | Mutation math              |
| `chopping*` / `mining*`                         | Apply harvest              |
| `managingWorldPlazaLocalChoppedTrees` / `MinedRocks` | SP state stores       |

## Anti-patterns

| Don't say      | Say instead                           |
| -------------- | ------------------------------------- |
| "Tree HP"      | **Visual layers** remaining           |
| "Instant chop" | **Timed swing** with duration scaling |
| "Any tool"     | **Axe** (trees) or **pickaxe** (rocks) |