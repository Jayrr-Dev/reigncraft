# Harvest catalog

Tree chop constants, shared rules, and code touchpoints.

**Sources of truth:**

- `src/client/world/harvest/domains/definingWorldPlazaTreeChopConstants.ts`
- `src/shared/worldTreeChop.ts`

## Yield and swing constants

| Constant                                    | Value   | Effect                         |
| ------------------------------------------- | ------- | ------------------------------ |
| `TREE_CHOP_WOOD_PER_LAYER`                  | **2**   | Wood per layer removed         |
| `TREE_CHOP_LAYERS_PER_SWING`                | **3**   | Max layers per completed swing |
| `TREE_CHOP_BASE_DURATION_MS`                | **500** | Base timed interaction         |
| `TREE_CHOP_DURATION_PER_REMAINING_LAYER_MS` | **75**  | Added per choppable layer      |
| `TREE_CHOP_PLAYER_RANGE_TILES`              | **2**   | Chebyshev reach                |

Client aliases mirror shared names in `definingWorldPlazaTreeChopConstants.ts`.

## Pointer and search constants

| Constant                                               | Value    |
| ------------------------------------------------------ | -------- |
| `TREE_CHOP_POINTER_HIT_RADIUS_TILES`                   | **0.85** |
| `TREE_CHOP_TRUNK_POINTER_HIT_PADDING_PX`               | **8**    |
| `TREE_CHOP_CANOPY_POINTER_HIT_RADIUS_MULTIPLIER`       | **1.08** |
| `TREE_CHOP_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES` | **3**    |
| `TREE_CHOP_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES`   | **2**    |

## Stump visuals

| Constant                      | Value    |
| ----------------------------- | -------- |
| `TREE_STUMP_HEIGHT_PX`        | **14**   |
| `TREE_STUMP_WIDTH_MULTIPLIER` | **1.35** |

## Persistence

| Constant                                 | Value                       |
| ---------------------------------------- | --------------------------- |
| `CHOPPED_TREES_LOCAL_STORAGE_KEY_PREFIX` | `world-plaza-chopped-trees` |

## Timed interaction UI

| Constant                                    | Value                 |
| ------------------------------------------- | --------------------- |
| `TREE_CHOP_TIMED_INTERACTION_PROGRESS_ICON` | `game-icons:wood-axe` |

File: `definingWorldPlazaTreeChopTimedInteractionConstants.ts`

## Shared types

### `WorldTreeChopTileState`

| Field                  | Type    | Meaning              |
| ---------------------- | ------- | -------------------- |
| `remainingVisualLayer` | number  | Layers left on trunk |
| `isStump`              | boolean | Fully felled         |

### Mutation result (`chopped`)

| Field           | Meaning             |
| --------------- | ------------------- |
| `layersRemoved` | 1..3                |
| `woodQuantity`  | `layersRemoved × 2` |
| `isFullyFelled` | Stump transition    |

## Application files

| Concern        | File                                           |
| -------------- | ---------------------------------------------- |
| Constants      | `definingWorldPlazaTreeChopConstants.ts`       |
| Shared rules   | `worldTreeChop.ts`                             |
| Chop hook      | `usingWorldPlazaTreeChopInteraction.ts`        |
| Local state    | `managingWorldPlazaLocalChoppedTrees.ts`       |
| Chopped query  | `usingWorldPlazaChoppedTrees.ts`               |
| Online API     | `callingWorldHarvestDevvitApi.ts`              |
| Server route   | `src/server/routes/worldHarvest.ts`            |
| Axe gate       | `renderingWorldPlazaPixiScene.tsx`             |
| Tree labels    | `renderingWorldPlazaTreeInteractionLabels.tsx` |
| Trees in range | `listingWorldPlazaTreesInInteractionRange.ts`  |

## Held tool overlay presentation

Equipped tools (axe, sword, hoe, scythe, fishing rod) render as an 8-direction
sprite overlay on the avatar. Registry:
`src/client/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry.ts`.

### Shared defaults

| Constant              | Value          | Effect                                |
| --------------------- | -------------- | ------------------------------------- |
| `anchorX` / `anchorY` | **0.5 / 0.82** | Grip point near sprite bottom-center  |
| `scaleMultiplier`     | **5.5**        | Base scale vs avatar sprite scale     |
| `zIndexOffset`        | **1**          | In front of avatar unless facing away |
| Texture filtering     | nearest        | Crisp pixel art at large scale        |

### Per-visual overrides

| visualId  | offsetScreenPx (X, Y) | scaleMultiplier |
| --------- | --------------------- | --------------- |
| `sword`   | 0, 0                  | 5.5             |
| `axe`     | 0, +2                 | 5.5             |
| `hoe`     | 0, +2                 | 5.5             |
| `scythe`  | 0, −2                 | **6**           |
| `fishrod` | +2, +4                | **5**           |

### Direction pose table

`DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_POSE` gives each of the 8 facings a
hand offset (avatar-frame px, multiplied by effective sprite scale), a carry
tilt, and whether the tool draws behind the avatar body. Right-handed carry:
screen-right when facing the camera, mirrored when facing left or away.

| Facing    | Offset X | Offset Y | Behind avatar | Tilt (rad) |
| --------- | -------- | -------- | ------------- | ---------- |
| Down      | +17      | +18      | no            | +0.32      |
| DownRight | +21      | +14      | no            | +0.45      |
| Right     | +23      | +10      | no            | +0.55      |
| UpRight   | +15      | +6       | **yes**       | +0.45      |
| Up        | −15      | +6       | **yes**       | −0.32      |
| UpLeft    | −15      | +6       | **yes**       | −0.45      |
| Left      | −23      | +10      | no            | −0.55      |
| DownLeft  | −21      | +14      | no            | −0.45      |

Applier: `applyingWorldPlazaHeldItemPresentationToSprite.ts` combines the
per-visual screen offset with the facing pose, flips `zIndex` negative for
behind-avatar rows, and sets sprite rotation to the pose tilt.

## Wood output

| layersRemoved | woodQuantity |
| ------------- | ------------ |
| 1             | **2**        |
| 2             | **4**        |
| 3             | **6**        |

## Checklist: tune chop economy

1. [ ] Edit `WORLD_TREE_CHOP_*` in `worldTreeChop.ts` (server authority)
2. [ ] Mirror in `definingWorldPlazaTreeChopConstants.ts` if client-only constants differ
3. [ ] Update swing duration feel in timed interaction resolver
4. [ ] Update this catalog and [mechanics.md](./mechanics.md)
5. [ ] Cross-check [fire](../fire/) tree flammability if chop-to-fuel loops matter
