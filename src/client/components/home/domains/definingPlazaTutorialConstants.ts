/** Stable id for one how-to-play tab category. */
export type PlazaTutorialTabId =
  | 'movement'
  | 'combat'
  | 'realm'
  | 'survival'
  | 'character';

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
  | 'fish-waters'
  | 'read-minimap'
  | 'use-inventory'
  | 'track-status-effects'
  | 'track-buff-badges'
  | 'open-character-profile'
  | 'upgrade-with-spritcore';

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
            'Sprinting drains the gold stamina bar under your health. Stop to refill. Empty the bar and sprint locks briefly until it refills enough. Jumping and rolling spend stamina too.',
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
            'Press R to dodge-roll. Hold WASD to roll that way; otherwise you roll the way you face (hold right-click to aim). Mid-roll, physical hits deal far less damage. You can roll out of a hit stagger. Sleep and stun block rolls. Costs stamina; wait for the animation to finish before rolling again.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'melee-attack',
          title: 'Melee Attack',
          description:
            'Click a live animal to lock on (amber marker). You run in if needed and keep swinging until you cancel: click empty ground, a corpse, or another interactable, or open chat. Hold right-click to face the mouse. Equip a sword in the hotbar for more damage.',
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
            "Open Claim mode (C). Arm the Claim tool, then click sky-blue tiles to paint land. Your first plot can start almost anywhere; later claims expand beside owned land, or open a new plot if you still have slots. Caps are 3 plots and 64 tiles. Owned land is orange on the minimap and in Claim mode. Stay at least 3 tiles from other players' plots. Double-click a tile for Claim, Unclaim, or Save Coords.",
          icon: 'mdi:crosshairs-gps',
        },
        {
          id: 'save-coords',
          title: 'Save Coords',
          description:
            'In Claim mode, press Save Coords, then click the tile you want to bookmark. You can save up to 3 locations under Saved Coords. You can also double-click a tile and choose Save Coords.',
          icon: 'mdi:content-save',
        },
        {
          id: 'track-coords',
          title: 'Track Coords',
          description:
            'In Claim mode, press Track on a saved coordinate. A direction arrow points the way and a star marks the tile. Press Track again to stop.',
          icon: 'mdi:compass',
        },
        {
          id: 'teleport-plots',
          title: 'Teleport',
          description:
            "In Claim mode, press Teleport on one of your plot cards to jump there. On a friend's plot, press Visit; once they approve, Teleport works the same way.",
          icon: 'mdi:door-open',
        },
        {
          id: 'build-realm',
          title: 'Build Your Realm',
          description:
            'Switch to Build mode (B) on land you own. Use Place to set blocks and Remove to clear them. Pick materials from the build hotbar. Each plot holds up to 256 blocks.',
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
            'Your health bar sits above your avatar. Avoid wildlife hits, lava, and cold. Health only regenerates when you are not too hungry. Watch floating damage numbers and the top-right status icons.',
          icon: 'solar:heart-pulse-bold',
        },
        {
          id: 'manage-hunger',
          title: 'Manage Hunger',
          description:
            'Hunger drains over time, faster when you walk or sprint. Double-click food in your hotbar to eat. Moving, jumping, rolling, or taking a hit cancels the bite. Get too hungry and you lose sprint, then jump, then take damage until you eat.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'cook-wild-meat',
          title: 'Cook Wild Meat',
          description:
            'Raw wildlife meat can infect you. Symptoms show only after a silent incubation. Light a campfire, stay close with raw meat in inventory, and use Cook. Cooked meat is usually safer and may grant a short well-fed buff.',
          icon: 'mdi:biohazard',
        },
        {
          id: 'study-wildlife',
          title: 'Study Wildlife',
          description:
            'After a kill, the body stays briefly. Click the corpse and Study. Open Codex, then Bestiary, to track each species. Higher study unlocks deeper dossier lines and clearer meat details.',
          icon: 'mdi:book-open-page-variant',
        },
        {
          id: 'fish-waters',
          title: 'Fishing',
          description:
            'Equip a fishing rod in the fist slot, stand within 2 tiles of open water, then click Fish. Stay still while the cast runs. When the label flips to Reel, click to cut escape chance and finish faster. Better rods catch quicker and lose fewer fish. Catch may include creatures or junk; rarer pulls can drop Spritcore nearby.',
          icon: 'mdi:fishing',
        },
        {
          id: 'read-minimap',
          title: 'Mini Map',
          description:
            'The map in the top-left shows nearby terrain, biome, and coordinates. You are the yellow dot, other players are blue, and your claimed land is orange.',
          icon: 'mdi:compass',
        },
        {
          id: 'use-inventory',
          title: 'Inventory',
          description:
            'Your six-slot hotbar sits at the bottom. The far-left slot is weapons and tools (empty shows a fist). Click a slot for actions, drag to rearrange, or choose Drop and click the ground. Walk over loot to pick it up. Grabbing food while an animal is eating it takes time and makes that animal fight you.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track bleed, poison, heat, cold, lava burn, frostbite, shields, and similar conditions. Numbers show stacks or time left. Click a row for the summary.',
          icon: 'mdi:shield-half-full',
        },
        {
          id: 'track-buff-badges',
          title: 'Buff Badges',
          description:
            'Small icons below your health bar show combat buffs, debuffs, and diseases. Gold borders are buffs; red borders are debuffs. Click a badge for details. Disease badges appear only after incubation ends.',
          icon: 'mdi:shield-plus',
        },
      ],
    },
    {
      id: 'character',
      label: 'Character',
      sections: [
        {
          id: 'open-character-profile',
          title: 'Character Profile',
          description:
            'Open Character from the action bar (person icon). Status shows vitals, armor, and active effects. Stats breaks down combat, agility, and physicality. Use this sheet to check bonuses before a fight or a long trek.',
          icon: 'mdi:shield-account',
        },
        {
          id: 'upgrade-with-spritcore',
          title: 'Spritcore Upgrades',
          description:
            'Open the Upgrade tab on your Character sheet. Spend Spritcore orbs from kills on Health, Damage, Attack speed, Defense, or Speed. Press Commit on a lane to buy the next step. Prices rise as you invest. Death cuts invested power by 8% and spills some carried orbs.',
          icon: 'mdi:heart-plus',
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
            'Sprinting drains the gold stamina bar under your health. Stop to refill. Empty the bar and sprint locks briefly until it refills enough. Jumping and rolling spend stamina too.',
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
            'Tap the roll button to dodge-roll the way you face. Mid-roll, physical hits deal far less damage. You can roll out of a hit stagger. Sleep and stun block rolls. Costs stamina; wait for the animation to finish before rolling again.',
          icon: 'ph:person-simple-run',
        },
        {
          id: 'melee-attack',
          title: 'Melee Attack',
          description:
            'Tap a live animal to lock on (amber marker). You run in if needed and keep swinging until you cancel: tap empty ground, a corpse, or another interactable. Equip a sword in the hotbar for more damage.',
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
            "Open Claim mode from the action bar. Arm the Claim tool, then tap sky-blue tiles to paint land. Your first plot can start almost anywhere; later claims expand beside owned land, or open a new plot if you still have slots. Caps are 3 plots and 64 tiles. Owned land is orange on the minimap and in Claim mode. Stay at least 3 tiles from other players' plots. Double-tap a tile for Claim, Unclaim, or Save Coords.",
          icon: 'mdi:crosshairs-gps',
        },
        {
          id: 'save-coords',
          title: 'Save Coords',
          description:
            'In Claim mode, tap Save Coords, then tap the tile you want to bookmark. You can save up to 3 locations under Saved Coords. You can also double-tap a tile and choose Save Coords.',
          icon: 'mdi:content-save',
        },
        {
          id: 'track-coords',
          title: 'Track Coords',
          description:
            'In Claim mode, tap Track on a saved coordinate. A direction arrow points the way and a star marks the tile. Tap Track again to stop.',
          icon: 'mdi:compass',
        },
        {
          id: 'teleport-plots',
          title: 'Teleport',
          description:
            "In Claim mode, tap Teleport on one of your plot cards to jump there. On a friend's plot, tap Visit; once they approve, Teleport works the same way.",
          icon: 'mdi:door-open',
        },
        {
          id: 'build-realm',
          title: 'Build Your Realm',
          description:
            'Switch to Build mode from the action bar on land you own. Use Place to set blocks and Remove to clear them. Pick materials from the build hotbar. Each plot holds up to 256 blocks.',
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
            'Your health bar sits above your avatar. Avoid wildlife hits, lava, and cold. Health only regenerates when you are not too hungry. Watch floating damage numbers and the top-right status icons.',
          icon: 'solar:heart-pulse-bold',
        },
        {
          id: 'manage-hunger',
          title: 'Manage Hunger',
          description:
            'Hunger drains over time, faster when you walk or sprint. Double-tap food in your hotbar to eat. Moving, jumping, rolling, or taking a hit cancels the bite. Get too hungry and you lose sprint, then jump, then take damage until you eat.',
          icon: 'mdi:food-drumstick',
        },
        {
          id: 'cook-wild-meat',
          title: 'Cook Wild Meat',
          description:
            'Raw wildlife meat can infect you. Symptoms show only after a silent incubation. Light a campfire, stay close with raw meat in inventory, and use Cook. Cooked meat is usually safer and may grant a short well-fed buff.',
          icon: 'mdi:biohazard',
        },
        {
          id: 'study-wildlife',
          title: 'Study Wildlife',
          description:
            'After a kill, the body stays briefly. Tap the corpse and tap Study. Open Codex, then Bestiary, to track each species. Higher study unlocks deeper dossier lines and clearer meat details.',
          icon: 'mdi:book-open-page-variant',
        },
        {
          id: 'fish-waters',
          title: 'Fishing',
          description:
            'Equip a fishing rod in the fist slot, stand within 2 tiles of open water, then tap Fish. Stay still while the cast runs. When the label flips to Reel, tap to cut escape chance and finish faster. Better rods catch quicker and lose fewer fish. Catch may include creatures or junk; rarer pulls can drop Spritcore nearby.',
          icon: 'mdi:fishing',
        },
        {
          id: 'read-minimap',
          title: 'Mini Map',
          description:
            'The map in the top-left shows nearby terrain, biome, and coordinates. You are the yellow dot, other players are blue, and your claimed land is orange.',
          icon: 'mdi:compass',
        },
        {
          id: 'use-inventory',
          title: 'Inventory',
          description:
            'Your six-slot hotbar sits at the bottom. The far-left slot is weapons and tools (empty shows a fist). Tap a slot for actions, drag to rearrange, or choose Drop and tap the ground. Walk over loot to pick it up. Grabbing food while an animal is eating it takes time and makes that animal fight you.',
          icon: 'mdi:bag-personal',
        },
        {
          id: 'track-status-effects',
          title: 'Status Effects',
          description:
            'Icons on the top-right track bleed, poison, heat, cold, lava burn, frostbite, shields, and similar conditions. Numbers show stacks or time left. Tap a row for the summary.',
          icon: 'mdi:shield-half-full',
        },
        {
          id: 'track-buff-badges',
          title: 'Buff Badges',
          description:
            'Small icons below your health bar show combat buffs, debuffs, and diseases. Gold borders are buffs; red borders are debuffs. Tap a badge for details. Disease badges appear only after incubation ends.',
          icon: 'mdi:shield-plus',
        },
      ],
    },
    {
      id: 'character',
      label: 'Character',
      sections: [
        {
          id: 'open-character-profile',
          title: 'Character Profile',
          description:
            'Open Character from the action bar (person icon). Status shows vitals, armor, and active effects. Stats breaks down combat, agility, and physicality. Use this sheet to check bonuses before a fight or a long trek.',
          icon: 'mdi:shield-account',
        },
        {
          id: 'upgrade-with-spritcore',
          title: 'Spritcore Upgrades',
          description:
            'Open the Upgrade tab on your Character sheet. Spend Spritcore orbs from kills on Health, Damage, Attack speed, Defense, or Speed. Tap Commit on a lane to buy the next step. Prices rise as you invest. Death cuts invested power by 8% and spills some carried orbs.',
          icon: 'mdi:heart-plus',
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
