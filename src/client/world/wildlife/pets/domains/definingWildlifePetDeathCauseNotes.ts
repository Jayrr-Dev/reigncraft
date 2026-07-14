/**
 * Short roster notes for how a companion died.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetDeathCauseNotes
 */

import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Fallback when the save has no death cause (older records). */
export const LABELING_WILDLIFE_PET_DEATH_CAUSE_UNKNOWN =
  'Cause unknown' as const;

/** Player-facing death notes keyed by damage kind. */
export const DEFINING_WILDLIFE_PET_DEATH_CAUSE_NOTE_BY_KIND: Readonly<
  Record<DefiningWorldPlazaEntityDamageKind, string>
> = {
  physical: 'Slain in combat',
  environmental_lava: 'Burned in lava',
  environmental_heat: 'Succumbed to heat',
  environmental_cold: 'Froze to death',
  fall: 'Died from a fall',
  toxic: 'Poisoned',
  venomous: 'Killed by venom',
  lethal: 'Killed by lethal poison',
  bleeding: 'Bled out',
  hemorrhaging: 'Hemorrhaged',
  exsanguinating: 'Exsanguinated',
  potential_damage: 'Fate caught up',
  soulbreak: 'Soul shattered',
  healing: 'Cause unknown',
  starvation: 'Starved',
};

/** Resolves a compact death note for the companions roster. */
export function resolvingWildlifePetDeathCauseNote(
  deathCauseKind: string | null | undefined
): string {
  if (!deathCauseKind) {
    return LABELING_WILDLIFE_PET_DEATH_CAUSE_UNKNOWN;
  }

  const note =
    DEFINING_WILDLIFE_PET_DEATH_CAUSE_NOTE_BY_KIND[
      deathCauseKind as DefiningWorldPlazaEntityDamageKind
    ];

  return note ?? LABELING_WILDLIFE_PET_DEATH_CAUSE_UNKNOWN;
}
