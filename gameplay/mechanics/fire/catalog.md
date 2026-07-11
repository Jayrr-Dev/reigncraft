# Fire catalog

Spread constants, campfire fuel, flammable materials, and code touchpoints.

**Sources of truth:**

- `src/shared/worldFireDevvit.ts`
- `src/shared/worldCampfireFuel.ts`
- `src/client/world/fire/domains/definingWorldPlazaFireConstants.ts`
- `src/client/world/fire/domains/definingWorldPlazaCampfireAmbienceConstants.ts`
- `src/client/world/fire/domains/definingWorldPlazaLavaAmbienceConstants.ts`
- `src/client/world/domains/definingWorldPlazaFirelandsBiomeConstants.ts` (procedural Firelands layout)

## Firelands procedural constants

Scaled by `DEFINING_WORLD_PLAZA_BIOME_WORLD_LINEAR_SCALE` (**4**). Source: `definingWorldPlazaFirelandsBiomeConstants.ts`.

| Constant                                                          | Value (scale 4) | Effect                                             |
| ----------------------------------------------------------------- | --------------- | -------------------------------------------------- |
| `DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_GRID`       | **3000** tiles  | No Firelands near spawn                            |
| `DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_FREQUENCY`             | **1 / 1040**    | Large volcanic landmass gate                       |
| `DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD`             | **0.65**        | Hot-dry tile becomes Firelands                     |
| `DEFINING_WORLD_PLAZA_FIRELANDS_AMBIENT_TEMPERATURE_CELSIUS`      | **62**          | Ambient floor (see [environment](../environment/)) |
| `DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_CELL_TILES`     | **192**         | Volcano / ruin anchor grid                         |
| `DEFINING_WORLD_PLAZA_FIRELANDS_STRUCTURE_SPACING_ANCHOR_TILE`    | **96**          | Anchor within each structure cell                  |
| `DEFINING_WORLD_PLAZA_FIRELANDS_LAVA_TILE_NOISE_THRESHOLD`        | **0.72**        | Lava density inside Firelands                      |
| `DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_SMALL_SPACING_CELL_TILES` | **3**           | Small scatter grid (lava plants)                   |
| `DEFINING_WORLD_PLAZA_FIRELANDS_SCATTER_LARGE_SPACING_CELL_TILES` | **4**           | Large scatter grid (mini-volcanoes)                |

### Firelands scatter props (open ground)

Source: `resolvingWorldPlazaFirelandsPropAtTileIndex.ts` (open-ground scatter only; ruin blueprints are separate).

| Spacing band | Prop kind      | Blocks movement  | Notes                                    |
| ------------ | -------------- | ---------------- | ---------------------------------------- |
| Large cell   | `mini_volcano` | yes (radius 0.6) | Was mixed with `lava_tree` (removed)     |
| Small cell   | `lava_plant`   | no               | Was mixed with `volcanic_rock` (removed) |

`lava_tree` and `volcanic_rock` remain valid prop kinds for display-scale helpers / type unions, but open-ground scatter no longer rolls them. Procedural column rocks and pebbles are also suppressed in Firelands (`resolvingWorldPlazaStoneDecorationAtTileIndex.ts` / column-rock resolvers).

Ignite, spread, and campfire constants in this catalog are **unchanged** by world scale.

## Spread and API constants

| Constant                                     | Value             | Effect                        |
| -------------------------------------------- | ----------------- | ----------------------------- |
| `WORLD_FIRE_DEVVIT_TICK_MS`                  | **2000**          | Lazy spread sim interval      |
| `WORLD_FIRE_DEVVIT_SPREAD_BASE_CHANCE`       | **0.15**          | × flammability per neighbor   |
| `WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES` | **2**             | Ignite/refuel Chebyshev range |
| `WORLD_FIRE_DEVVIT_CELLS_POLL_INTERVAL_MS`   | **1500**          | Client cells poll             |
| `WORLD_FIRE_DEVVIT_API_BASE_PATH`            | `/api/world-fire` | Route root                    |
| `WORLD_FIRE_DEVVIT_CELLS_API_PATH`           | `.../cells`       | List cells                    |
| `WORLD_FIRE_DEVVIT_IGNITE_API_PATH`          | `.../ignite`      | Start fire                    |
| `WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH`        | `.../add-fuel`    | Campfire refuel               |

## Inventory item ids

