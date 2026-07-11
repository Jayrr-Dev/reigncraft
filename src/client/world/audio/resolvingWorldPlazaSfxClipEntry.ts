import type { DefiningWorldPlazaSfxClipEntry } from '@/components/world/audio/definingWorldPlazaSfxClipEntry';
import { resolvingWorldPlazaSfxVolumeMultiplierProduct } from '@/components/world/audio/resolvingWorldPlazaSfxVolumeMultiplierProduct';

/**
 * Resolves the stable clip id from a pool entry.
 */
export function resolvingWorldPlazaSfxClipEntryId<TClipId extends string>(
  entry: DefiningWorldPlazaSfxClipEntry<TClipId>
): TClipId {
  return typeof entry === 'string' ? entry : entry.id;
}

/**
 * Resolves the per-clip volume multiplier from a pool entry (default 1).
 */
export function resolvingWorldPlazaSfxClipEntryVolume<TClipId extends string>(
  entry: DefiningWorldPlazaSfxClipEntry<TClipId>
): number {
  return typeof entry === 'string' ? 1 : (entry.volume ?? 1);
}

/**
 * Maps pool entries to stable clip ids.
 */
export function mappingWorldPlazaSfxClipEntryIds<TClipId extends string>(
  entries: readonly DefiningWorldPlazaSfxClipEntry<TClipId>[]
): TClipId[] {
  return entries.map(resolvingWorldPlazaSfxClipEntryId);
}

/**
 * Resolves definition × group × clip volume multipliers (default each = 1).
 */
export function resolvingWorldPlazaSfxVolumeMultiplier<
  TDefinition extends { volume?: number },
  TGroupVolume extends number | undefined,
>(
  definition: TDefinition,
  groupVolume: TGroupVolume,
  clipEntry: unknown
): number {
  const clipVolume =
    typeof clipEntry === 'string' ||
    (clipEntry && typeof clipEntry === 'object')
      ? resolvingWorldPlazaSfxClipEntryVolume(
          clipEntry as DefiningWorldPlazaSfxClipEntry<string>
        )
      : 1;

  return resolvingWorldPlazaSfxVolumeMultiplierProduct([
    definition.volume,
    groupVolume,
    clipVolume,
  ]);
}
