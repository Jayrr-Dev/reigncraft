/** Bundled Iconify id shown on the health-bar buff row. */
export type MappingWorldPlazaEntityBuffHudIconName =
  | 'boxicons:sword-filled'
  | 'boxicons:target'
  | 'game-icons:broken-heart'
  | 'game-icons:death-skull'
  | 'game-icons:scythe'
  | 'mdi:arrow-down-bold'
  | 'mdi:arrow-up-bold'
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
  | 'mdi:stomach'
  | 'mdi:star-four-points'
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
  'exposed-debuff': 'boxicons:target',
  'vulnerable-debuff': 'game-icons:broken-heart',
  'condemned-debuff': 'game-icons:scythe',
  'braced-buff': 'mdi:shield-half-full',
  'guarded-buff': 'mdi:shield',
  'ultra-instinct-buff': 'mdi:star-four-points',
  'siphoning-buff': 'mdi:blood-bag',
  'absorb-buff': 'mdi:heart-plus',
  'blessing-buff': 'solar:heart-pulse-bold',
  'mending-buff': 'mdi:heart-flash',
  'temp-max-health-buff': 'mdi:heart-plus',
  'double-max-health-buff': 'mdi:heart-flash',
  'halve-max-health-buff': 'ph:heart-half',
  'swift-stride-buff': 'mdi:run-fast',
  'racing-pulse-buff': 'ph:person-simple-run',
  'sprint-surge-buff': 'mdi:flash',
  'long-leap-buff': 'mdi:arrow-up-bold',
  'skybound-buff': 'mdi:arrow-up-bold',
  'enduring-spirit-buff': 'mdi:heart-plus',
  'second-wind-buff': 'mdi:refresh',
  'featherweight-buff': 'ph:person-simple-run',
  'lead-boots-debuff': 'mdi:shield-off',
  'sluggish-debuff': 'mdi:run-fast',
  'heavy-legs-debuff': 'mdi:arrow-down-bold',
  'low-hop-debuff': 'mdi:arrow-down-bold',
  'exhausted-debuff': 'game-icons:broken-heart',
  'winded-debuff': 'game-icons:broken-heart',
  'heavy-landing-debuff': 'mdi:hammer',
  'heat-resistance-buff': 'solar:fire-bold',
  'cold-resistance-buff': 'mdi:snowflake',
  'heat-immunity-buff': 'mdi:fire',
  'cold-immunity-buff': 'mdi:snowflake',
  'invincibility-buff': 'solar:heart-pulse-bold',
  'food-sickness-debuff': 'mdi:stomach',
};

/**
 * Returns the HUD icon for one registered buff id.
 */
export function resolvingWorldPlazaEntityBuffHudIcon(
  buffId: string
): MappingWorldPlazaEntityBuffHudIconName {
  return MAPPING_WORLD_PLAZA_ENTITY_BUFF_HUD_ICON[buffId] ?? 'mdi:shield';
}
