import { DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY } from '@/components/world/health/domains/definingWorldPlazaEntityDamageKindRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_DEFAULT_TITLE } from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/**
 * Returns the full-screen death title for the damage source that killed the player.
 */
export function formattingWorldPlazaEntityDeathScreenTitle(
  damageKind: DefiningWorldPlazaEntityDamageKind | null | undefined
): string {
  if (damageKind === null || damageKind === undefined) {
    return DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_DEFAULT_TITLE;
  }

  return (
    DEFINING_WORLD_PLAZA_ENTITY_DAMAGE_KIND_REGISTRY[damageKind]
      .deathScreenTitle ??
    DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_DEFAULT_TITLE
  );
}
