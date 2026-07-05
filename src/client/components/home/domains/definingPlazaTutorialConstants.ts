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
