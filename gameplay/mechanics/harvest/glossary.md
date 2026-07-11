# Harvest glossary (ubiquitous language)

Terms for tree chopping, rock mining, floor-pebble picking, wood/stone yield, and harvest persistence.

## Core concepts

| Term                         | Meaning                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chop swing**               | Timed hold interaction; on complete, removes up to **3** visual trunk layers.                                                                                                                                                                                                                  |
| **Visual layer**             | One vertical slice of the drawn tree column; tall trees have more layers.                                                                                                                                                                                                                      |
| **Standing surface layer**   | World layer the player stands on; trunk cannot chop below this floor.                                                                                                                                                                                                                          |
| **Choppable layers**         | `remainingVisualLayer − standingSurfaceLayer`.                                                                                                                                                                                                                                                 |
| **Stump**                    | Tree fully felled; `isStump: true`, short trunk mesh (**14 px** height).                                                                                                                                                                                                                       |
| **Mine swing**               | Timed hold on a mega-boulder; on complete, removes up to **3** rock layers.                                                                                                                                                                                                                    |
| **Mineable layers**          | `remainingVisualLayer − ground layer` on a column rock.                                                                                                                                                                                                                                        |
| **Depleted rock**            | Boulder fully mined; `isDepleted: true`, column mesh and collision gone.                                                                                                                                                                                                                       |
| **Rock anchor**              | Spacing-cell origin tile for a multi-tile boulder footprint.                                                                                                                                                                                                                                   |
| **Pick**                     | Timed hold on a floor pebble (`surfaceWorldLayer === null`); one-shot.                                                                                                                                                                                                                         |
| **Picked pebble**            | Floor stone removed; `isPicked: true`, decoration hidden.                                                                                                                                                                                                                                      |
| **Procedural trees & rocks** | Feature flag (default **off**). When **off**, open-world tree and stone/column-rock resolvers return null; no Graphics bake, no chop/mine targets from procedural props. Placed player trees stay. Features panel toggle; `localStorage` key `world-plaza-procedural-trees-and-rocks-enabled`. |

## Yield and timing

| Term                    | Meaning                                            |
| ----------------------- | -------------------------------------------------- |
| **Wood per layer**      | **2** wood granted per tree layer removed.         |
| **Stone per layer**     | **2** stone granted per rock layer removed.        |
| **Pebble stone**        | **1** stone granted per completed pick.            |
| **Layers per swing**    | **3** max removed per completed chop/mine swing.   |
| **Base swing duration** | **500 ms** before layer scaling (chop/mine).       |
| **Per-layer duration**  | **+75 ms** per remaining choppable/mineable layer. |
| **Pick duration**       | Fixed **350 ms** (no layer scaling).               |

## Range and targeting

| Term                      | Meaning                                                                                 |
| ------------------------- | --------------------------------------------------------------------------------------- |
| **Player range**          | **2** Chebyshev tiles from player to tree/pebble tile center (rocks: footprint center). |
| **Pointer hit radius**    | Tree **0.85**; rock **1.2**; pebble **0.6** tiles.                                      |
| **Canopy hit multiplier** | **1.08** × painted canopy footprint for crown clicks.                                   |
| **Candidate search**      | Tree **3**; rock **4**; pebble **2** tile radius around pointer.                        |
| **Trunk hit padding**     | **8** screen px padded around trunk silhouette.                                         |

## Equipment and gates

| Term                     | Meaning                                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Axe gate**             | Soft for trees today (speed/durability); docs treat axe as the chop tool.                                                               |
| **Pickaxe gate**         | Hard: `checkingEquippedToolKind('pickaxe')` required to start mine.                                                                     |
| **Pebble tool gate**     | None; bare hands.                                                                                                                       |
| **Progress icon**        | Tree: `game-icons:wood-axe`. Rock mine: `game-icons:war-pick`. Pebble: `game-icons:stone-pile`.                                         |
| **Inventory tool icons** | Pixel PNGs via Vite `?url` in `definingWorldPlazaToolInventoryIconConstants.ts` (`assets/tools-icons/`). Scythe still Iconify.          |
| **Held item overlay**    | 8-direction tool sprite on the avatar for the equipped tool. **Off** while `DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED` is `false`. |
| **Direction pose**       | Per-facing hand offset, carry tilt, and behind-avatar flag for the overlay.                                                             |
| **Behind-avatar row**    | Facing-away directions (UpRight, Up, UpLeft) where the tool draws behind the body.                                                      |
| **Swing move set**       | Per-facing keyframe track played over the carry pose during a tool action.                                                              |
| **Swing keyframe**       | Exact phase (0..1) pinning a rotation offset and hand drift on the swing track.                                                         |
| **Swing cycle**          | One windup-strike-recover loop; **520 ms** for the chop arc, loops until done.                                                          |

