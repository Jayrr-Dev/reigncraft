# World depth engine

Unified isometric depth sorting for the plaza world. Import from `@/components/world/depth` for all new rendering-side sort-key work.

## Mental model

1. **Render planes** — floor (z=0) always below entity (z=1). Inside entity: avatar sub-layer (0), canopy (1), effects (2).
2. **Grid depth** — `computingWorldDepthSortKey(gridPoint)` = `round(screenY × 10)` where `screenY = (x + y) × halfTileHeight`. Higher `x + y` draws in front.
3. **Bias ladder** — small integer offsets on top of grid depth (`definingWorldDepthBiasLadder.ts`). Shadow +1, trunk +2, avatar on-block +80, etc.
4. **World layers** — vertical standing height (1–32). Gates occlusion (taller columns in front can cover the avatar) and screen Y lift (+8px per layer). Does not replace grid depth.

## Avatar sort rules

`resolvingWorldDepthAvatarBodySortKey` applies three rules in one provider footprint scan:

| Rule | When |
|------|------|
| **Standing bump** | Column surface ≤ your standing layer → you sort above it |
| **Front occluder cap** | Column in front (`footX+footY > youX+youY`), taller, silhouette reaches feet → you sort behind it |
| **Hard floor raise** | After cap, coplanar caps at your feet stay under your legs when possible |

Shadows use `resolvingWorldDepthAvatarShadowSortKey` with the same provider registry for occluder scans.

## Surface layers

`resolvingWorldDepthSurfaceLayerAtTileIndex` = max surface layer from registered providers (terrain, rocks, placed blocks, tree canopies). Collision/movement code keeps using the shim `resolvingWorldPlazaSurfaceLayerAtTileIndex`.

## Adding a new world object type

1. Add a `DefiningWorldDepthProvider` in `definingWorldDepthProviderRegistry.ts` with:
   - `resolvingSurfaceLayerAtTileIndex` (if walkable)
   - `resolvingSortKeyAtTileIndex`
   - `resolvingDepthSortFootAtTileIndex` (use forward-shifted foot for multi-tile sprites)
   - Flags: `participatesInStandingBump`, `standingBumpRequiresRaisedSurface`, `participatesInFrontOcclusion`, `alwaysTallerForFrontOcclusion`, etc.
2. Register in `DEFINING_WORLD_DEPTH_SURFACE_LAYER_PROVIDERS` and/or `DEFINING_WORLD_DEPTH_AVATAR_OCCLUSION_PROVIDERS`.
3. Add a bias constant to `definingWorldDepthBiasLadder.ts` if needed.
4. Add characterization tests in `resolvingWorldDepthCharacterization.test.ts`.

No need to edit avatar body/shadow resolvers directly — the registry drives occlusion.

## Module map

| File | Role |
|------|------|
| `computingWorldDepthSortKey.ts` | Base grid → z-index |
| `definingWorldDepthBiasLadder.ts` | All depth biases |
| `definingWorldDepthProviderRegistry.ts` | Declarative object providers |
| `resolvingWorldDepthSurfaceLayerAtTile.ts` | Unified walkable surface |
| `resolvingWorldDepthAvatarBodySortKey.ts` | Avatar body z-index |
| `resolvingWorldDepthAvatarShadowSortKey.ts` | Avatar shadow z-index |

Legacy shims under `domains/` re-export the depth API for gradual migration.
