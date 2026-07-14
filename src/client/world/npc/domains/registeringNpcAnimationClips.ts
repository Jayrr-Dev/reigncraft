/**
 * Registers declarative animation clips for one NPC species.
 *
 * @module components/world/npc/domains/registeringNpcAnimationClips
 */

import { buildingWorldPlazaAnimationClipFromMotionSheet } from '@/components/world/animation/domains/buildingWorldPlazaAnimationClipFromMotionSheet';
import { registeringWorldPlazaAnimationClip } from '@/components/world/animation/domains/registeringWorldPlazaAnimationClip';
import { creatingWorldPlazaGirlSampleMotionFrameTextures } from '@/components/world/domains/creatingWorldPlazaGirlSampleWalkFrameTextures';
import type { DefiningNpcSpeciesDefinition } from '@/components/world/npc/domains/definingNpcSpeciesRegistry';
import type {
  DefiningNpcLoadedMotionClipKind,
  DefiningNpcMotionClipKind,
} from '@/components/world/npc/domains/definingNpcSpriteSheetLayout';
import {
  DEFINING_NPC_MOTION_FPS,
  definingNpcMotionSheetLayout,
} from '@/components/world/npc/domains/definingNpcSpriteSheetLayout';
import type { DefiningNpcSpeciesTextures } from '@/components/world/npc/domains/loadingNpcSpeciesTextures';
import { loadingNpcSpeciesTextures } from '@/components/world/npc/domains/loadingNpcSpeciesTextures';

const DEFINING_NPC_ANIMATION_CLIP_PREFIX = 'npc-' as const;

export function formattingNpcAnimationClipId(
  speciesId: string,
  motionKind: DefiningNpcMotionClipKind
): string {
  return `${DEFINING_NPC_ANIMATION_CLIP_PREFIX}${speciesId}-${motionKind}`;
}

const DEFINING_NPC_ONE_SHOT_MOTIONS: ReadonlySet<DefiningNpcMotionClipKind> =
  new Set(['attack', 'takeDamage', 'die']);

export function registeringNpcAnimationClips(
  species: DefiningNpcSpeciesDefinition,
  textures: DefiningNpcSpeciesTextures
): void {
  const motionKinds = Object.keys(
    textures
  ) as DefiningNpcLoadedMotionClipKind[];

  for (const motionKind of motionKinds) {
    const motionSheet = textures[motionKind];
    const sheetLayout = definingNpcMotionSheetLayout(
      motionSheet.frameWidthPx,
      motionSheet.frameHeightPx
    );
    const frameTextures = creatingWorldPlazaGirlSampleMotionFrameTextures(
      motionSheet.directionTextures,
      sheetLayout
    );

    registeringWorldPlazaAnimationClip(
      buildingWorldPlazaAnimationClipFromMotionSheet({
        clipId: formattingNpcAnimationClipId(species.speciesId, motionKind),
        frameTextures,
        sheetLayout,
        fps: DEFINING_NPC_MOTION_FPS[motionKind],
        playbackMode: DEFINING_NPC_ONE_SHOT_MOTIONS.has(motionKind)
          ? 'once'
          : 'loop',
      })
    );
  }
}

const registeredNpcSpeciesIds = new Set<string>();

export async function ensuringNpcAnimationClipsRegistered(
  species: DefiningNpcSpeciesDefinition
): Promise<void> {
  if (registeredNpcSpeciesIds.has(species.speciesId)) {
    return;
  }

  const textures = await loadingNpcSpeciesTextures(species);
  registeringNpcAnimationClips(species, textures);
  registeredNpcSpeciesIds.add(species.speciesId);
}