## Audio (harvest impact SFX)

| Term                        | Meaning                                                                                                                                                                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Impact milestone**        | Timed-interaction pulse: `start`, `mid`, or `final`. Each pulse plays one material hit clip during a swing.                                                                                                                               |
| **Equipment SFX pool**      | Rotating FilmCow clip set per tool action (`tree-chop`, `rock-mine`, `pebble-pick`).                                                                                                                                                      |
| **Plaza star-audio bus**    | Single shared `star-audio` instance for all plaza SFX hooks; harvest acquires/releases a consumer ref on mount/unmount. Same bus serves avatar footsteps, wildlife vocals, wildlife footsteps, and biome ambience.                        |
| **SFX play helper**         | `playingWorldPlazaStarAudioSfx` — equipment impacts play on the shared SFX group (replaces raw `starAudio.play(..., { group: 'sfx' })` in the equipment hook).                                                                            |
| **Manifest dedupe preload** | Equipment clips preload once per manifest key on the shared bus; world boot and later hooks skip keys already warmed.                                                                                                                     |
| **Final swing boost**       | `final` milestone volume × **1.12** before the SFX volume slider.                                                                                                                                                                         |
| **SFX volume slider**       | Settings mixer control; scales harvest impacts with other plaza SFX (not music volume).                                                                                                                                                   |
| **Audio unlock bus**        | First pointer/key gesture unlocks every plaza SFX hook, including harvest impacts.                                                                                                                                                        |
| **Inventory add SFX**       | FilmCow strap tighten on successful pebble stone grant (`strap-tighten-03.ogg`); shared with all plaza inventory adds via `notifyingWorldPlazaInventoryItemAdded`. Tree/rock grants use ground drops; strap plays on later ground pickup. |

## Persistence

| Term                    | Meaning                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Tile key**            | `"tileX,tileY"` for chop, mine, and pick state maps (mine keys are anchors).                                 |
| **localStorage prefix** | Trees: `world-plaza-chopped-trees`. Rocks: `world-plaza-mined-rocks`. Pebbles: `world-plaza-picked-pebbles`. |
| **Redis harvest**       | Online room via `worldHarvest` (`chopped-trees` / `mined-rocks` / `picked-pebbles`).                         |
| **Persistence owner**   | `redditUserId` online or `localPersistenceOwnerId` offline.                                                  |

## Outcomes

| Term                 | Meaning                                                         |
| -------------------- | --------------------------------------------------------------- |
| **eligible**         | In range, not stump/depleted/picked, layers remain when needed. |
| **out-of-range**     | Player farther than **2** tiles.                                |
| **already-felled**   | Stump or no choppable layers left.                              |
| **chopped**          | Tree mutation success; `woodQuantity`, `layersRemoved`.         |
| **already-depleted** | Rock gone or no mineable layers left.                           |
| **mined**            | Rock mutation success; `stoneQuantity`, `layersRemoved`.        |
| **already-picked**   | Pebble already removed.                                         |
| **picked**           | Pebble mutation success; `stoneQuantity` (**1**).               |

## Code prefixes

| Prefix                                                                         | Role                                    |
| ------------------------------------------------------------------------------ | --------------------------------------- |
| `definingWorldPlazaTreeChop*` / `RockMine*` / `PebblePick*`                    | Client constants                        |
| `WORLD_TREE_CHOP_*` / `WORLD_ROCK_MINE_*` / `WORLD_PEBBLE_PICK_*`              | Shared rules                            |
| `checkingWorldTreeChop*` / `RockMine*` / `PebblePick*`                         | Eligibility                             |
| `computingWorldTreeChop*` / `RockMine*` / `PebblePick*`                        | Mutation math                           |
| `chopping*` / `mining*` / `picking*`                                           | Apply harvest                           |
| `managingWorldPlazaLocalChoppedTrees` / `MinedRocks` / `PickedPebbles`         | SP state stores                         |
| `definingWorldPlazaEquipmentSfx*` / `playingWorldPlazaEquipmentSfx`            | FilmCow harvest impacts                 |
| `playingWorldPlazaStarAudioSfx`                                                | Shared SFX-group play (equipment hook)  |
| `definingWorldPlazaInventoryBagSfx*` / `notifyingWorldPlazaInventoryItemAdded` | Pebble pick inventory add strap tighten |
| `managingWorldPlazaStarAudio*` / `preloadingWorldPlazaWorldBootStarAudio`      | Shared plaza audio bus                  |

## Anti-patterns

| Don't say      | Say instead                                                       |
| -------------- | ----------------------------------------------------------------- |
| "Tree HP"      | **Visual layers** remaining                                       |
| "Instant chop" | **Timed swing** with duration scaling                             |
| "Any tool"     | **Axe** (trees), **pickaxe** (rocks), or **bare hands** (pebbles) |
