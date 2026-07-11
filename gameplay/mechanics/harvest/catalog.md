# Harvest catalog

Tree chop, rock mine, and pebble pick constants, shared rules, and code touchpoints.

**Sources of truth:**

- `src/client/world/harvest/domains/definingWorldPlazaTreeChopConstants.ts`
- `src/client/world/harvest/domains/definingWorldPlazaRockMineConstants.ts`
- `src/client/world/harvest/domains/definingWorldPlazaPebblePickConstants.ts`
- `src/shared/worldTreeChop.ts`
- `src/shared/worldRockMine.ts`
- `src/shared/worldPebblePick.ts`
- `src/client/world/equipment/domains/definingWorldPlazaEquipmentSfxConstants.ts`

## Equipment impact SFX (FilmCow)

Assets: `public/harvest/sfx/filmcow-equipment/` (wood, fronds, brick, metal, ground thump, tiny hit variants).

| Constant / registry                                     | Value / role                                |
| ------------------------------------------------------- | ------------------------------------------- |
| `EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION['tree-chop']`   | **15** clips (10 wood + 5 fronds)           |
| `EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION['rock-mine']`   | **22** clips (10 brick + 7 metal + 5 thump) |
| `EQUIPMENT_SFX_CLIP_POOL_BY_TOOL_ACTION['pebble-pick']` | **13** clips (8 tiny + 5 thump)             |
| `EQUIPMENT_SFX_TARGET_VOLUME_BY_TOOL_ACTION`            | tree **0.52**, mine **0.58**, pick **0.38** |
| `EQUIPMENT_SFX_FINAL_MILESTONE_VOLUME_MULTIPLIER`       | **1.12** on `final` milestone               |

| File                                                      | Role                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `definingWorldPlazaEquipmentSfxConstants.ts`              | Clip pools, volumes                                                               |
| `resolvingWorldPlazaEquipmentSfxClipIdForMilestone.ts`    | Milestone ? clip                                                                  |
| `buildingWorldPlazaEquipmentStarAudioManifest.ts`         | star-audio preload                                                                |
| `playingWorldPlazaEquipmentSfx.ts`                        | Imperative bridge from progress hooks                                             |
| `managingWorldPlazaEquipmentSfxRotationStore.ts`          | Per-tool pool index; advances on `final`                                          |
| `computingWorldPlazaEquipmentSfxEffectiveTargetVolume.ts` | Base volume × final boost × SFX slider                                            |
| `usingWorldPlazaEquipmentSfx.ts`                          | Shared-bus hook: acquire, dedupe preload, playback                                |
| `renderingWorldPlazaEquipmentSfx.tsx`                     | Scene mount                                                                       |
| `managingWorldPlazaStarAudio.ts`                          | Shared plaza star-audio acquire/release + manifest dedupe                         |
| `preloadingWorldPlazaWorldBootStarAudio.ts`               | Loading-bar step; warms equipment clips on the shared bus (deferred slice)        |
| `definingWorldPlazaWorldBootStarAudioManifestRegistry.ts` | Registers `buildingWorldPlazaEquipmentStarAudioManifest` in deferred boot preload |
| `unlockingWorldPlazaBiomeMusicFromUserGesture.ts`         | Persistent gesture unlock for all plaza audio hooks                               |
| `usingWorldPlazaTreeChopProgress.ts`                      | Milestone ? `tree-chop` + tree shake                                              |
| `usingWorldPlazaRockMineProgress.ts`                      | Milestone ? `rock-mine`                                                           |
| `usingWorldPlazaPebblePickProgress.ts`                    | Milestone ? `pebble-pick`                                                         |

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

## Rock mine yield and swing constants

