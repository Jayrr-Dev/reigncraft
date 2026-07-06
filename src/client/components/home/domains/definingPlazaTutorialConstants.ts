/** Stable id for one how-to-play tab category. */
export type PlazaTutorialTabId = 'movement' | 'realm' | 'survival';

/** Stable id for one tutorial section card inside a tab. */
export type PlazaTutorialSectionId =
  | 'move-around'
  | 'run-jump'
  | 'sprint-stamina'
  | 'world-layers'
  | 'climb-blocks'
  | 'claim-land'
  | 'build-realm'
  | 'stay-alive'
  | 'manage-hunger'
  | 'read-minimap'
  | 'explore-biomes'
  | 'watch-temperature'
  | 'use-inventory'
  | 'track-status-effects';

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
            'Sprinting drains the stamina bar under your health bar. Stop to recover — when it empties, sprinting locks until the bar refills. Jumping spends stamina too.',
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
      id: 'realm',
      label: 'Realm',
      sections: [
        {
          id: 'claim-land',
          title: 'Claim Land',
          description:
            'Open Claim mode from the action bar (or press C), then select tiles beside your territory.',
          icon: 'mdi:crosshairs-gps',
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
            'Hunger drains over time and faster while moving. Double-click food in your hotbar to eat. Starving slows you down and damages health.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'read-minimap',
          title: 'Mini Map',
          description:
            'The map in the bottom-left shows nearby terrain, biome, and coordinates. You are the yellow dot, other players are blue, and your claimed land is highlighted in orange.',
          icon: 'mdi:compass',
        },
        {
          id: 'explore-biomes',
          title: 'Explore Biomes',
          description:
            'The world is split into regions like plains, forests, deserts, and snowy tundra. Each biome changes the ground, trees, water, music, and weather. Check the minimap label to see where you are.',
          icon: 'mdi:pine-tree',
        },
        {
          id: 'watch-temperature',
          title: 'Watch Temperature',
          description:
            'Your local temperature sits on the minimap next to the clock. Mild weather is safe. Extreme heat or cold deals damage over time. Move to shelter or buff up resistance before you scorch or freeze.',
          icon: 'mdi:thermometer',
        },
        {
          id: 'use-inventory',
          title: 'Inventory',
          description:
            'Your five-slot hotbar sits at the bottom center. Click a slot to equip tools, drag to rearrange, and drag items out to drop them. Walk over ground loot to pick it up.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track active conditions — bleed, poison, burns, frost, shields, and buffs. Numbers show remaining damage, time left, or strength.',
          icon: 'mdi:shield-half-full',
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
            'Sprinting drains the stamina bar under your health bar. Stop moving to recover — when it empties, you cannot sprint again until it refills. Jumping spends stamina too.',
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
      id: 'realm',
      label: 'Realm',
      sections: [
        {
          id: 'claim-land',
          title: 'Claim Land',
          description:
            'Open Claim mode from the top action bar, then tap tiles beside your territory.',
          icon: 'mdi:crosshairs-gps',
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
            'Hunger drains over time and faster while moving. Double-tap food in your hotbar to eat. Starving slows you down and damages health.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'read-minimap',
          title: 'Mini Map',
          description:
            'The map in the bottom-left shows nearby terrain, biome, and coordinates. You are the yellow dot, other players are blue, and your claimed land is highlighted in orange.',
          icon: 'mdi:compass',
        },
        {
          id: 'explore-biomes',
          title: 'Explore Biomes',
          description:
            'The world is split into regions like plains, forests, deserts, and snowy tundra. Each biome changes the ground, trees, water, music, and weather. Check the minimap label to see where you are.',
          icon: 'mdi:pine-tree',
        },
        {
          id: 'watch-temperature',
          title: 'Watch Temperature',
          description:
            'Your local temperature sits on the minimap next to the clock. Mild weather is safe. Extreme heat or cold deals damage over time. Move to shelter or buff up resistance before you scorch or freeze.',
          icon: 'mdi:thermometer',
        },
        {
          id: 'use-inventory',
          title: 'Inventory',
          description:
            'Your five-slot hotbar sits at the bottom center. Tap a slot to equip tools, drag to rearrange, and drag items out to drop them. Walk over ground loot to pick it up.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track active conditions — bleed, poison, burns, frost, shields, and buffs. Numbers show remaining damage, time left, or strength.',
          icon: 'mdi:shield-half-full',
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
