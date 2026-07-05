/** Bundled Iconify id shown on the health-bar buff row. */
export type MappingWorldPlazaEntityBuffHudIconName =
  | 'boxicons:sword-filled'
  | 'boxicons:target'
  | 'game-icons:death-skull'
  | 'game-icons:scythe'
  | 'mdi:compass'
  | 'mdi:crosshairs-gps'
  | 'mdi:dice-multiple'
  | 'mdi:fire'
  | 'mdi:flash'
  | 'mdi:hammer'
  | 'mdi:heart-flash'
  | 'mdi:heart-plus'
  | 'mdi:lock'
  | 'mdi:refresh'
  | 'mdi:run-fast'
  | 'mdi:shield'
  | 'mdi:shield-check'
  | 'mdi:shield-half-full'
  | 'mdi:shield-off'
  | 'mdi:shield-plus'
  | 'mdi:snowflake'
  | 'ph:heart-half'
  | 'ph:person-simple-run'
  | 'solar:fire-bold'
  | 'solar:heart-pulse-bold';

const MAPPING_WORLD_PLAZA_ENTITY_BUFF_HUD_ICON: Record<
  string,
  MappingWorldPlazaEntityBuffHudIconName
> = {
  'iron-armor': 'mdi:shield-half-full',
  'heavy-armor': 'mdi:shield',
  'tower-shield': 'mdi:shield-plus',
  'light-boots': 'mdi:run-fast',
  'stabilizing-armor': 'mdi:lock',
  'risk-armor': 'mdi:shield-off',
  'defense-buff': 'mdi:shield-check',
  'evasion-buff': 'ph:person-simple-run',
  'guard-buff': 'mdi:shield-plus',
  'fortify-buff': 'mdi:shield-check',
  'stabilize-buff': 'mdi:refresh',
  'half-damage-buff': 'ph:heart-half',
  'power-buff': 'boxicons:sword-filled',
  'rage-buff': 'mdi:flash',
  'assassin-buff': 'game-icons:scythe',
  'precision-buff': 'boxicons:target',
  'true-strike-buff': 'mdi:crosshairs-gps',
  'lock-in-buff': 'mdi:lock',
  'focus-buff': 'mdi:compass',
  'controlled-output-buff': 'boxicons:target',
  'all-or-nothing-buff': 'mdi:dice-multiple',
  'temp-max-health-buff': 'mdi:heart-plus',
  'double-max-health-buff': 'mdi:heart-flash',
  'halve-max-health-buff': 'ph:heart-half',
  'heat-resistance-buff': 'solar:fire-bold',
  'cold-resistance-buff': 'mdi:snowflake',
  'heat-immunity-buff': 'mdi:fire',
  'cold-immunity-buff': 'mdi:snowflake',
  'invincibility-buff': 'solar:heart-pulse-bold',
};

/**
 * Returns the HUD icon for one registered buff id.
 */
export function resolvingWorldPlazaEntityBuffHudIcon(
  buffId: string
): MappingWorldPlazaEntityBuffHudIconName {
  return MAPPING_WORLD_PLAZA_ENTITY_BUFF_HUD_ICON[buffId] ?? 'mdi:shield';
}