| Constant                                           | Value               |
| -------------------------------------------------- | ------------------- |
| `WORLD_FIRE_DEVVIT_FLINT_ITEM_TYPE_ID`             | `world-plaza-flint` |
| `WORLD_FIRE_DEVVIT_WOOD_ITEM_TYPE_ID`              | `world-plaza-wood`  |
| `WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID`   | `utility:campfire`  |
| `WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID` | `basic:floor:wood`  |
| `WORLD_FIRE_DEVVIT_GRASS_SURFACE_DEFINITION_ID`    | `surface:grass`     |

## Campfire fuel constants

| Constant                                      | Value         | Effect                                         |
| --------------------------------------------- | ------------- | ---------------------------------------------- |
| `WORLD_CAMPFIRE_FUEL_RADIUS_TILES`            | **2**         | Chebyshev wood scan (matches fire interaction) |
| `WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_SMALL_TIER`  | **180_000**   | 3 min/wood when total < 4                      |
| `WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_BIG_TIER`    | **60_000**    | 1 min/wood when total ≥ 4                      |
| `WORLD_CAMPFIRE_FUEL_BIG_TIER_MIN_WOOD_COUNT` | **4**         | Tier breakpoint                                |
| `WORLD_CAMPFIRE_FUEL_MAX_MS`                  | **1_200_000** | 20 min cap                                     |
| `WORLD_CAMPFIRE_FLAME_BASE_DISPLAY_SCALE`     | **0.58**      | Sprite scale vs spreading fire                 |

## Burn tier tables

### Light radius scale

| Tier  | Scale    |
| ----- | -------- |
| weak  | **0.62** |
| small | **0.95** |
| mid   | **1.35** |
| big   | **2.2**  |

### Light brightness

| Tier  | Brightness |
| ----- | ---------- |
| weak  | **0.32**   |
| small | **0.55**   |
| mid   | **0.82**   |
| big   | **1.0**    |

### Flame scale multiplier

| Tier  | Multiplier |
| ----- | ---------- |
| weak  | **0.55**   |
| small | **0.68**   |
| mid   | **0.82**   |
| big   | **0.95**   |

## Flammable materials

| definitionId              | Flammability | burnDurationMs |
| ------------------------- | ------------ | -------------- |
| `surface:grass`           | **0.32**     | **8000**       |
| `basic:floor:wood`        | **0.35**     | **12000**      |
| `functional:door:wooden`  | **0.40**     | **15000**      |
| `functional:sign:wooden`  | **0.45**     | **8000**       |
| `natural:tree:oak`        | **0.25**     | **20000**      |
| `decorative:flower:patch` | **0.50**     | **5000**       |
| `utility:campfire`        | **0**        | **0**          |

Fuel wood definitions (not flammability roll): `basic:floor:wood`, `functional:door:wooden`, `functional:sign:wooden`.

## Fire cell shape

| Field                          | Type                    | Notes               |
| ------------------------------ | ----------------------- | ------------------- |
| `tileX`, `tileY`, `worldLayer` | number                  | Tile position       |
| `kind`                         | `spreading \| campfire` | Sim behavior        |
| `ignitedAtMs`                  | number                  | Wall clock          |
| `fuelRemainingMs`              | number                  | Counts down         |
| `initialFuelMs`                | number                  | For dimming ratio   |
| `inventoryFuelWoodCount`       | number?                 | Campfire flame tier |
| `intensity`                    | number                  | 0..1 render         |

## Render constants

| Constant                                               | Value    |
| ------------------------------------------------------ | -------- |
| `DEFINING_WORLD_PLAZA_FIRE_GLOW_RADIUS_WORLD_LOCAL_PX` | **56**   |
| `DEFINING_WORLD_PLAZA_FIRE_GLOW_WARM_CORE_ALPHA`       | **0.62** |
| `DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT`     | **24**   |

### Fire layer render tick (engine)

Source: `renderingWorldPlazaFireLayer.tsx`.

| Behavior            | Detail                                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| Visible cells       | Capped by `DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT` via `filteringWorldPlazaFireLayerCells`        |
| Visual pool         | `fireVisualPoolRef`: one pooled root per tile key; create on new cell, destroy when cell leaves visible set |
| Active key set      | `activeFireTileKeysRef`: cleared and refilled each safe tick (avoids per-frame `Set` allocation)            |
| Tick registration   | `usingWorldPlazaSafeTick(..., 'tick:fire')` via `invokingWorldPlazaLoopBodySafely`                          |
| Tick error handling | Logged to client debug error lines; other plaza subsystems keep running                                     |
| Player impact       | **None** — same flames, glow, depth sort, and light sync as before                                          |

## Campfire ambience constants

Source: `definingWorldPlazaCampfireAmbienceConstants.ts`.

