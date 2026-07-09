/**
 * Unified declarative styling for all plaza gameplay HUD elements.
 *
 * Edit this file to change shared visual chrome (surfaces, typography, buttons,
 * toasts, badges). Layout anchors live in
 * `definingWorldPlazaGameplayHudLayoutConstants.ts`; complex shell paint lives
 * in `index.css` under `.plaza-*` classes referenced here.
 *
 * @module components/world/domains/definingWorldPlazaGameplayHudStyleConstants
 */

/** Shared plaza HUD style tree. */
export const DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE = {
  /**
   * CSS shell class names authored in `index.css`.
   * Change paint rules in CSS; reference the class names here.
   */
  cssShell: {
    /** DOM HUD root above the Pixi canvas (WebKit compositor stacking). */
    gameplayHudOverlay: 'plaza-gameplay-hud-overlay',
    /** Pixi stage wrapper kept below DOM HUD overlays in Safari. */
    pixiStageLayer: 'plaza-pixi-stage-layer',
    parchmentPanel: 'plaza-panel',
    actionBarShell: 'plaza-action-bar-shell',
    actionBarButton: 'plaza-action-bar-button',
    actionBarButtonActive: 'plaza-action-bar-button--active',
    actionBarDropdown: 'plaza-action-bar-dropdown',
    actionBarChatInput: 'plaza-action-bar-chat-input',
    inventoryHotbarShell: 'plaza-inventory-hotbar-shell',
    inventorySlot: 'plaza-inventory-slot',
    inventorySlotEmpty: 'plaza-inventory-slot--empty',
    inventorySlotEquipped: 'plaza-inventory-slot--equipped',
    /** Reserved weapon/tool slot outline (charcoal). */
    inventorySlotWeaponTool: 'plaza-inventory-slot--weapon-tool',
    /** Bag popover title on teal glass panels — white fill, black stroke. */
    inventoryBagPopoverLabel: 'plaza-inventory-bag-popover-label',
    statusEffectBadge: 'plaza-status-effect-badge',
    statusEffectBadgeSocket: 'plaza-status-effect-badge-socket',
    confirmDialogOverlay: 'plaza-confirm-dialog-overlay',
    confirmDialogPanel: 'plaza-confirm-dialog-panel',
    confirmDialogButtonSecondary:
      'plaza-confirm-dialog-button plaza-confirm-dialog-button--secondary',
    confirmDialogButtonPrimary:
      'plaza-confirm-dialog-button plaza-confirm-dialog-button--primary',
    explanationPopoverPanel: 'plaza-panel plaza-hud-explanation-popover',
  },

  /** Composable Tailwind surface treatments. */
  surface: {
    /** Teal glass panel with gold trim — room status, side panels. */
    glassPanel:
      'border border-poster-gold/25 bg-poster-teal-deep/85 shadow-lg shadow-black/40 backdrop-blur-sm',
    /** Compact parchment card — minimap stack, corner HUD cards. */
    parchmentCard:
      'flex flex-col rounded-md border-2 border-poster-wood/70 bg-[linear-gradient(165deg,#f0e2c4_0%,#e3d1a8_100%)] p-0.5 shadow-[inset_0_0_0_1px_rgba(255,250,230,0.6),0_3px_0_0_rgba(61,42,31,0.7),0_8px_16px_rgba(20,28,26,0.35)]',
    /** Inset frame inside parchment cards — minimap canvas. */
    parchmentCardInsetFrame:
      'overflow-hidden rounded-sm border border-poster-wood/45 shadow-[inset_0_1px_3px_rgba(20,28,26,0.4)]',
    /** Thin bar track — stamina meter background. */
    barTrack:
      'overflow-hidden rounded-[2px] border border-poster-gold/25 bg-poster-teal-deep/70',
    /** Circular glass affordance — mobile jump, icon buttons. */
    circularGlassButton:
      'rounded-full border border-poster-gold/35 bg-poster-teal-deep/85 text-parchment shadow-lg shadow-black/40 backdrop-blur-md',
    /** Divider between grouped controls. */
    divider: 'w-px shrink-0 bg-poster-teal/25',
  },

  /** Shared typography treatments. */
  typography: {
    textParchment: 'text-parchment',
    textParchmentMuted: 'text-parchment/70',
    textParchmentSoft: 'text-parchment/85',
    textParchmentFaint: 'text-parchment/90',
    textInk: 'font-body text-ink',
    textInkSoft: 'text-ink-soft',
    labelDisplay: 'font-display uppercase tracking-[0.12em]',
    environmentBar:
      'flex w-full items-center justify-between gap-0.5 px-0.5 pb-0.5 pt-0 font-bold leading-none text-ink',
    environmentBarMobile: 'gap-0.5 px-0',
    environmentBarValue:
      'min-w-0 max-w-[58%] shrink truncate whitespace-nowrap tabular-nums font-body',
    environmentBarValueMobile: 'max-w-[52%] text-[10px]',
    toastCaption: 'text-[10px] font-medium leading-none',
    roomStatusBody: 'text-xs text-parchment/90',
  },

  /** Interactive control treatments. */
  interactive: {
    activeTealGradient:
      'bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment ring-1 ring-poster-gold/40',
    inactiveInkHover: 'text-ink-soft hover:bg-parchment-dark/50 hover:text-ink',
    focusRingGold:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70',
    focusRingGoldBright:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/80',
    actionBarIcon: 'text-poster-teal-deep',
    actionBarIconActive: 'text-parchment',
    sendButton:
      'flex shrink-0 items-center justify-center rounded-full border border-poster-gold/50 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] text-parchment shadow-[0_2px_0_0_#6d2c12] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70 disabled:cursor-not-allowed disabled:border-poster-teal/20 disabled:bg-parchment-dark/40 disabled:text-ink-soft/50 disabled:shadow-none',
    circularButtonPress:
      'transition-[transform,background-color,opacity,box-shadow] duration-100 ease-out active:scale-95 active:bg-poster-gold/25 active:shadow-md',
    slotIcon: 'text-poster-orange-deep',
  },

  /** Transient HUD toasts and hint pills. */
  toast: {
    pill: 'select-none rounded-full bg-poster-teal-deep/70 px-3 py-1 text-[10px] font-medium leading-none text-parchment/85 shadow-md shadow-black/25 backdrop-blur-sm',
    fadeTransition: 'transition-opacity ease-out',
    fadeTransitionSlow: 'transition-opacity duration-700 ease-out',
  },

  /** Compact parchment tooltip for buff and status-effect explanations. */
  explanationPopover: {
    panelShell: 'pointer-events-auto z-50 w-max text-left',
    panelAnchored:
      'absolute left-1/2 max-w-[min(12rem,calc(100vw-2rem))] -translate-x-1/2',
    panelAbove: 'bottom-full mb-2',
    panelBelow: 'top-full mt-1',
    /** World-anchored buff card: gap to icons comes from health-bar constants. */
    panelInline:
      'relative mb-0 max-w-[min(11rem,calc(100vw-2rem))] text-center',
    title:
      'font-display text-[8px] font-bold uppercase tracking-[0.05em] leading-none text-poster-teal-deep',
    subtitle:
      'mt-px font-body text-[6px] font-semibold uppercase tracking-[0.04em] leading-none text-ink/65',
    body: 'mt-px font-body text-[7px] font-medium italic leading-tight text-ink-soft',
    detailList: 'mt-0.5 flex flex-col gap-px text-left',
    detailLine: 'font-body text-[6px] font-medium leading-tight text-ink/75',
    footer:
      'mt-0.5 font-body text-[7px] font-semibold leading-none tabular-nums text-ink/70',
  },

  /** Small count / notification badges. */
  badge: {
    /** CSS shell for rainbow dark-fill badges (`definingReigncraftBadgeConstants`). */
    rainbowShell: 'plaza-rainbow-badge',
    notification:
      'pointer-events-none absolute -right-1 -top-1 flex items-center justify-center rounded-full border-2 border-parchment bg-poster-orange font-display font-semibold leading-none text-parchment',
    quantity:
      'pointer-events-none absolute bottom-0.5 right-0.5 z-20 flex min-w-0 items-center justify-center rounded-full bg-poster-teal-deep font-display font-bold leading-none text-parchment',
    statusEffectRow:
      'plaza-status-effect-badge flex items-center gap-1 py-0.5 pl-0.5 pr-2 backdrop-blur-sm',
    statusEffectRowMobile: 'gap-0.5 py-0 pl-0.5 pr-1',
    statusEffectSocket:
      'plaza-status-effect-badge-socket flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border',
    statusEffectSocketMobile: 'h-3.5 w-3.5 rounded-[2px]',
    statusEffectValue:
      'min-w-8 text-right font-display text-sm font-bold leading-none tabular-nums [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_0_6px_rgba(0,0,0,0.55)]',
    statusEffectValueMobile: 'min-w-8 text-[10px]',
  },

  /** Meter fill gradients. */
  meter: {
    fillBase:
      'h-full rounded-full transition-[width,background-color] duration-150 ease-out',
    fillReady: 'bg-gradient-to-r from-poster-gold to-[#f4d35e]',
    fillLow: 'bg-gradient-to-r from-poster-amber to-poster-orange',
    fillDepleted: 'bg-gradient-to-r from-poster-orange to-poster-orange-deep',
  },

  /** Drag-and-drop slot feedback rings. */
  slot: {
    dropValid: 'ring-2 ring-poster-sage ring-offset-0',
    dropInvalid: 'ring-2 ring-poster-orange/70 ring-offset-0',
    dragOverlay:
      'pointer-events-none brightness-105 shadow-[0_6px_16px_rgba(20,28,26,0.45)]',
  },

  /** Keeps parchment HUD chrome in light color-scheme inside dark site chrome. */
  scope: {
    lightTheme: 'isolate [color-scheme:light]',
  },

  /** Shared hex / rgba tokens for canvas-drawn HUD chrome. */
  color: {
    gold: '#d9a441',
    goldBright: '#f4d35e',
    wood: '#5c4033',
    woodDeep: '#3d2a1f',
    canvasPanelFill: 'rgba(18, 36, 44, 0.72)',
    canvasBorder: 'rgba(92, 64, 51, 0.65)',
    canvasLabelText: '#f0e2c4',
  },
} as const;

