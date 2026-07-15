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
            'Double-click a destination to run, or hold click briefly to sprint while you steer. Hold Shift with WASD or arrows to sprint. Press Space to jump.',
          icon: 'mdi:arrow-up-bold',
        },
        {
          id: 'sprint-stamina',
          title: 'Sprint & Stamina',
          description:
            'Sprinting drains the green stamina bar under your health. Stop to refill. Empty the bar and sprint locks for a moment, then until the bar climbs back high enough. Jumping and rolling spend stamina too.',
          icon: 'mdi:run-fast',
        },
        {
          id: 'world-layers',
          title: 'World Layers',
          description:
            'Every tile has a height layer. Ground is layer 1; blocks and hills stack higher. Your avatar stands on its current layer and drops when you walk off a ledge.',
          icon: 'mdi:layers-triple',
        },
        {
          id: 'climb-blocks',
          title: 'Climb & Jump Up',
          description:
            'Walk onto a one-layer step to climb up. Jump (Space) to reach ledges up to 4 layers above you. Walls two or more layers taller block you until you find another way up.',
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
            'Press R to dodge-roll. While holding WASD, you roll in your move direction; otherwise you roll the way you face (hold right-click to aim facing). Mid-roll, physical hits take far less damage for a short window. You can roll out of a hit stagger. Sleep and stun block rolls. Costs about 19% of your stamina bar, and you cannot roll again until the animation finishes.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'melee-attack',
          title: 'Melee Attack',
          description:
            'Click a live animal to lock on (amber marker). If you are out of reach, you run in and auto-swing once close. Swings keep repeating until you cancel: click empty ground, a corpse, or another interactable, or open chat. Hold right-click to face the mouse. Damage rolls from your attack power; an equipped hotbar sword boosts it.',
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
            "Open Claim mode (C). Arm the Claim tool, then click sky-blue claimable tiles to paint land. Your first plot can start almost anywhere; later claims expand beside owned land, or open a new plot if you still have slots. Default caps are 3 plots and 64 tiles (badges at the top of the claim list). Owned land is orange on the minimap and in Claim mode. Stay at least 3 tiles away from other players' plots. Double-click a tile for Claim, Unclaim, or Save Coords.",
          icon: 'mdi:crosshairs-gps',
        },
        {
          id: 'save-coords',
          title: 'Save Coords',
          description:
            'In Claim mode, press Save Coords, then click the tile you want to bookmark. You can save up to 3 locations. Bookmarks appear under Saved Coords. You can also double-click a tile and choose Save Coords from the popover.',
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
            "In Claim mode, press Teleport on one of your plot cards to jump there. The screen fades out and back in. On a friend's plot, press Visit; once they approve, Teleport works the same way.",
          icon: 'mdi:door-open',
        },
        {
          id: 'build-realm',
          title: 'Build Your Realm',
          description:
            'Switch to Build mode (B) on land you own. Use Place to set blocks and Remove to clear them. Pick materials and block types from the build hotbar. Each plot holds up to 256 blocks.',
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
            'Your health bar sits above your avatar. Avoid wildlife hits, lava, and cold damage. Health only regenerates when hunger is above 30%. Watch floating damage numbers and the top-right status icons when something is ticking you down.',
          icon: 'solar:heart-pulse-bold',
        },
        {
          id: 'manage-hunger',
          title: 'Manage Hunger',
          description:
            'Hunger drains over time, faster while walking (x1.15) and much faster while sprinting (x2). Double-click food in your hotbar to eat (a short hold, about 1 to 10 seconds by food). Walk, jump, roll, or take a hit to cancel mid-bite with no consume. Below 20% you cannot sprint; below 5% you also cannot jump and move slower. At 0% hunger you take damage every 2 seconds until you eat.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'cook-wild-meat',
          title: 'Cook Wild Meat',
          description:
            'Raw wildlife meat can infect you. Infection incubates silently for in-game hours or days (no badge yet), then symptoms appear: nausea, poison, confusion, sleep, or locked sprint, jump, or roll. While sick, food restores only half hunger. Light a campfire, keep raw meat in inventory, stay within 2 tiles, and use Cook (about 2 to 12 seconds by animal). Cooked meat is usually safe and may roll a short well-fed buff. Deer and cow cooked cuts still have a small prion residual risk.',
          icon: 'mdi:biohazard',
        },
        {
          id: 'study-wildlife',
          title: 'Study Wildlife',
          description:
            'After a kill, the body stays about 60 seconds. Click the corpse and press Study. Larger animals take longer (3 to 10 seconds) and grant 1 to 3 study points. Open Codex, then Bestiary, to track each species toward 100. Higher study unlocks deeper dossier lines and clearer meat item details.',
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
            'Your six-slot hotbar sits at the bottom center. The far-left slot is weapons and tools only (empty shows a fist). Click a slot for item actions, drag to rearrange, and drag items out to drop them. Walk over ground loot to pick it up. Snatching a stack while an animal is still eating it takes 2 to 10 seconds and makes that animal fight you until one of you dies.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track active conditions: bleed, poison, heat, cold, lava burn, frostbite stacks, shields, and similar DoTs. Numbers show remaining damage, stacks, or time left. Click a row when you need the summary line.',
          icon: 'mdi:shield-half-full',
        },
        {
          id: 'track-buff-badges',
          title: 'Buff Badges',
          description:
            'Small icons below your health bar show combat buffs, debuffs, and diseases. Gold borders are buffs; red borders are debuffs; disease badges use their own colors (often lime, purple for prions). Click a badge for details and countdown. Disease badges only appear after incubation ends.',
          icon: 'mdi:shield-plus',
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
            'Hold on a destination to sprint and steer, or double-tap to run there. Use the jump button to leap. While already running, tap again to jump. Auto jump in Settings can clear water gaps for you.',
          icon: 'mdi:arrow-up-bold',
        },
        {
          id: 'sprint-stamina',
          title: 'Sprint & Stamina',
          description:
            'Sprinting drains the green stamina bar under your health. Stop to refill. Empty the bar and sprint locks for a moment, then until the bar climbs back high enough. Jumping and rolling spend stamina too.',
          icon: 'mdi:run-fast',
        },
        {
          id: 'world-layers',
          title: 'World Layers',
          description:
            'Every tile has a height layer. Ground is layer 1; blocks and hills stack higher. Your avatar stands on its current layer and drops when you walk off a ledge.',
          icon: 'mdi:layers-triple',
        },
        {
          id: 'climb-blocks',
          title: 'Climb & Jump Up',
          description:
            'Walk onto a one-layer step to climb up. Use the jump button to reach ledges up to 4 layers above you. Walls two or more layers taller block you until you find another way up.',
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
            'Tap the roll button to dodge-roll in the direction you face. Mid-roll, physical hits take far less damage for a short window. You can roll out of a hit stagger. Sleep and stun block rolls. Costs about 19% of your stamina bar, and you cannot roll again until the animation finishes.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'melee-attack',
          title: 'Melee Attack',
          description:
            'Tap a live animal to lock on (amber marker). If you are out of reach, you run in and auto-swing once close. Swings keep repeating until you cancel: tap empty ground, a corpse, or another interactable. Damage rolls from your attack power; an equipped hotbar sword boosts it.',
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
            "Open Claim mode from the action bar. Arm the Claim tool, then tap sky-blue claimable tiles to paint land. Your first plot can start almost anywhere; later claims expand beside owned land, or open a new plot if you still have slots. Default caps are 3 plots and 64 tiles (badges at the top of the claim list). Owned land is orange on the minimap and in Claim mode. Stay at least 3 tiles away from other players' plots. Double-tap a tile for Claim, Unclaim, or Save Coords.",
          icon: 'mdi:crosshairs-gps',
        },
        {
          id: 'save-coords',
          title: 'Save Coords',
          description:
            'In Claim mode, tap Save Coords, then tap the tile you want to bookmark. You can save up to 3 locations. Bookmarks appear under Saved Coords. You can also double-tap a tile and choose Save Coords from the popover.',
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
            "In Claim mode, tap Teleport on one of your plot cards to jump there. The screen fades out and back in. On a friend's plot, tap Visit; once they approve, Teleport works the same way.",
          icon: 'mdi:door-open',
        },
        {
          id: 'build-realm',
          title: 'Build Your Realm',
          description:
            'Switch to Build mode from the action bar on land you own. Use Place to set blocks and Remove to clear them. Pick materials and block types from the build hotbar. Each plot holds up to 256 blocks.',
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
            'Your health bar sits above your avatar. Avoid wildlife hits, lava, and cold damage. Health only regenerates when hunger is above 30%. Watch floating damage numbers and the top-right status icons when something is ticking you down.',
          icon: 'solar:heart-pulse-bold',
        },
        {
          id: 'manage-hunger',
          title: 'Manage Hunger',
          description:
            'Hunger drains over time, faster while walking (x1.15) and much faster while sprinting (x2). Double-tap food in your hotbar to eat (a short hold, about 1 to 10 seconds by food). Walk, jump, roll, or take a hit to cancel mid-bite with no consume. Below 20% you cannot sprint; below 5% you also cannot jump and move slower. At 0% hunger you take damage every 2 seconds until you eat.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'cook-wild-meat',
          title: 'Cook Wild Meat',
          description:
            'Raw wildlife meat can infect you. Infection incubates silently for in-game hours or days (no badge yet), then symptoms appear: nausea, poison, confusion, sleep, or locked sprint, jump, or roll. While sick, food restores only half hunger. Light a campfire, keep raw meat in inventory, stay within 2 tiles, and use Cook (about 2 to 12 seconds by animal). Cooked meat is usually safe and may roll a short well-fed buff. Deer and cow cooked cuts still have a small prion residual risk.',
          icon: 'mdi:biohazard',
        },
        {
          id: 'study-wildlife',
          title: 'Study Wildlife',
          description:
            'After a kill, the body stays about 60 seconds. Tap the corpse and press Study. Larger animals take longer (3 to 10 seconds) and grant 1 to 3 study points. Open Codex, then Bestiary, to track each species toward 100. Higher study unlocks deeper dossier lines and clearer meat item details.',
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
            'Your six-slot hotbar sits at the bottom center. The far-left slot is weapons and tools only (empty shows a fist). Tap a slot for item actions, drag to rearrange, and drag items out to drop them. Walk over ground loot to pick it up. Snatching a stack while an animal is still eating it takes 2 to 10 seconds and makes that animal fight you until one of you dies.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track active conditions: bleed, poison, heat, cold, lava burn, frostbite stacks, shields, and similar DoTs. Numbers show remaining damage, stacks, or time left. Tap a row when you need the summary line.',
          icon: 'mdi:shield-half-full',
        },
        {
          id: 'track-buff-badges',
          title: 'Buff Badges',
          description:
            'Small icons below your health bar show combat buffs, debuffs, and diseases. Gold borders are buffs; red borders are debuffs; disease badges use their own colors (often lime, purple for prions). Tap a badge for details and countdown. Disease badges only appear after incubation ends.',
          icon: 'mdi:shield-plus',
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
