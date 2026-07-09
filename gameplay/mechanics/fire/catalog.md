# Fire catalog

Spread constants, campfire fuel, flammable materials, and code touchpoints.

**Sources of truth:**

- `src/shared/worldFireDevvit.ts`
- `src/shared/worldCampfireFuel.ts`
- `src/client/world/fire/domains/definingWorldPlazaFireConstants.ts`

## Spread and API constants

| Constant | Value | Effect |
| -------- | ----- | ------ |
| `WORLD_FIRE_DEVVIT_TICK_MS` | **2000** | Lazy spread sim interval |
| `WORLD_FIRE_DEVVIT_SPREAD_BASE_CHANCE` | **0.15** | × flammability per neighbor |
| `WORLD_FIRE_DEVVIT_INTERACTION_RADIUS_TILES` | **2** | Ignite/refuel Chebyshev range |
| `WORLD_FIRE_DEVVIT_CELLS_POLL_INTERVAL_MS` | **1500** | Client cells poll |
| `WORLD_FIRE_DEVVIT_API_BASE_PATH` | `/api/world-fire` | Route root |
| `WORLD_FIRE_DEVVIT_CELLS_API_PATH` | `.../cells` | List cells |
| `WORLD_FIRE_DEVVIT_IGNITE_API_PATH` | `.../ignite` | Start fire |
| `WORLD_FIRE_DEVVIT_ADD_FUEL_API_PATH` | `.../add-fuel` | Campfire refuel |

## Inventory item ids

| Constant | Value |
| -------- | ----- |
| `WORLD_FIRE_DEVVIT_FLINT_ITEM_TYPE_ID` | `world-plaza-flint` |
| `WORLD_FIRE_DEVVIT_WOOD_ITEM_TYPE_ID` | `world-plaza-wood` |
| `WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID` | `utility:campfire` |
| `WORLD_FIRE_DEVVIT_WOOD_FLOOR_BLOCK_DEFINITION_ID` | `basic:floor:wood` |
| `WORLD_FIRE_DEVVIT_GRASS_SURFACE_DEFINITION_ID` | `surface:grass` |

## Campfire fuel constants

| Constant | Value | Effect |
| -------- | ----- | ------ |
| `WORLD_CAMPFIRE_FUEL_RADIUS_TILES` | **2** | Chebyshev wood scan (matches fire interaction) |
| `WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_SMALL_TIER` | **180_000** | 3 min/wood when total < 4 |
| `WORLD_CAMPFIRE_FUEL_MS_PER_WOOD_BIG_TIER` | **60_000** | 1 min/wood when total ≥ 4 |
| `WORLD_CAMPFIRE_FUEL_BIG_TIER_MIN_WOOD_COUNT` | **4** | Tier breakpoint |
| `WORLD_CAMPFIRE_FUEL_MAX_MS` | **1_200_000** | 20 min cap |
| `WORLD_CAMPFIRE_FLAME_BASE_DISPLAY_SCALE` | **0.58** | Sprite scale vs spreading fire |

## Burn tier tables

### Light radius scale

| Tier | Scale |
| ---- | ----- |
| weak | **0.62** |
| small | **0.95** |
| mid | **1.35** |
| big | **2.2** |

### Light brightness

| Tier | Brightness |
| ---- | ---------- |
| weak | **0.32** |
| small | **0.55** |
| mid | **0.82** |
| big | **1.0** |

### Flame scale multiplier

| Tier | Multiplier |
| ---- | ---------- |
| weak | **0.55** |
| small | **0.68** |
| mid | **0.82** |
| big | **0.95** |

## Flammable materials

| definitionId | Flammability | burnDurationMs |
| ------------ | ------------ | -------------- |
| `surface:grass` | **0.32** | **8000** |
| `basic:floor:wood` | **0.35** | **12000** |
| `functional:door:wooden` | **0.40** | **15000** |
| `functional:sign:wooden` | **0.45** | **8000** |
| `natural:tree:oak` | **0.25** | **20000** |
| `decorative:flower:patch` | **0.50** | **5000** |
| `utility:campfire` | **0** | **0** |

Fuel wood definitions (not flammability roll): `basic:floor:wood`, `functional:door:wooden`, `functional:sign:wooden`.

## Fire cell shape

| Field | Type | Notes |
| ----- | ---- | ----- |
| `tileX`, `tileY`, `worldLayer` | number | Tile position |
| `kind` | `spreading \| campfire` | Sim behavior |
| `ignitedAtMs` | number | Wall clock |
| `fuelRemainingMs` | number | Counts down |
| `initialFuelMs` | number | For dimming ratio |
| `inventoryFuelWoodCount` | number? | Campfire flame tier |
| `intensity` | number | 0..1 render |

## Render constants

| Constant | Value |
| -------- | ----- |
| `DEFINING_WORLD_PLAZA_FIRE_GLOW_RADIUS_WORLD_LOCAL_PX` | **56** |
| `DEFINING_WORLD_PLAZA_FIRE_GLOW_WARM_CORE_ALPHA` | **0.62** |
| `DEFINING_WORLD_PLAZA_FIRE_GLOW_MAX_VISIBLE_COUNT` | **24** |

## Application entry files

| Concern | File |
| ------- | ---- |
| Flint ignite | `usingWorldPlazaFlintIgnitionAttempt.ts` |
| Campfire UI actions | `usingWorldPlazaCampfireInteraction.ts` |
| Local SP cells | `managingWorldPlazaLocalFireCells.ts` |
| API client | `callingWorldFireDevvitApi.ts` |
| Cells query | `usingWorldPlazaFireCells.ts` |
| Fire layer render | `renderingWorldPlazaFireLayer.tsx` |
| Ignite/refuel toasts | `showingReigncraftToast.ts` (plaza toaster above minimap) |
| Server routes | `src/server/routes/worldFire.ts` |

## Player-facing toast copy (flint hook)

Exact strings from `usingWorldPlazaFlintIgnitionAttempt.ts`:

| Copy | When |
| ---- | ---- |
| `You need wood to fuel the fire.` | SP refuel, no wood |
| `Move closer to the fire.` | SP refuel out of range |
| `Added wood to the fire.` | SP refuel ok |
| `Move closer to start a fire there.` | SP ignite out of range |
| `Move closer to ignite that block.` | Online ignite out of range |
| `That material is not flammable.` | Online, flammability ≤ 0 |
| `Fire started.` | Online ignite ok |
| `Could not ignite fire.` | Online ignite catch (fallback) |

## Tests

| File | Coverage |
| ---- | -------- |
| `computingWorldFireSimulationTick.test.ts` | Spread tick behavior |

## Checklist: add flammable material

1. [ ] Add row to `WORLD_FIRE_DEVVIT_MATERIAL_PROPERTIES`
2. [ ] If counts as campfire fuel, add to `WORLD_CAMPFIRE_FUEL_WOOD_BLOCK_DEFINITION_IDS`
3. [ ] Update this catalog and [glossary.md](./glossary.md)
4. [ ] Server + client preview both read the shared map