| Constant                                    | Value   | Effect                              |
| ------------------------------------------- | ------- | ----------------------------------- |
| `ROCK_MINE_STONE_PER_LAYER`                 | **2**   | Stone per layer removed             |
| `ROCK_MINE_LAYERS_PER_SWING`                | **3**   | Max layers per completed swing      |
| `ROCK_MINE_BASE_DURATION_MS`                | **500** | Base timed interaction              |
| `ROCK_MINE_DURATION_PER_REMAINING_LAYER_MS` | **75**  | Added per mineable layer            |
| `ROCK_MINE_PLAYER_RANGE_TILES`              | **2**   | Chebyshev reach to footprint center |

## Rock pointer and search constants

| Constant                                               | Value   |
| ------------------------------------------------------ | ------- |
| `ROCK_MINE_POINTER_HIT_RADIUS_TILES`                   | **1.2** |
| `ROCK_MINE_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES` | **4**   |
| `ROCK_MINE_PLAYER_CANDIDATE_TILE_SEARCH_EXTRA_TILES`   | **2**   |

## Rock persistence

| Constant                               | Value                     |
| -------------------------------------- | ------------------------- |
| `MINED_ROCKS_LOCAL_STORAGE_KEY_PREFIX` | `world-plaza-mined-rocks` |
| Timed progress icon                    | `game-icons:war-pick`     |

### `WorldRockMineTileState`

| Field                  | Type    | Meaning                |
| ---------------------- | ------- | ---------------------- |
| `remainingVisualLayer` | number  | Layers left on boulder |
| `isDepleted`           | boolean | Fully mined away       |

## Pebble pick yield and timing

| Constant                         | Value   | Effect                    |
| -------------------------------- | ------- | ------------------------- |
| `PEBBLE_PICK_STONE_QUANTITY`     | **1**   | Stone per completed pick  |
| `PEBBLE_PICK_DURATION_MS`        | **350** | Fixed timed interaction   |
| `PEBBLE_PICK_PLAYER_RANGE_TILES` | **2**   | Chebyshev reach to center |

Stone is added with `addingWorldPlazaInventoryItemWithStacking` (no ground drop). Capacity is probed before the swing starts and again before the pebble is marked picked; full bag ? toast _Your inventory is full._ and the pebble stays. On success, `notifyingWorldPlazaInventoryItemAdded` plays the strap-tighten pickup clip (`public/inventory/sfx/filmcow-recorded/strap-tighten-03.ogg`).

## Pebble pick inventory add SFX

| Constant / file                                                   | Value / role                                       |
| ----------------------------------------------------------------- | -------------------------------------------------- |
| `DEFINING_WORLD_PLAZA_INVENTORY_BAG_SFX_CLIP_ID_BY_ACTION.pickup` | `strap_tighten`                                    |
| Asset                                                             | `public/inventory/sfx/filmcow-recorded/strap-tighten-03.ogg` |
| Base pickup volume                                                | **0.58** (pre SFX slider)                          |
| `notifyingWorldPlazaInventoryItemAdded.ts`                        | Fires pickup clip when `quantityAccepted > 0`      |
| `usingWorldPlazaPebblePickInteraction.ts`                         | Calls notifier after stone accepted                |
| `usingWorldPlazaInventoryBagSfx.ts`                               | Shared-bus preload and playback                    |

