import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { formattingWorldPlazaCampfireInteractionTileKey } from '@/components/world/fire/domains/formattingWorldPlazaCampfireInteractionTileKey';

/** Stable progress-ring target key for campfire meat cooking. */
export function formattingWorldPlazaCampfireCookProgressTargetKey(
  block: DefiningWorldBuildingPlacedBlock
): string {
  return `${formattingWorldPlazaCampfireInteractionTileKey(block)}:cook`;
}
