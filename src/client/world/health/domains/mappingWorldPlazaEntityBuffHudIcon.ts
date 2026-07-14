/** Bundled Iconify id shown on the health-bar buff row. */
export type MappingWorldPlazaEntityBuffHudIconName =
  | 'boxicons:sword-filled'
  | 'boxicons:target'
  | 'game-icons:broken-bone'
  | 'game-icons:broken-heart'
  | 'game-icons:death-skull'
  | 'game-icons:scythe'
  | 'mdi:arm-flex'
  | 'mdi:arrow-down-bold'
  | 'mdi:arrow-up-bold'
  | 'mdi:compass'
  | 'mdi:clover'
  | 'mdi:crosshairs-gps'
  | 'mdi:dice-multiple'
  | 'mdi:eye-off'
  | 'mdi:fire'
  | 'mdi:flash'
  | 'mdi:foot-print'
  | 'mdi:hammer'
  | 'mdi:head-question'
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
  | 'mdi:sleep'
  | 'mdi:power-sleep'
  | 'mdi:snowflake'
  | 'mdi:stomach'
  | 'mdi:blood-bag'
  | 'mdi:biohazard'
  | 'mdi:food-drumstick'
  | 'mdi:star-four-points'
  | 'mdi:thermometer'
  | 'mdi:flower'
  | 'mdi:sprout'
  | 'mdi:weather-night'
  | 'ph:hand-fist'
  | 'ph:heart-half'
  | 'ph:person-simple-run'
  | 'solar:fire-bold'
  | 'solar:heart-pulse-bold';

const MAPPING_WORLD_PLAZA_ENTITY_BUFF_HUD_ICON: Record<
  string,
  MappingWorldPlazaEntityBuffHudIconName
> = {
  'lucky-buff': 'mdi:clover',
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
  'quick-strikes-buff': 'mdi:flash',
  'bloodlust-buff': 'mdi:heart-flash',
  'blinding-flurry-buff': 'mdi:flash',
  'relentless-tempo-buff': 'boxicons:sword-filled',
  'slow-hands-debuff': 'mdi:hammer',
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
  'heat-tolerance-buff': 'mdi:thermometer',
  'cold-tolerance-buff': 'mdi:thermometer',
  'heat-weakness-debuff': 'mdi:fire',
  'cold-weakness-debuff': 'mdi:snowflake',
  'heat-immunity-buff': 'mdi:fire',
  'cold-immunity-buff': 'mdi:snowflake',
  'invincibility-buff': 'solar:heart-pulse-bold',
  'food-sickness-debuff': 'mdi:stomach',
  'petal-sickness-debuff': 'mdi:flower',
  'confusion-debuff': 'mdi:head-question',
  'sleep-debuff': 'mdi:sleep',
  'deep-sleep-debuff': 'mdi:power-sleep',
  'stun-debuff': 'mdi:star-four-points',
  'broken-leg-debuff': 'game-icons:broken-bone',
  'broken-ankle-debuff': 'mdi:foot-print',
  'broken-arm-debuff': 'mdi:arm-flex',
  'broken-finger-debuff': 'ph:hand-fist',
  'injured-eye-debuff': 'mdi:eye-off',
  'well-fed-hearty-buff': 'mdi:heart-plus',
  'well-fed-fleet-buff': 'mdi:run-fast',
  'well-fed-strength-buff': 'boxicons:sword-filled',
  'well-fed-sunhead-heat-buff': 'mdi:fire',
  'well-fed-omega-skew-buff': 'game-icons:scythe',
  'well-fed-omega-siphon-buff': 'mdi:blood-bag',
  'well-fed-endurance-buff': 'mdi:refresh',
  'well-fed-toughened-buff': 'mdi:shield-check',
  'well-fed-vigor-buff': 'solar:heart-pulse-bold',
  'well-fed-comfort-buff': 'mdi:food-drumstick',
  'well-fed-prime-buff': 'mdi:flash',
  'well-fed-reptile-buff': 'mdi:shield-half-full',
  'well-fed-cucco-fury-buff': 'boxicons:sword-filled',
  'well-fed-cucco-chase-buff': 'mdi:run-fast',
  'well-fed-cucco-vigor-buff': 'mdi:refresh',
  'tea-leaf-calm-buff': 'mdi:refresh',
  'coffee-cherry-buzz-buff': 'mdi:run-fast',
  'coffee-buzz-buff': 'mdi:run-fast',
  'coffee-cherry-crash-debuff': 'mdi:arrow-down-bold',
  'coffee-crash-debuff': 'mdi:arrow-down-bold',
};

/**
 * Returns the HUD icon for one registered buff id.
 */
export function resolvingWorldPlazaEntityBuffHudIcon(
  buffId: string
): MappingWorldPlazaEntityBuffHudIconName {
  return MAPPING_WORLD_PLAZA_ENTITY_BUFF_HUD_ICON[buffId] ?? 'mdi:shield';
}
