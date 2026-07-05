/** Stable id for one how-to-play tab category. */
export type PlazaTutorialTabId = 'movement' | 'realm' | 'survival';

/** Stable id for one tutorial section card inside a tab. */
export type PlazaTutorialSectionId =
  | 'move-around'
  | 'run-jump'
  | 'claim-land'
  | 'build-realm'
  | 'stay-alive';

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

/** Ordered tab categories for the how-to-play panel. Add tabs here to grow the tutorial. */
export const DEFINING_PLAZA_TUTORIAL_TABS: PlazaTutorialTabDefinition[] = [
  {
    id: 'movement',
    label: 'Movement',
    sections: [
      {
        id: 'move-around',
        title: 'Move Around',
        description:
          'Click any walkable tile to path there. On desktop, WASD and arrow keys work too.',
        icon: 'ph:person-simple-run',
      },
      {
        id: 'run-jump',
        title: 'Run & Jump',
        description:
          'Double-click to run, hold Shift while moving, or tap again on mobile while running. Press Space to jump.',
        icon: 'mdi:arrow-up-bold',
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
    ],
  },
];

/** Default tab shown when the how-to-play panel opens. */
export const DEFINING_PLAZA_TUTORIAL_DEFAULT_TAB_ID: PlazaTutorialTabId =
  'movement';
