import type {
  WorldPlazaOnboardingCoachmarkDefinition,
  WorldPlazaOnboardingCoachmarkStepId,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';

/** Linear core steps shown in order on first spawn. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CORE_ORDER: readonly WorldPlazaOnboardingCoachmarkStepId[] =
  ['move', 'hotbar', 'action-bar'];

/** Contextual steps; first eligible step wins when core is complete. */
export const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CONTEXTUAL_ORDER: readonly WorldPlazaOnboardingCoachmarkStepId[] =
  ['chop', 'loot', 'equip-tool'];

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
  ];

const DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_BY_ID =
  Object.fromEntries(
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
