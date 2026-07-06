/**
 * Unified declarative layout for all fixed-position plaza gameplay HUD elements.
 *
 * Edit this file to reposition, restack, or resize HUD chrome across the viewport.
 * Feature-specific behavior stays in each feature's `defining*` module; anchors,
 * z-index, and corner insets live here. Shared visual chrome lives in
 * `definingWorldPlazaGameplayHudStyleConstants.ts`.
 *
 * @module components/world/domains/definingWorldPlazaGameplayHudLayoutConstants
 */

/** Screen region used to group HUD slots for editing. */
export type DefiningWorldPlazaGameplayHudRegion =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'rightEdge'
  | 'fullViewport'
  | 'worldAnchored';

/** Corner / edge inset values (px) for a viewport mode. */
export type DefiningWorldPlazaGameplayHudViewportInsets = {
  /** Distance from left, right, and bottom edges when a slot uses corner inset. */
  readonly edgeBasePx: number;
};

/**
 * Complete fixed-position HUD layout tree.
 *
 * `worldAnchored` slots (health bars, name labels, chat bubbles) follow the
 * camera and are listed here for reference only — their anchors are computed
 * per-entity in world space.
 */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT = {
  /**
   * DOM overlay root above the Pixi canvas. All fixed HUD children render
   * inside this layer in `renderingWorldPlazaGameplayHud`.
   */
  overlayLayerClassName:
    'pointer-events-none absolute inset-0 z-20 select-none',

  /** Z-index reference for stacking related HUD chrome. */
  zIndex: {
    minimap: 20,
    statusEffects: 20,
    roomStatus: 20,
    gameplayToast: 30,
    devPanel: 30,
    controlsHint: 30,
    inventoryHotbar: 40,
    actionBar: 40,
    mobileJump: 40,
    friendsPanel: 40,
    editModeHotbar: 40,
    presenceOverlay: 40,
    deathScreen: 40,
    worldAnchoredLabels: 35,
    inventoryDropArrow: 60,
  },

  /**
   * Shared corner insets keyed by host viewport mode and platform.
   * Individual slots may override or add clearance (e.g. minimap above hotbar).
   */
  viewportInsets: {
    embedded: {
      desktop: { edgeBasePx: 12 },
      mobile: { edgeBasePx: 12 },
    },
    fullscreen: {
      desktop: { edgeBasePx: 16 },
      mobile: { edgeBasePx: 16 },
    },
  },

  regions: {
    /** Top-left: dev tools launcher and panel. */
    topLeft: {
      devModePanel: {
        anchorClassName:
          'pointer-events-none absolute left-3 z-30 flex max-w-[min(92vw,18rem)] select-none flex-col',
        topWithStaminaBarClassName: 'top-[6.75rem]',
        topWithoutStaminaBarClassName: 'top-[4.5rem]',
      },
      debugControlsStack: {
        anchorClassName:
          'pointer-events-none absolute left-3 z-20 flex select-none flex-col',
      },
    },

    /** Top-center: action bar pill and inline chat slot. */
    topCenter: {
      actionBar: {
        desktopAnchorClassName:
          'pointer-events-none absolute inset-x-0 top-1 z-40 flex justify-center px-3',
        mobileAnchorClassName:
          'pointer-events-none absolute inset-x-0 top-1 z-40 flex justify-center px-2',
        anchorTopBasePx: 4,
      },
    },

    /** Top-right: online room status and local buff/debuff stack. */
    topRight: {
    roomStatusHud: {
      anchorClassName:
        'pointer-events-none absolute right-3 top-3 hidden flex-col gap-1 md:flex',
    },
      statusEffectStack: {
        desktopAnchorClassName:
          'pointer-events-none absolute right-3 z-20 flex select-none flex-col items-end gap-1',
        mobileAnchorClassName:
          'pointer-events-none absolute right-2 z-20 flex select-none flex-col items-end gap-0.5',
        desktopTopClassName: 'top-3',
        mobileTopClassName: 'top-2',
        topWithRoomHudClassName: 'top-3 md:top-28',
        mobileBelowActionBarGapBasePx: 4,
      },
    },

    /** Bottom-left: unified minimap + environment bar card. */
    bottomLeft: {
      minimapStack: {
        anchorClassName:
          'pointer-events-none absolute z-20 flex flex-col items-start select-none',
      },
    },

    /** Bottom-center: inventory hotbar, edit-mode hotbars, gameplay toasts. */
    bottomCenter: {
      inventoryHotbar: {
        anchorClassName:
          'pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center px-3',
      },
      editModeHotbar: {
        anchorClassName:
          'pointer-events-none absolute inset-x-0 bottom-3 z-40 flex justify-center px-3',
      },
      gameplayHudToast: {
        anchorClassName:
          'pointer-events-none absolute inset-x-0 bottom-24 z-30 flex justify-center transition-opacity ease-out',
      },
      controlsHintToast: {
        anchorClassName:
          'pointer-events-none absolute inset-x-0 top-1/4 z-30 flex justify-center transition-opacity duration-700 ease-out',
      },
    },

    /** Bottom-right: mobile jump button. */
    bottomRight: {
      mobileJumpButton: {
        anchorClassName:
          'pointer-events-none absolute z-40 flex items-end justify-end',
      },
    },

    /** Full-height right edge: friends sidebar panel. */
    rightEdge: {
      friendsPanel: {
        anchorClassName:
          'pointer-events-none absolute inset-y-0 right-0 z-40 flex min-h-0 flex-col pt-2 pb-16',
      },
    },

    /** Full-viewport overlays (blocking modals, reconnect, death screen). */
    fullViewport: {
      presenceReconnect: {
        anchorClassName:
          'pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black/75 px-6 text-center',
      },
      deathScreen: {
        anchorClassName:
          'pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-black',
      },
      landscapePrompt: {
        anchorClassName:
          'pointer-events-auto absolute inset-0 z-50 flex items-center justify-center bg-black/90 px-6 text-center',
      },
    },

    /**
     * World-anchored HUD (position follows camera / entity). Listed for the
     * layout map; anchors are resolved in each component from world coords.
     */
    worldAnchored: {
      entityHealthBars: { layerZIndex: 25 },
      entityHealthFloatTexts: { layerZIndex: 26 },
      playerNameLabels: { layerZIndex: 25 },
      roomChatBubbles: { layerZIndex: 25 },
      roomTypingIndicators: { layerZIndex: 25 },
      groundItems: {
        anchorClassName:
          'pointer-events-auto absolute left-0 top-0 z-50 flex flex-col items-center gap-0.5',
      },
      inventoryDropArrow: {
        anchorClassName:
          'pointer-events-none absolute left-0 top-0 z-[60] flex items-center justify-center',
      },
      savedCoordsMarkers: {
        anchorClassName:
          'pointer-events-none absolute left-0 top-0 z-[35] will-change-transform select-none',
      },
      friendTrackingArrow: {
        anchorClassName:
          'pointer-events-none absolute left-0 top-0 z-40 will-change-transform',
      },
    },
  },
} as const;

/** Top-center action bar desktop anchor (re-exported by action bar constants). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_ACTION_BAR_DESKTOP_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topCenter.actionBar
    .desktopAnchorClassName;

/** Top-center action bar mobile anchor (re-exported by action bar constants). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_ACTION_BAR_MOBILE_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topCenter.actionBar
    .mobileAnchorClassName;

/** Bottom-center inventory hotbar anchor (re-exported by inventory constants). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_INVENTORY_HOTBAR_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomCenter.inventoryHotbar
    .anchorClassName;

/** Bottom-left minimap stack anchor (re-exported by minimap stack constants). */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_MINI_MAP_STACK_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.bottomLeft.minimapStack
    .anchorClassName;

/** Top-right room status HUD anchor (position only; shell from style constants). */
export const STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_ANCHOR_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.regions.topRight.roomStatusHud
    .anchorClassName;