| Constant                                                               | Value    | Effect                              |
| ---------------------------------------------------------------------- | -------- | ----------------------------------- |
| `DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_TARGET_VOLUME`             | **0.42** | Base loop gain before falloff       |
| `DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID` | **2**    | Full volume within this grid radius |
| `DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID` | **14**   | Silent beyond this grid radius      |
| `DEFINING_WORLD_PLAZA_CAMPFIRE_AMBIENCE_POLL_INTERVAL_MS`              | **150**  | Player vs fire-cell poll            |

### Shipped ambience clips

| Clip id   | File          | Public path                      |
| --------- | ------------- | -------------------------------- |
| `bonfire` | `bonfire.ogg` | `/fire/sfx/campfire/bonfire.ogg` |

Star-audio manifest prefix: `campfire-ambience.{clipId}`.

### Campfire ambience playback (hook)

Source: `usingWorldPlazaCampfireAmbience.ts`.

| Behavior              | Detail                                                                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preload               | `buildingWorldPlazaCampfireAmbienceStarAudioManifest` via shared `preloadingWorldPlazaStarAudioManifest`                                                         |
| Volume resolver       | `computingWorldPlazaCampfireAmbienceEffectiveVolume` → `computingWorldPlazaSfxEffectiveVolume` (base × falloff × optional clip multiplier × **Ambience volume**) |
| In-range updates      | `updatingWorldPlazaStarAudioActiveSfxPlayVolume(loopHandle, volume)` every **150 ms** poll                                                                       |
| Loop start            | `playingWorldPlazaStarAudioSfx(..., { loop: true, volume })` only when `loopHandleRef` is null and volume **> 0**                                                |
| Loop stop             | `loopHandle.stop()` when volume **≤ 0** or hook unmounts                                                                                                         |
| No per-tick restart   | Does **not** re-`play` when `playing` flickers false (prevents choppy crackle)                                                                                   |
| Shared star-audio bus | `acquiringWorldPlazaStarAudio` / `releasingWorldPlazaStarAudio`                                                                                                  |

## Lava ambience constants

Source: `definingWorldPlazaLavaAmbienceConstants.ts`.

| Constant                                                           | Value    | Effect                              |
| ------------------------------------------------------------------ | -------- | ----------------------------------- |
| `DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_TARGET_VOLUME`             | **0.36** | Base loop gain before falloff       |
| `DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_FULL_VOLUME_DISTANCE_GRID` | **1.5**  | Full volume within this grid radius |
| `DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SFX_MAX_AUDIBLE_DISTANCE_GRID` | **12**   | Silent beyond this grid radius      |
| `DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_SCAN_RADIUS_TILES`             | **12**   | Square tile scan around player      |
| `DEFINING_WORLD_PLAZA_LAVA_AMBIENCE_POLL_INTERVAL_MS`              | **150**  | Player vs lava-tile poll            |

### Shipped lava ambience clips

| Clip id   | File          | Public path                      |
| --------- | ------------- | -------------------------------- |
| `crackle` | `bonfire.ogg` | `/fire/sfx/campfire/bonfire.ogg` |

Star-audio manifest prefix: `lava-ambience.{clipId}`.

### Lava ambience playback (hook)

Source: `usingWorldPlazaLavaAmbience.ts`.

| Behavior              | Detail                                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lava detection        | `checkingWorldPlazaLavaAtTileIndex` inside scan window (`resolvingWorldPlazaLavaAmbienceNearPlayer`)                                                         |
| Preload               | `buildingWorldPlazaLavaAmbienceStarAudioManifest` via shared `preloadingWorldPlazaStarAudioManifest`                                                         |
| Volume resolver       | `computingWorldPlazaLavaAmbienceEffectiveVolume` → `computingWorldPlazaSfxEffectiveVolume` (base × falloff × optional clip multiplier × **Ambience volume**) |
| In-range updates      | `updatingWorldPlazaStarAudioActiveSfxPlayVolume(loopHandle, volume)` every **150 ms** poll                                                                   |
| Loop start            | `playingWorldPlazaStarAudioSfx(..., { loop: true, volume })` only when `loopHandleRef` is null and volume **> 0**                                            |
| Loop stop             | `loopHandle.stop()` when volume **≤ 0** or hook unmounts                                                                                                     |
| Shared star-audio bus | `acquiringWorldPlazaStarAudio` / `releasingWorldPlazaStarAudio`                                                                                              |

## Application entry files

