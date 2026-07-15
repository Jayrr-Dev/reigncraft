/**
 * In-place wildlife status HUD overlay updates for engaged animals.
 *
 * @module components/world/wildlife/domains/updatingWildlifeStatusHudOverlaysRef
 */

import {
  resolvingWorldPlazaPlayerWorldLayer,
  type DefiningWorldPlazaWorldPoint,
} from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifePointWithinRadiusGrid } from '@/components/world/wildlife/domains/checkingWildlifePointWithinRadiusGrid';
import { checkingWildlifeStatusHudOverlayShouldShow } from '@/components/world/wildlife/domains/checkingWildlifeStatusHudOverlayShouldShow';
import { DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeStatusHudOverlay } from '@/components/world/wildlife/domains/definingWildlifeStatusHudOverlayTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { resolvingWildlifeInstanceEntityHudBadgeSnapshot } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceEntityHudBadgeSnapshot';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';
import { resolvingWildlifeStatusHudOverlayIcons } from '@/components/world/wildlife/domains/resolvingWildlifeStatusHudOverlayIcons';

export type UpdatingWildlifeStatusHudOverlaysRefParams = {
  readonly outRef: DefiningWildlifeStatusHudOverlay[];
  readonly instances: readonly DefiningWildlifeInstance[];
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
  readonly nowMs: number;
  readonly hoveredInstanceId: string | null;
  readonly combatLockedInstanceId: string | null;
  readonly resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

export type UpdatingWildlifeStatusHudOverlaysRefResult = {
  readonly didMountSetChange: boolean;
};

function hashingWildlifeStatusHudOverlayIconSignature(
  overlay: DefiningWildlifeStatusHudOverlay
): string {
  return overlay.icons
    .map(
      (icon) =>
        `${icon.id}:${icon.numericLabel ?? ''}:${icon.expiresAtMs ?? ''}`
    )
    .join('|');
}

/**
 * Updates the live status HUD overlay ref for engaged wildlife with statuses.
 */
export function updatingWildlifeStatusHudOverlaysRef({
  outRef,
  instances,
  playerPosition,
  nowMs,
  hoveredInstanceId,
  combatLockedInstanceId,
  resolveSpecies,
}: UpdatingWildlifeStatusHudOverlaysRefParams): UpdatingWildlifeStatusHudOverlaysRefResult {
  let writeIndex = 0;
  let didMountSetChange = false;

  for (const instance of instances) {
    if (instance.isDead) {
      continue;
    }

    if (
      !checkingWildlifePointWithinRadiusGrid(
        instance.position,
        playerPosition,
        DEFINING_WILDLIFE_NAME_TAG_VISIBLE_RADIUS_GRID
      )
    ) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species) {
      continue;
    }

    const snapshot = resolvingWildlifeInstanceEntityHudBadgeSnapshot({
      healthState: instance.healthState,
      nowMs,
    });
    const icons = resolvingWildlifeStatusHudOverlayIcons(snapshot);

    if (
      !checkingWildlifeStatusHudOverlayShouldShow({
        isDead: instance.isDead,
        iconCount: icons.length,
        lastDamagedAtMs: instance.aggroState.lastDamagedAtMs,
        isCombatLocked: combatLockedInstanceId === instance.instanceId,
        isHovered: hoveredInstanceId === instance.instanceId,
      })
    ) {
      continue;
    }

    const layer = resolvingWorldPlazaPlayerWorldLayer(instance.position);
    const sizeScale = resolvingWildlifeInstanceSizeScale(species, instance);
    const frameHeightPx =
      resolvingWildlifeSpeciesSpritePresentation(species).frameHeightPx;
    const jumpArcOffsetPx = instance.aiState.jumpState
      ? computingWildlifeJumpArcLiftPx(
          species.jump.jumpArcPeakPx,
          instance.aiState.jumpState.progress
        )
      : 0;

    const existing = outRef[writeIndex];
    const nextSignature = icons
      .map(
        (icon) =>
          `${icon.id}:${icon.numericLabel ?? ''}:${icon.expiresAtMs ?? ''}`
      )
      .join('|');

    if (
      !existing ||
      existing.instanceId !== instance.instanceId ||
      hashingWildlifeStatusHudOverlayIconSignature(existing) !== nextSignature
    ) {
      didMountSetChange = true;
    }

    if (existing && existing.instanceId === instance.instanceId) {
      existing.gridX = instance.position.x;
      existing.gridY = instance.position.y;
      existing.layer = layer;
      existing.sizeScale = sizeScale;
      existing.frameHeightPx = frameHeightPx;
      existing.jumpArcOffsetPx = jumpArcOffsetPx;
      existing.icons = [...icons];
    } else {
      outRef[writeIndex] = {
        instanceId: instance.instanceId,
        gridX: instance.position.x,
        gridY: instance.position.y,
        layer,
        sizeScale,
        frameHeightPx,
        jumpArcOffsetPx,
        icons: [...icons],
      };
    }

    writeIndex += 1;
  }

  if (outRef.length !== writeIndex) {
    didMountSetChange = true;
  }

  outRef.length = writeIndex;

  return { didMountSetChange };
}