// --- Re-exports used across feature modules ---

/** Deep ink-teal glass surface for HUD panels with a faint gold trim. */
export const STYLING_WORLD_PLAZA_HUD_GLASS_SURFACE_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel;

/** Primary parchment-toned HUD text. */
export const STYLING_WORLD_PLAZA_HUD_TEXT_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.textParchment;

/** Muted parchment HUD text for hints and secondary copy. */
export const STYLING_WORLD_PLAZA_HUD_TEXT_MUTED_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.textParchmentMuted;

/** Small-caps display treatment for short HUD labels (Cinzel). */
export const STYLING_WORLD_PLAZA_HUD_LABEL_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.labelDisplay;

/** Gold accent used for interactive HUD affordances. */
export const DEFINING_WORLD_PLAZA_HUD_GOLD_HEX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.gold;

/** Bright gold used for the local player marker and focus rings. */
export const DEFINING_WORLD_PLAZA_HUD_GOLD_BRIGHT_HEX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.goldBright;

/** Ink-teal HUD panel fill for canvas-drawn chrome (matches glass surface). */
export const DEFINING_WORLD_PLAZA_HUD_CANVAS_PANEL_FILL_COLOR =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.canvasPanelFill;

/** Wood-brown border for canvas-drawn HUD chrome. */
export const DEFINING_WORLD_PLAZA_HUD_CANVAS_BORDER_COLOR =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.canvasBorder;

/** Primary wood-brown accent for gameplay HUD borders. */
export const DEFINING_WORLD_PLAZA_HUD_WOOD_HEX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.wood;

/** Darker wood-brown for HUD border outlines and bevel shadows. */
export const DEFINING_WORLD_PLAZA_HUD_WOOD_DEEP_HEX =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.woodDeep;

/** Parchment label color for canvas-drawn HUD text. */
export const DEFINING_WORLD_PLAZA_HUD_CANVAS_LABEL_TEXT_COLOR =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.color.canvasLabelText;

/** Shared light-theme scope for parchment HUD islands. */
export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme;

/** Parchment card shell for minimap / corner HUD cards. */
export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.parchmentCard;

/** Inset frame inside parchment HUD cards. */
export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_PARCHMENT_CARD_INSET_FRAME_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.parchmentCardInsetFrame;

/** Transient gameplay HUD toast pill. */
export const STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.toast.pill;

/** Room status HUD shell (position classes live in layout constants). */
export const STYLING_WORLD_PLAZA_ROOM_STATUS_HUD_SHELL_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} max-w-56 px-2 py-1.5 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.roomStatusBody}`;
