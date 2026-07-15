import type {
  WorldPlazaOnboardingCoachmarkDefinition,
  WorldPlazaOnboardingCoachmarkStepId,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';

/** Linear core steps shown in order on first spawn. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CORE_ORDER: readonly WorldPlazaOnboardingCoachmarkStepId[] =
  ['move', 'hotbar', 'action-bar'];

/** Contextual steps; first eligible step wins when core is complete. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CONTEXTUAL_ORDER: readonly WorldPlazaOnboardingCoachmarkStepId[] =
  [
    'chop',
    'loot',
    'equip-tool',
    'hunger',
    'temperature',
    'craft',
    'codex',
    'study',
    'build',
    'claim',
    'spritcore',
    'pets',
  ];

export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_REGISTRY: readonly WorldPlazaOnboardingCoachmarkDefinition[] =
  [
    {
      id: 'move',
      phase: 'core',
      title: 'Move around',
      descriptionDesktop:
        'Click a walkable tile or use WASD / arrow keys to path. Hold Shift to run.',
      descriptionMobile:
        'Tap a tile to walk there. Hold to run, or use the jump button to leap.',
      targetAnchorId: null,
      advanceEvent: 'move',
      tipPlacement: 'center',
    },
    {
      id: 'hotbar',
      phase: 'core',
      title: 'Your items',
      descriptionDesktop:
        'The hotbar at the bottom holds your gear. Click a slot to use or equip an item.',
      descriptionMobile:
        'Your items live in the bottom bar. Tap a slot to use or equip something.',
      targetAnchorId: 'hotbar',
      advanceEvent: 'hotbar-click',
      tipPlacement: 'above',
    },
    {
      id: 'action-bar',
      phase: 'core',
      title: 'Plaza tools',
      descriptionDesktop:
        'The top bar opens settings, the Codex, hunger, and the minimap. Explore when you are ready.',
      descriptionMobile:
        'The top bar opens settings, the Codex, hunger, and the map. Tap any icon to try it.',
      targetAnchorId: 'action-bar',
      advanceEvent: 'action-bar-click',
      tipPlacement: 'below',
    },
    {
      id: 'chop',
      phase: 'contextual',
      title: 'Chop wood',
      descriptionDesktop:
        'Stand next to a tree and click Chop. An axe speeds it up but is not required.',
      descriptionMobile:
        'Stand next to a tree and tap Chop. An axe speeds it up but is not required.',
      targetAnchorId: 'chop-interaction',
      advanceEvent: 'chop-start',
      tipPlacement: 'above',
    },
    {
      id: 'loot',
      phase: 'contextual',
      title: 'Picked up loot',
      descriptionDesktop:
        'New items land in your hotbar. Click a slot to equip tools or open bags.',
      descriptionMobile:
        'New items land in your hotbar. Tap a slot to equip tools or open bags.',
      targetAnchorId: 'hotbar',
      advanceEvent: 'hotbar-click',
      tipPlacement: 'above',
    },
    {
      id: 'equip-tool',
      phase: 'contextual',
      title: 'Equip a tool',
      descriptionDesktop:
        'Click a tool in your hotbar to move it into the left fist slot. That is what you swing and harvest with.',
      descriptionMobile:
        'Tap a tool in your hotbar to move it into the left fist slot. That is what you swing and harvest with.',
      targetAnchorId: 'equip-tool-slot',
      advanceEvent: 'equip-tool',
      tipPlacement: 'above',
    },
    {
      id: 'hunger',
      phase: 'contextual',
      title: 'Watch your hunger',
      descriptionDesktop:
        'Hunger drains while you move. Click the drumstick orb to check it. Double-click food in your hotbar to eat before you starve.',
      descriptionMobile:
        'Hunger drains while you move. Tap the drumstick orb to check it. Double-tap food in your hotbar to eat before you starve.',
      targetAnchorId: 'hunger-orb',
      advanceEvent: 'hunger-click',
      tipPlacement: 'below',
    },
    {
      id: 'temperature',
      phase: 'contextual',
      title: 'Temperature matters',
      descriptionDesktop:
        'The thermometer orb tracks heat and cold. Click it to see your comfort band. Too hot or too cold chips health and can stack frostbite.',
      descriptionMobile:
        'The thermometer orb tracks heat and cold. Tap it to see your comfort band. Too hot or too cold chips health and can stack frostbite.',
      targetAnchorId: 'temperature-orb',
      advanceEvent: 'temperature-click',
      tipPlacement: 'below',
    },
    {
      id: 'craft',
      phase: 'contextual',
      title: 'Crafting',
      descriptionDesktop:
        'Tap Craft above your hotbar to open recipes. Pick a recipe, gather materials, then craft tools, campfires, and placeables.',
      descriptionMobile:
        'Tap Craft above your hotbar to open recipes. Pick a recipe, gather materials, then craft tools, campfires, and placeables.',
      targetAnchorId: 'hud-toolbar-craft',
      advanceEvent: 'craft-mode-select',
      tipPlacement: 'above',
    },
    {
      id: 'codex',
      phase: 'contextual',
      title: 'The Codex',
      descriptionDesktop:
        'Open the book on the action bar for Bestiary, Herbarium, Lapidary, and more. Studying wildlife, plants, and ores fills these guides and unlocks item details.',
      descriptionMobile:
        'Open the book on the action bar for Bestiary, Herbarium, Lapidary, and more. Studying wildlife, plants, and ores fills these guides and unlocks item details.',
      targetAnchorId: 'codex-book',
      advanceEvent: 'codex-open',
      tipPlacement: 'below',
    },
    {
      id: 'study',
      phase: 'contextual',
      title: 'Study corpses',
      descriptionDesktop:
        'After a kill, tap the body and press Study. Larger animals take longer but grant more Bestiary points toward 100 per species.',
      descriptionMobile:
        'After a kill, tap the body and press Study. Larger animals take longer but grant more Bestiary points toward 100 per species.',
      targetAnchorId: 'study-interaction',
      advanceEvent: 'study-start',
      tipPlacement: 'above',
    },
    {
      id: 'build',
      phase: 'contextual',
      title: 'Build on your land',
      descriptionDesktop:
        'Switch to Build on land you own. Click tiles to place blocks, campfires, and crafted structures from your hotbar.',
      descriptionMobile:
        'Switch to Build on land you own. Tap tiles to place blocks, campfires, and crafted structures from your hotbar.',
      targetAnchorId: 'hud-toolbar-build-claim',
      advanceEvent: 'build-mode-select',
      tipPlacement: 'above',
    },
    {
      id: 'claim',
      phase: 'contextual',
      title: 'Claim your realm',
      descriptionDesktop:
        'Use Claim to grow your plot. Paint tiles beside owned land to expand, save coords, track bookmarks, and teleport to your regions.',
      descriptionMobile:
        'Use Claim to grow your plot. Paint tiles beside owned land to expand, save coords, track bookmarks, and teleport to your regions.',
      targetAnchorId: 'hud-toolbar-build-claim',
      advanceEvent: 'claim-mode-select',
      tipPlacement: 'above',
    },
    {
      id: 'spritcore',
      phase: 'contextual',
      title: 'Spritcore',
      descriptionDesktop:
        'Spritcore orbs are currency from wildlife. Open your profile and spend them on health, damage, defense, and speed upgrades.',
      descriptionMobile:
        'Spritcore orbs are currency from wildlife. Open your profile and spend them on health, damage, defense, and speed upgrades.',
      targetAnchorId: 'profile-panel',
      advanceEvent: 'spritcore-view',
      tipPlacement: 'below',
    },
    {
      id: 'pets',
      phase: 'contextual',
      title: 'Your pets',
      descriptionDesktop:
        'The paw button opens your pet roster. Feed loyal companions, heal them, and spend Spritcore on their combat upgrades.',
      descriptionMobile:
        'The paw button opens your pet roster. Feed loyal companions, heal them, and spend Spritcore on their combat upgrades.',
      targetAnchorId: 'pets-roster',
      advanceEvent: 'pets-open',
      tipPlacement: 'below',
    },
  ];

const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_BY_ID = Object.fromEntries(
  DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_REGISTRY.map((definition) => [
    definition.id,
    definition,
  ])
) as Record<
  WorldPlazaOnboardingCoachmarkStepId,
  WorldPlazaOnboardingCoachmarkDefinition
>;

/**
 * Looks up one coachmark definition by step id.
 */
export function resolvingWorldPlazaOnboardingCoachmarkDefinition(
  stepId: WorldPlazaOnboardingCoachmarkStepId
): WorldPlazaOnboardingCoachmarkDefinition {
  return DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_BY_ID[stepId];
}
