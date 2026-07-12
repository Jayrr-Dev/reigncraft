/** Stable id for one how-to-play tab category. */
export type PlazaTutorialTabId = 'movement' | 'combat' | 'realm' | 'survival';

/** Stable id for one tutorial section card inside a tab. */
export type PlazaTutorialSectionId =
  | 'move-around'
  | 'run-jump'
  | 'sprint-stamina'
  | 'world-layers'
  | 'climb-blocks'
  | 'roll-dodge'
  | 'melee-attack'
  | 'plots-and-claims'
  | 'save-coords'
  | 'track-coords'
  | 'teleport-plots'
  | 'build-realm'
  | 'stay-alive'
  | 'manage-hunger'
  | 'cook-wild-meat'
  | 'study-wildlife'
  | 'read-minimap'
  | 'use-inventory'
  | 'track-status-effects'
  | 'track-buff-badges';

export type PlazaTutorialSectionDefinition = {
  id: PlazaTutorialSectionId;
  title: string;
  description: string;
  icon: string;
};

export type PlazaTutorialTabDefinition = {
  id: PlazaTutorialTabId;
  label: string;
  sections: PlazaTutorialSectionDefinition[];
};

/** Desktop keyboard and mouse tutorial content. */
export const DEFINING_PLAZA_TUTORIAL_TABS_DESKTOP: PlazaTutorialTabDefinition[] =
  [
    {
      id: 'movement',
      label: 'Movement',
      sections: [
        {
          id: 'move-around',
          title: 'Move Around',
          description:
            'Click any walkable tile to path there. WASD and arrow keys work too.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'run-jump',
          title: 'Run & Jump',
          description:
            'Double-click to run or hold Shift while moving. Press Space to jump.',
          icon: 'mdi:arrow-up-bold',
        },
        {
          id: 'sprint-stamina',
          title: 'Sprint & Stamina',
          description:
            'Sprinting drains the stamina bar under your health bar. Stop to recover — when it empties, sprinting locks until the bar refills. Jumping and rolling spend stamina too.',
          icon: 'mdi:run-fast',
        },
        {
          id: 'world-layers',
          title: 'World Layers',
          description:
            'Every tile has a height layer. Ground is layer 1 — blocks and hills stack higher. Your avatar stands on its current layer and drops when you walk off a ledge.',
          icon: 'mdi:layers-triple',
        },
        {
          id: 'climb-blocks',
          title: 'Climb & Jump Up',
          description:
            'Walk onto a single-block step to rise one layer. Jump to reach ledges up to 4 layers above you. Taller walls block you until you find another way up.',
          icon: 'mdi:stairs-up',
        },
      ],
    },
    {
      id: 'combat',
      label: 'Combat',
      sections: [
        {
          id: 'roll-dodge',
          title: 'Roll Dodge',
          description:
            'Press R to dodge-roll in your facing direction, or in your movement direction while using WASD. Physical hits during the roll deal much less damage. You can roll out of a hit stagger. Rolling costs extra stamina and you cannot roll again until the animation finishes.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'melee-attack',
          title: 'Melee Attack',
          description:
            'Click a nearby animal or enemy to strike. You must be in melee range. Hold right-click to face the mouse before you swing. Attack power and speed come from your character stats.',
          icon: 'boxicons:sword-filled',
        },
      ],
    },
    {
      id: 'realm',
      label: 'Realm',
      sections: [
        {
          id: 'plots-and-claims',
          title: 'Plots & Claims',
          description:
            'Open Claim mode (C) to grow your realm. Plots are connected regions you own (gold on the minimap). Claim tiles beside your land to expand. Watch your plot and tile caps at the top of the claim list. Temporary tile claims let you build on single distant tiles without linking them to your main plot.',
          icon: 'mdi:crosshairs-gps',
        },
        {
          id: 'save-coords',
          title: 'Save Coords',
          description:
            'Open Claim mode (C) and press Save Coords while hovering a tile. You can bookmark up to 3 locations. Saved coords appear in the list at the bottom of Claim mode.',
          icon: 'mdi:content-save',
        },
        {
          id: 'track-coords',
          title: 'Track Coords',
          description:
            'In Claim mode, press Track on a saved coordinate. A direction arrow points the way and a star marks the tile in the world. Press Track again to stop following it.',
          icon: 'mdi:compass',
        },
        {
          id: 'teleport-plots',
          title: 'Teleport',
          description:
            'In Claim mode, use Teleport to Plot on any of your regions to jump there instantly. The screen fades out and back in. Approved friend plot visits teleport the same way once the host accepts.',
          icon: 'mdi:door-open',
        },
        {
          id: 'build-realm',
          title: 'Build Your Realm',
          description:
            'Switch to Build mode (B) on land you own. Stack blocks, raise walls, and shape the world.',
          icon: 'mdi:hammer',
        },
      ],
    },
    {
      id: 'survival',
      label: 'Survival',
      sections: [
        {
          id: 'stay-alive',
          title: 'Stay Alive',
          description:
            'Your health bar sits above your avatar. Avoid hazards, heal when you can, and watch for damage numbers.',
          icon: 'solar:heart-pulse-bold',
        },
        {
          id: 'manage-hunger',
          title: 'Manage Hunger',
          description:
            'Hunger drains over time and faster while moving. Double-click food in your hotbar to eat. Walk, jump, roll, or take a hit to cancel mid-bite. Starving slows you down and damages health.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'cook-wild-meat',
          title: 'Cook Wild Meat',
          description:
            'Raw wildlife meat can infect you with a disease that incubates for hours or in-game days before symptoms show. Later stages bring nausea, poison, confusion, sleep, or locked jump and roll. Cook cuts at a campfire first. Cooked meat is safe and may grant a short well-fed buff.',
          icon: 'mdi:biohazard',
        },
        {
          id: 'study-wildlife',
          title: 'Study Wildlife',
          description:
            'After a kill, the body stays for about a minute. Click the corpse and press Study. Larger animals take longer (3 to 10 seconds) and can grant 1 to 3 study points. Open Guide, then Bestiary, to track each species toward 200.',
          icon: 'mdi:book-open-page-variant',
        },
        {
          id: 'read-minimap',
          title: 'Mini Map',
          description:
            'The map in the top-left shows nearby terrain, biome, and coordinates. You are the yellow dot, other players are blue, and your claimed land is highlighted in orange.',
          icon: 'mdi:compass',
        },
        {
          id: 'use-inventory',
          title: 'Inventory',
          description:
            'Your five-slot hotbar sits at the bottom center. Click a slot to equip tools, drag to rearrange, and drag items out to drop them. Walk over ground loot to pick it up. Snatching meat while an animal is still eating it takes longer and makes that animal fight you until one of you dies.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track active conditions — bleed, poison, burns, frost, shields, and buffs. Numbers show remaining damage, time left, or strength.',
          icon: 'mdi:shield-half-full',
        },
        {
          id: 'track-buff-badges',
          title: 'Buff Badges',
          description:
            'Small icons below your health bar show combat buffs, debuffs, and diseases. Gold borders are buffs; red borders are debuffs; lime or purple borders are diseases from raw meat. Tap a badge for details.',
          icon: 'mdi:shield-check',
        },
      ],
    },
  ];

