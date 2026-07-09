# Harvest catalog

Tree chop constants, shared rules, and code touchpoints.

**Sources of truth:**

- `src/client/world/harvest/domains/definingWorldPlazaTreeChopConstants.ts`
- `src/shared/worldTreeChop.ts`

## Yield and swing constants

| Constant | Value | Effect |
| -------- | ----- | ------ |
| `TREE_CHOP_WOOD_PER_LAYER` | **2** | Wood per layer removed |
| `TREE_CHOP_LAYERS_PER_SWING` | **3** | Max layers per completed swing |
| `TREE_CHOP_BASE_DURATION_MS` | **500** | Base timed interaction |
| `TREE_CHOP_DURATION_PER_REMAINING_LAYER_MS` | **75** | Added per choppable layer |
| `TREE_CHOP_PLAYER_RANGE_TILES` | **2** | Chebyshev reach |

Client aliases mirror shared names in `definingWorldPlazaTreeChopConstants.ts`.

## Pointer and search constants

| Constant | Value |
| -------- | ----- |
| `TREE_CHOP_POINTER_HIT_RADIUS_TILES` | **0.85** |
| `TREE_CHOP_TRUNK_POINTER_HIT_PADDING_PX` | **8** |
| `TREE_CHOP_CANOPY_POINTER_HIT_RADIUS_MULTIPLIER` | **1.08** |
| `TREE_CHOP_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES` | **3** |
| `TREE_CHOP_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES` | **2** |

## Stump visuals

| Constant | Value |
| -------- | ----- |
| `TREE_STUMP_HEIGHT_PX` | **14** |
| `TREE_STUMP_WIDTH_MULTIPLIER` | **1.35** |

## Persistence

| Constant | Value |
| -------- | ----- |
| `CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX` | `world-plaza-chopped-trees` |

## Timed interaction UI

| Constant | Value |
| -------- | ----- |
| `TREE_CHOP_TIMED_INTERACTION_PROGRESS_ICON` | `game-icons:wood-axe` |

File: `definingWorldPlazaTreeChopTimedInteractionConstants.ts`

## Shared types

### `WorldTreeChopTileState`

| Field | Type | Meaning |
| ----- | ---- | ------- |
| `remainingVisualLayer` | number | Layers left on trunk |
| `isStump` | boolean | Fully felled |

### Mutation result (`chopped`)

| Field | Meaning |
| ----- | ------- |
| `layersRemoved` | 1..3 |
| `woodQuantity` | `layersRemoved × 2` |
| `isFullyFelled` | Stump transition |

## Application files

| Concern | File |
| ------- | ---- |
| Constants | `definingWorldPlazaTreeChopConstants.ts` |
| Shared rules | `worldTreeChop.ts` |
| Chop hook | `usingWorldPlazaTreeChopInteraction.ts` |
| Local state | `managingWorldPlazaLocalChoppedTrees.ts` |
| Chopped query | `usingWorldPlazaChoppedTrees.ts` |
| Online API | `callingWorldHarvestDevvitApi.ts` |
| Server route | `src/server/routes/worldHarvest.ts` |
| Axe gate | `renderingWorldPlazaPixiScene.tsx` |
| Tree labels | `renderingWorldPlazaTreeInteractionLabels.tsx` |
| Trees in range | `listingWorldPlazaTreesInInteractionRange.ts` |

## Wood output

| layersRemoved | woodQuantity |
| ------------- | ------------ |
| 1 | **2** |
| 2 | **4** |
| 3 | **6** |

## Checklist: tune chop economy

1. [ ] Edit `WORLD_TREE_CHOP_*` in `worldTreeChop.ts` (server authority)
2. [ ] Mirror in `definingWorldPlazaTreeChopConstants.ts` if client-only constants differ
3. [ ] Update swing duration feel in timed interaction resolver
4. [ ] Update this catalog and [mechanics.md](./mechanics.md)
5. [ ] Cross-check [fire](../fire/) tree flammability if chop-to-fuel loops matter
