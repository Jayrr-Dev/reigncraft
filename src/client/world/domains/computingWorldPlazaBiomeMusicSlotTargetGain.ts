import { DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';

/**
 * Per-slot biome music gain before the master volume bus is applied.
 */
export function computingWorldPlazaBiomeMusicSlotTargetGain(): number {
  return DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME;
}
