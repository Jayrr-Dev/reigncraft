/**
 * Layout and styling for the plaza room chat panel overlay.
 *
 * @module components/world/domains/definingWorldPlazaRoomChatPanelConstants
 */

/** Base width of the inline chat slot in the action bar (px). */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_BASE_WIDTH_PX = 300;

/** Base edge length of attachment toggle buttons in the action bar chat row (px). */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_ATTACHMENT_BUTTON_BASE_PX = 24;

/** Base edge length of the circular send button (px). */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SEND_BUTTON_BASE_PX = 28;

/** Base height of the inline chat slot in the action bar (px). */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_BASE_HEIGHT_PX = 32;

/** Inline chat slot anchored inside the plaza action bar shell. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_SLOT_CLASS_NAME =
  'relative shrink-0' as const;

/** Compact input row for chat embedded in the action bar. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_INPUT_ROW_CLASS_NAME =
  'plaza-action-bar-chat-input flex h-full w-full items-center gap-0.5 rounded-full px-1' as const;

/** Dropdown anchor for emoji/GIF pickers below the inline chat slot. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ACTION_BAR_PICKER_ANCHOR_CLASS_NAME =
  'absolute left-0 top-full z-50 mt-1 w-max' as const;

/** Open chat panel container layout classes. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_OPEN_CONTAINER_CLASS_NAME =
  'pointer-events-auto flex w-full flex-col gap-1' as const;

/** Chat input row container classes. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_INPUT_ROW_CLASS_NAME =
  'flex items-center gap-1.5 rounded-md border border-white/20 bg-[#0d1b2a]/90 px-2.5 py-1.5 shadow-lg backdrop-blur-sm' as const;

/** Attachment toggle button classes when inactive. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_CLASS_NAME =
  'shrink-0 rounded-md p-1 text-poster-teal-deep transition hover:bg-parchment-dark/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70' as const;

/** Attachment toggle button classes when active. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_BUTTON_ACTIVE_CLASS_NAME =
  'shrink-0 rounded-md p-1 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment ring-1 ring-poster-gold/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70' as const;

/** Chat text input classes. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_INPUT_CLASS_NAME =
  'min-w-0 flex-1 bg-transparent font-body text-base text-ink placeholder:text-ink-soft/60 outline-none md:text-xs' as const;

/** Helper text below the chat input. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_HELPER_TEXT_CLASS_NAME =
  'text-center text-[10px] text-white/70' as const;

/** Closed chat opener button classes. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_CLOSED_BUTTON_CLASS_NAME =
  'pointer-events-auto cursor-pointer rounded-md bg-black/45 px-2.5 py-0.5 text-[10px] text-white/80 transition hover:bg-black/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70' as const;

/** Lucide icon size class for chat attachment buttons. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_ATTACHMENT_ICON_CLASS_NAME =
  'size-3.5' as const;

/** Send button classes for the chat input row. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_PANEL_SEND_BUTTON_CLASS_NAME =
  'flex shrink-0 items-center justify-center rounded-full border border-poster-gold/50 bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] text-parchment shadow-[0_2px_0_0_#6d2c12] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70 disabled:cursor-not-allowed disabled:border-poster-teal/20 disabled:bg-parchment-dark/40 disabled:text-ink-soft/50 disabled:shadow-none' as const;