| Concern                                    | File                                                                                                                                            |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Flint / SP ground ignite (secondary click) | `usingWorldPlazaFlintIgnitionAttempt.ts`                                                                                                        |
| Pointer wiring                             | `renderingWorldPlazaPixiScene.tsx` (skips campfire block; calls flint hook)                                                                     |
| Campfire UI actions                        | `usingWorldPlazaCampfireInteraction.ts`                                                                                                         |
| Local SP cells                             | `managingWorldPlazaLocalFireCells.ts`                                                                                                           |
| API client                                 | `callingWorldFireDevvitApi.ts`                                                                                                                  |
| Cells query                                | `usingWorldPlazaFireCells.ts`                                                                                                                   |
| Fire layer render                          | `renderingWorldPlazaFireLayer.tsx` (`usingWorldPlazaSafeTick`, `tick:fire`)                                                                     |
| Campfire ambience loop                     | `usingWorldPlazaCampfireAmbience.ts`, `renderingWorldPlazaCampfireAmbience.tsx`                                                                 |
| Lava ambience loop                         | `usingWorldPlazaLavaAmbience.ts`, `renderingWorldPlazaLavaAmbience.tsx`                                                                         |
| Lava tile check                            | `checkingWorldPlazaLavaAtTileIndex.ts`                                                                                                          |
| Ambience volume / falloff                  | `computingWorldPlazaCampfireAmbienceEffectiveVolume.ts`, `computingWorldPlazaSfxEffectiveVolume.ts`, `managingWorldPlazaAmbienceVolumeStore.ts` |
| Shared SFX play / live volume              | `playingWorldPlazaStarAudioSfx`, `updatingWorldPlazaStarAudioActiveSfxPlayVolume` (`managingWorldPlazaStarAudio.ts`)                            |
| Ambience source point                      | `resolvingWorldPlazaCampfireAmbienceSourcePointFromCell.ts`                                                                                     |
| Ignite/refuel toasts                       | `showingReigncraftToast.ts` (plaza toaster above minimap)                                                                                       |
| Server routes                              | `src/server/routes/worldFire.ts`                                                                                                                |
| Firelands biome placement                  | `definingWorldPlazaFirelandsBiomeConstants.ts` + `resolvingWorldPlazaBiomeAtTileIndex.ts`                                                       |
| Firelands open-ground props                | `resolvingWorldPlazaFirelandsPropAtTileIndex.ts`                                                                                                |

## Player-facing Guide / tutorial sync

When ignite rules, range, or costs change, also check:

| Surface                     | File / section                                                                         | This session                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Controls / tutorial         | `definingPlazaTutorialConstants.ts`                                                    | **N/A** — fire layer tick wrapped in `usingWorldPlazaSafeTick`; no new inputs or ignite/refuel rule change |
| Mechanics Guide (World tab) | `definingPlazaMechanicsConstants.ts` → `DEFINING_PLAZA_MECHANICS_WORLD_SECTIONS`       | **N/A** — ignite/spread/campfire rules unchanged                                                           |
| Biomes Guide                | `definingPlazaBiomesGuideConstants.ts`, `definingPlazaBiomesGuideForagingConstants.ts` | **N/A** — no biome or foraging rule change this session                                                    |
| Bestiary                    | —                                                                                      | **N/A**                                                                                                    |

## Player-facing toast copy (flint hook)

Exact strings from `usingWorldPlazaFlintIgnitionAttempt.ts`:

| Copy                                 | When                           |
| ------------------------------------ | ------------------------------ |
| `You need wood to fuel the fire.`    | SP refuel, no wood             |
| `Move closer to the fire.`           | SP refuel out of range         |
| `Added wood to the fire.`            | SP refuel ok                   |
| `Move closer to start a fire there.` | SP ignite out of range         |
| `Move closer to ignite that block.`  | Online ignite out of range     |
| `That material is not flammable.`    | Online, flammability ≤ 0       |
| `Fire started.`                      | Online ignite ok               |
| `Could not ignite fire.`             | Online ignite catch (fallback) |

## Tests

| File                                                     | Coverage                    |
| -------------------------------------------------------- | --------------------------- |
| `computingWorldFireSimulationTick.test.ts`               | Spread tick behavior        |
| `computingWorldPlazaLavaAmbienceEffectiveVolume.test.ts` | Lava falloff + manifest ids |

## Checklist: add flammable material

1. [ ] Add row to `WORLD_FIRE_DEVVIT_MATERIAL_PROPERTIES`
2. [ ] If counts as campfire fuel, add to `WORLD_CAMPFIRE_FUEL_WOOD_BLOCK_DEFINITION_IDS`
3. [ ] Update this catalog and [glossary.md](./glossary.md)
4. [ ] Server + client preview both read the shared map
