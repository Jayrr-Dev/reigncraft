import { describe, expect, it } from 'vitest';

import { resolvingWorldPlazaEquipmentSfxClipIdForMilestone } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentSfxClipIdForMilestone';
import { formattingWorldPlazaEquipmentSfxFileName } from '@/components/world/equipment/domains/resolvingWorldPlazaEquipmentSfxUrl';

describe('resolvingWorldPlazaEquipmentSfxClipIdForMilestone', () => {
  it('rotates through the tree-chop pool across milestones', () => {
    const startClip = resolvingWorldPlazaEquipmentSfxClipIdForMilestone(
      'tree-chop',
      'start',
      0
    );
    const midClip = resolvingWorldPlazaEquipmentSfxClipIdForMilestone(
      'tree-chop',
      'mid',
      0
    );
    const finalClip = resolvingWorldPlazaEquipmentSfxClipIdForMilestone(
      'tree-chop',
      'final',
      0
    );

    expect(startClip).not.toBe(midClip);
    expect(midClip).not.toBe(finalClip);
  });

  it('maps clip ids to shipped kebab-case filenames', () => {
    expect(formattingWorldPlazaEquipmentSfxFileName('wood_hit_01')).toBe(
      'wood-hit-01.ogg'
    );
    expect(formattingWorldPlazaEquipmentSfxFileName('ground_thump_05')).toBe(
      'ground-thump-05.ogg'
    );
  });
});
