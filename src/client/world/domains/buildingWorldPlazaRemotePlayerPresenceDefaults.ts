import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';

/** Default combat fields when presence payloads omit health sync. */
export function buildingWorldPlazaRemotePlayerPresenceHealthDefaults(): {
  healthCurrent: number;
  healthEffectiveMax: number;
  shieldPoints: number;
  isInvincible: boolean;
} {
  return {
    healthCurrent: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
    healthEffectiveMax: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
    shieldPoints: 0,
    isInvincible: false,
  };
}
