# Postmortem: stacked slabs wrongly treated as walk-under roofs

**Date:** 2026-07-13  
**Area:** plaza build depth sort + floating-overhead detection  
**Severity:** player-visible (avatar tucked behind solid stacks)  
**Status:** fixed

## Summary

Stacking two thin floors (for example Slab at L2 + Slab at L3, or two Halfs) made the avatar draw *behind* the column while standing in front of it on the ground. One piece looked fine; two looked broken. Standing on layer 2 made the bug go away.

Root cause was not placement math and not walk-under *collision*. It was the depth rule that marks a same-tile column as a floating roof so the avatar can tuck under it.

## Symptoms

- Avatar legs or torso covered by a grey Slab / Half stack the player is clearly south of.
- UI showed Layer 2 (or a stacked top near L2/L3).
- Reproduced by placing two Slabs on the same tile (second snap to L3 on top of L2).
- Did **not** reproduce with a single ground-flush slab, or when the player stood on layer 2 of the stack.

## Timeline (short)

1. Earlier in the same session: default anchor / hover layer floated blocks one layer high (`L = H+1` and stack `S + H` on terrain). Fixed placement to flush on terrain (`S + H - 1`) and `L = H` defaults.
2. Avatar still covered on floor stacks. Depth work added south-face screen tests, foot offset, and overhead-slab detection so true roofs tuck the avatar.
3. Stack case still failed in screenshots: two Slabs L2+L3, feet on layer 1, body sorted *behind* the column.
4. Scratch repro showed sort keys: same-tile positions with standing layer 1 sorted behind; standing layer 2 sorted in front.
5. Overhead detector was classifying the upper piece as a floating roof because it required *continuous solid fill from feet up to the roof underside*. For L2+L3 that gap is only layer 1 (air), so the upper slab counted as a roof.

## Root cause

`checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex` decided “floating roof” per candidate bottom layer by asking: is every layer from `standingLayer` through `candidate.bottomLayer - 1` solid?

That is the wrong question for stacked pieces.

| Setup | Occupied bands | Old verdict | Correct |
| ----- | -------------- | ----------- | ------- |
| Half L4 alone (bottom 3) | 3–4 | roof (air under) | roof |
| Half L2 + Half L4 | 1–2 and 3–4 | roof (layer 1…2 gap check failed on continuous fill from feet through upper bottom−1 in some variants; upper piece alone looked unsupported) | solid stack |
| Slab L2 + Slab L3 | 2 and 3 | roof (gap standing→underside is only L1 air) | solid stack, stack bottom = 2 |
| Real roof with 2+ air under feet | high bottom, no solid under | roof | roof |

Walk-under *collision* (vertical band clearance) was fine. Depth used the overhead flag via `participatesInSameTileOverheadOcclusion` / front occluder cap and tucked the avatar even when nobody could stand under the stack.

## Fix

In `checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex.ts`:

1. Collect solid occupied bands for extruded blocks on the tile.
2. For each candidate, walk **down** through contiguous solid layers to the bottom of the supported stack (`resolvingWorldBuildingSupportedStackBottomLayer`).
3. Treat as floating overhead only when that **stack** bottom is at least `standingLayer + 2` (two layers of air under the underside relative to feet).

So L2+L3 slabs share a stack bottom of 2: only one layer above ground feet, not a roof. Avatar sorts in front. A lone elevated slab with real clearance still tucks.

## Follow-up (same day): high floating slab north-side cover

**Symptom:** Slab at Layer 6 covered the avatar correctly when standing south, but on the north / top side the avatar drew *on top* of the slab (head through the front face).

**Cause:** `checkingWorldDepthAvatarFootIsAtOrSouthOfColumnSouthTipOnScreen` used the *elevated* surface layer for the south tip. A high tip sits far up on screen, so ground feet always looked “south of” it. That raised the avatar above the column and blocked front occlusion. Near-north tiles also failed the foot-sum “in front” margin, so nothing tucked the body.

**Fix:**
1. Floating roofs use the **standing-layer footprint tip** for “am I south?” Solid columns still use the surface tip (painted feet on a tall front face).
2. `checkingWorldDepthElevatedColumnOccludesAvatarBehindOnScreen` tucks the avatar when a true floating stack overlaps the body band and feet are not south of the footprint. Higher caps expand the overlap band.

**Tests:** north of L6 slab → behind; south neighbor → in front (`resolvingWorldDepthPlacedBlockSouthLayering.test.ts`).

## Verification

- Unit: `checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex.test.ts` (stacked Halfs, stacked Slabs L2+L3, true gap, elevation).
- Depth: `resolvingWorldDepthPlacedBlockSouthLayering.test.ts` and related depth suites.
- Scratch repro of screenshot geometry: before fix `bodyZ < stackZ` on same-tile layer 1; after fix `bodyZ > stackZ`.

## Lessons

1. **Overhead depth must use the supported stack underside, not each piece’s own bottom.** Upper floors in a continuous column are not roofs.
2. **“Air between feet and this piece” ≠ “player can stand under this column.”** Continuous solid below the piece blocks walk-under even if layer 1 is empty.
3. **Reproduce with exact placement heights from the UI** (two Slabs → L2 then L3). Single-block tests miss the stack classifier bug.
4. **Standing layer matters.** Same geometry “works” on L2 and fails on L1 when the threshold is `standing + 2`.
5. **Do not use elevated tip Y for footprint “south of face” on floating roofs.** Tip layer must adapt: standing for float, surface for solid.

## Guardrails

- Keep regression cases for:
  - two Slabs L2+L3, feet L1 → not overhead
  - two Halfs continuous from ground → not overhead
  - lone Half with bottom ≥ standing+2 → overhead
  - missing middle support with high upper piece → overhead
  - floating L6 slab, avatar north → behind; avatar south → in front
- When changing walk-under collision, re-check this depth helper: they share vocabulary but different predicates.

## Related files

- `src/client/world/building/domains/checkingWorldBuildingFloatingOverheadSlabAboveStandingLayerAtTileIndex.ts`
- `src/client/world/depth/domains/checkingWorldDepthColumnSilhouetteReachesAvatarFootOnScreen.ts`
- `src/client/world/depth/domains/resolvingWorldDepthAvatarBodySortKey.ts`
- `src/client/world/depth/README.md` (avatar sort rules)
- Placement context from the same session: `resolvingWorldBuildingHoverPlacementWorldLayer.ts`, `resolvingWorldBuildingMinimumWorldLayerForBlockHeight.ts`