/** Mobile touch tutorial content. */
export const DEFINING_PLAZA_TUTORIAL_TABS_MOBILE: PlazaTutorialTabDefinition[] =
  [
    {
      id: 'movement',
      label: 'Movement',
      sections: [
        {
          id: 'move-around',
          title: 'Move Around',
          description:
            'Tap any walkable tile to path there. Your avatar walks automatically.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'run-jump',
          title: 'Run & Jump',
          description:
            'Double-tap a destination to run. Tap again while moving to keep running. Use the jump button to leap.',
          icon: 'mdi:arrow-up-bold',
        },
        {
          id: 'sprint-stamina',
          title: 'Sprint & Stamina',
          description:
            'Sprinting drains the stamina bar under your health bar. Stop moving to recover — when it empties, you cannot sprint again until it refills. Jumping and rolling spend stamina too.',
          icon: 'mdi:run-fast',
        },
        {
          id: 'world-layers',
          title: 'World Layers',
          description:
            'Every tile has a height layer. Ground is layer 1 — blocks and hills stack higher. Your avatar stands on its current layer and drops when you walk off a ledge.',
          icon: 'mdi:layers-triple',
        },
        {
          id: 'climb-blocks',
          title: 'Climb & Jump Up',
          description:
            'Walk onto a single-block step to rise one layer. Use the jump button to reach ledges up to 4 layers above you. Taller walls block you until you find another way up.',
          icon: 'mdi:stairs-up',
        },
      ],
    },
    {
      id: 'combat',
      label: 'Combat',
      sections: [
        {
          id: 'roll-dodge',
          title: 'Roll Dodge',
          description:
            'Tap the roll button to dodge in your facing direction. Physical hits during the roll deal much less damage. You can roll out of a hit stagger. Rolling costs extra stamina and you cannot roll again until the animation finishes.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'melee-attack',
          title: 'Melee Attack',
          description:
            'Tap a nearby animal or enemy to strike. You must be in melee range. Attack power and speed come from your character stats.',
          icon: 'boxicons:sword-filled',
        },
      ],
    },
    {
      id: 'realm',
      label: 'Realm',
      sections: [
        {
          id: 'plots-and-claims',
          title: 'Plots & Claims',
          description:
            'Open Claim mode from the action bar to grow your realm. Plots are connected regions you own (gold on the minimap). Tap tiles beside your land to expand. Watch your plot and tile caps at the top of the claim list. Temporary tile claims let you build on single distant tiles without linking them to your main plot.',
          icon: 'mdi:crosshairs-gps',
        },
        {
          id: 'save-coords',
          title: 'Save Coords',
          description:
            'Double-tap the tile you are standing on to open the Save Coords popover. You can bookmark up to 3 locations. Saved coords appear in the list at the bottom of Claim mode.',
          icon: 'mdi:content-save',
        },
        {
          id: 'track-coords',
          title: 'Track Coords',
          description:
            'In Claim mode, tap Track on a saved coordinate. A direction arrow points the way and a star marks the tile in the world. Tap Track again to stop following it.',
          icon: 'mdi:compass',
        },
        {
          id: 'teleport-plots',
          title: 'Teleport',
          description:
            'In Claim mode, tap Teleport to Plot on any of your regions to jump there instantly. The screen fades out and back in. Approved friend plot visits teleport the same way once the host accepts.',
          icon: 'mdi:door-open',
        },
        {
          id: 'build-realm',
          title: 'Build Your Realm',
          description:
            'Switch to Build mode from the action bar on land you own. Tap tiles to place blocks.',
          icon: 'mdi:hammer',
        },
      ],
    },
    {
      id: 'survival',
      label: 'Survival',
      sections: [
        {
          id: 'stay-alive',
          title: 'Stay Alive',
          description:
            'Your health bar sits above your avatar. Avoid hazards, heal when you can, and watch for damage numbers.',
          icon: 'solar:heart-pulse-bold',
        },
        {
          id: 'manage-hunger',
          title: 'Manage Hunger',
          description:
            'Hunger drains over time and faster while moving. Double-tap food in your hotbar to eat. Walk, jump, roll, or take a hit to cancel mid-bite. Starving slows you down and damages health.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'cook-wild-meat',
          title: 'Cook Wild Meat',
          description:
            'Raw wildlife meat can infect you with a disease that incubates for hours or in-game days before symptoms show. Later stages bring nausea, poison, confusion, sleep, or locked jump and roll. Cook cuts at a campfire first. Cooked meat is safe and may grant a short well-fed buff.',
          icon: 'mdi:biohazard',
        },
        {
          id: 'study-wildlife',
          title: 'Study Wildlife',
          description:
            'After a kill, the body stays for about a minute. Tap the corpse and press Study. Larger animals take longer (3 to 10 seconds) and can grant 1 to 3 study points. Open Guide, then Bestiary, to track each species toward 200.',
          icon: 'mdi:book-open-page-variant',
        },
        {
          id: 'read-minimap',
          title: 'Mini Map',
          description:
            'The map in the top-left shows nearby terrain, biome, and coordinates. You are the yellow dot, other players are blue, and your claimed land is highlighted in orange.',
          icon: 'mdi:compass',
        },
        {
          id: 'use-inventory',
          title: 'Inventory',
          description:
            'Your five-slot hotbar sits at the bottom center. Tap a slot to equip tools, drag to rearrange, and drag items out to drop them. Walk over ground loot to pick it up. Snatching meat while an animal is still eating it takes longer and makes that animal fight you until one of you dies.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track active conditions — bleed, poison, burns, frost, shields, and buffs. Numbers show remaining damage, time left, or strength.',
          icon: 'mdi:shield-half-full',
        },
        {
          id: 'track-buff-badges',
          title: 'Buff Badges',
          description:
            'Small icons below your health bar show combat buffs, debuffs, and diseases. Gold borders are buffs; red borders are debuffs; lime or purple borders are diseases from raw meat. Tap a badge for details.',
          icon: 'mdi:shield-check',
        },
      ],
    },
  ];

/** Default tab shown when the how-to-play panel opens. */
export const DEFINING_PLAZA_TUTORIAL_DEFAULT_TAB_ID: PlazaTutorialTabId =
  'movement';

/**
 * Returns the tutorial tab set for the current platform.
 *
 * @param isMobile - True on viewports under 768px wide.
 */
export function resolvingPlazaTutorialTabs(
  isMobile: boolean
): PlazaTutorialTabDefinition[] {
  return isMobile
    ? DEFINING_PLAZA_TUTORIAL_TABS_MOBILE
    : DEFINING_PLAZA_TUTORIAL_TABS_DESKTOP;
}

/** Subtitle copy shown under the how-to-play panel title. */
export function resolvingPlazaTutorialPanelSubtitle(isMobile: boolean): string {
  return isMobile
    ? 'Touch controls with live examples'
    : 'Keyboard and mouse with live examples';
}