Cross-context: ground wood/stone from chop/mine use the same clip when picked up from the ground ([inventory-food](../inventory-food/mechanics.md#pickup-channel-weight)).

## Pebble pointer and search

| Constant                                                 | Value   |
| -------------------------------------------------------- | ------- |
| `PEBBLE_PICK_POINTER_HIT_RADIUS_TILES`                   | **0.6** |
| `PEBBLE_PICK_POINTER_CANDIDATE_TILE_SEARCH_RADIUS_TILES` | **2**   |

## Pebble persistence

| Constant                                  | Value                        |
| ----------------------------------------- | ---------------------------- |
| `PICKED_PEBBLES_LOCAL_STORAGE_KEY_PREFIX` | `world-plaza-picked-pebbles` |
| Timed progress icon                       | `game-icons:stone-pile`      |

### `WorldPebblePickTileState`

| Field      | Type | Meaning                  |
| ---------- | ---- | ------------------------ |
| `isPicked` | true | Only picked tiles stored |

## Application files

| Concern             | File                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------- |
| Tree constants      | `definingWorldPlazaTreeChopConstants.ts`                                               |
| Rock constants      | `definingWorldPlazaRockMineConstants.ts`                                               |
| Pebble constants    | `definingWorldPlazaPebblePickConstants.ts`                                             |
| Shared tree         | `worldTreeChop.ts`                                                                     |
| Shared rock         | `worldRockMine.ts`                                                                     |
| Shared pebble       | `worldPebblePick.ts`                                                                   |
| Chop hook           | `usingWorldPlazaTreeChopInteraction.ts`                                                |
| Mine hook           | `usingWorldPlazaRockMineInteraction.ts`                                                |
| Pick hook           | `usingWorldPlazaPebblePickInteraction.ts`                                              |
| Local trees         | `managingWorldPlazaLocalChoppedTrees.ts`                                               |
| Local rocks         | `managingWorldPlazaLocalMinedRocks.ts`                                                 |
| Local pebbles       | `managingWorldPlazaLocalPickedPebbles.ts`                                              |
| Online API          | `callingWorldHarvestDevvitApi.ts`                                                      |
| Server route        | `src/server/routes/worldHarvest.ts`                                                    |
| Tool gates          | `renderingWorldPlazaPixiScene.tsx`                                                     |
| Tree labels         | `renderingWorldPlazaTreeInteractionLabels.tsx`                                         |
| Rock labels         | `renderingWorldPlazaRockInteractionLabels.tsx`                                         |
| Pebble labels       | `renderingWorldPlazaPebbleInteractionLabels.tsx`                                       |
| Trees in range      | `listingWorldPlazaTreesInInteractionRange.ts`                                          |
| Rocks in range      | `listingWorldPlazaRocksInInteractionRange.ts`                                          |
| Pebbles in range    | `listingWorldPlazaPebblesInInteractionRange.ts`                                        |
| Pickaxe items       | `registeringWorldPlazaTieredToolInventoryItems.ts`                                     |
| Inventory tool PNGs | `definingWorldPlazaToolInventoryIconConstants.ts` (`assets/tools-icons/`, Vite `?url`) |

## Held tool overlay presentation

**Master switch:** `DEFINING_WORLD_PLAZA_HELD_ITEM_OVERLAY_ENABLED` in
`definingWorldPlazaHeldItemTypes.ts` (**`false`** = no floating tool on avatar).
Hook short-circuit: `usingWorldPlazaAvatarHeldItemOverlay.ts`.

When enabled, equipped tools (axe, sword, hoe, scythe, fishing rod) render as an
8-direction sprite overlay on the avatar. Registry:
`src/client/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry.ts`.

### Shared defaults

| Constant              | Value          | Effect                                |
| --------------------- | -------------- | ------------------------------------- |
| `anchorX` / `anchorY` | **0.5 / 0.82** | Grip point near sprite bottom-center  |
| `scaleMultiplier`     | **3.8**        | Base scale vs avatar sprite scale     |
| `zIndexOffset`        | **1**          | In front of avatar unless facing away |
| Texture filtering     | nearest        | Crisp pixel art at large scale        |

### Per-visual overrides

| visualId  | offsetScreenPx (X, Y) | scaleMultiplier |
| --------- | --------------------- | --------------- |
| `sword`   | 0, 0                  | 3.8             |
| `axe`     | 0, +2                 | 3.8             |
| `hoe`     | 0, +2                 | 3.8             |
| `scythe`  | 0, -2                 | **4.2**         |
| `fishrod` | +2, +4                | **3.5**         |

### Direction pose table

`DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_POSE` gives each of the 8 facings a
hand offset (avatar-frame px, multiplied by effective sprite scale), a carry
tilt, and whether the tool draws behind the avatar body. Right-handed carry:
screen-right when facing the camera, mirrored when facing left or away.

| Facing    | Offset X | Offset Y | Behind avatar | Tilt (rad) |
| --------- | -------- | -------- | ------------- | ---------- |
| Down      | +13      | +16      | no            | +0.32      |
| DownRight | +16      | +13      | no            | +0.45      |
| Right     | +18      | +10      | no            | +0.55      |
| UpRight   | +12      | +6       | **yes**       | +0.45      |
| Up        | -12      | +6       | **yes**       | -0.32      |
| UpLeft    | -12      | +6       | **yes**       | -0.45      |
| Left      | -18      | +10      | no            | -0.55      |
| DownLeft  | -16      | +13      | no            | -0.45      |

Applier: `applyingWorldPlazaHeldItemPresentationToSprite.ts` combines the
per-visual screen offset with the facing pose, flips `zIndex` negative for
behind-avatar rows, and sets sprite rotation to the pose tilt plus any live
swing rotation offset.

### Swing move set (tool actions)

While a timed tool action runs, the overlay plays a keyframed swing on top of
the carry pose. Registry:
`src/client/world/equipment/domains/definingWorldPlazaHeldItemSwingRegistry.ts`;
interpolator: `computingWorldPlazaHeldItemSwingPose.ts` (smoothstep between
keyframes). Only the local avatar swings; remote avatars keep the static carry.

| Tool action   | Swing profile              |
| ------------- | -------------------------- |
| `tree-chop`   | Chop arc, **520 ms** cycle |
| `rock-mine`   | Same chop arc, **520 ms**  |
| `pebble-pick` | Same chop arc, **520 ms**  |
| `eat`         | none (static carry)        |

Each facing direction has its own keyframe track. A keyframe pins an exact
phase (0..1) with a rotation offset (radians, added to carry tilt) and a hand
drift in avatar-frame px.

Right-side facings (DownRight, Right, UpRight):

| Phase | Rotation offset | Drift X | Drift Y | Reads as       |
| ----- | --------------- | ------- | ------- | -------------- |
| 0.00  | 0               | 0       | 0       | Carry          |
| 0.30  | -1.15           | -3      | -5      | Windup raise   |
| 0.45  | -1.25           | -3      | -6      | Windup hold    |
| 0.58  | +0.85           | +4      | +4      | Strike         |
| 0.72  | +0.60           | +3      | +3      | Follow-through |
| 1.00  | 0               | 0       | 0       | Back to carry  |

Left-side facings (DownLeft, Left, UpLeft) mirror rotation and Drift X. Up and
Down use a vertical overhead track (rotation -0.8..+0.55, Drift Y -8..+5, no
Drift X); the Up track mirrors rotation sign.

## Wood / stone output

| layersRemoved | woodQuantity / stoneQuantity |
| ------------- | ---------------------------- |
| 1             | **2**                        |
| 2             | **4**                        |
| 3             | **6**                        |

## Checklist: tune harvest economy

1. [ ] Edit `WORLD_TREE_CHOP_*` / `WORLD_ROCK_MINE_*` in shared modules (server authority)
2. [ ] Mirror client constants if they diverge
3. [ ] Update swing duration feel in timed interaction resolvers
4. [ ] Update this catalog and [mechanics.md](./mechanics.md)
5. [ ] Cross-check [fire](../fire/) tree flammability if chop-to-fuel loops matter

## Player-facing Guide / tutorial sync

When chop/mine/pick rules, yield, or input bindings change, also check:

| Surface                     | File / section                                                                          | This session                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Controls / tutorial         | `definingPlazaTutorialConstants.ts`, `definingWorldPlazaWorldNotificationsConstants.ts` | **N/A** — no new inputs; pebble pick inventory add uses existing strap-tighten pickup audio |
| Mechanics Guide (World tab) | `definingPlazaMechanicsConstants.ts` ? `chop-and-mine` section                          | **N/A** — existing copy covers pebble direct-to-bag; audio is feedback only                 |
| Biomes Guide                | `definingPlazaBiomesGuideConstants.ts`                                                  | **N/A**                                                                                     |
| Bestiary                    | —                                                                                       | **N/A**                                                                                     |
