/**
 * Declarative button press sounds for plaza home UI.
 *
 * Omit the data attribute for the default chest-close click. Set a kind when a
 * button already plays custom SFX or should stay silent.
 *
 * @module components/home/domains/definingPlazaDefaultButtonSfxConstants
 */

/** DOM attribute that overrides default button press SFX. */
export const DEFINING_PLAZA_BUTTON_SFX_DATA_ATTRIBUTE =
  'data-plaza-button-sfx' as const;

/** Wired or silent button press behaviors. */
export const DEFINING_PLAZA_BUTTON_SFX_KIND = {
  none: 'none',
  bookPageTurn: 'book-page-turn',
  bookOpen: 'book-open',
  bookClose: 'book-close',
  /** Inventory bag slot-move / item-switch clip. */
  inventoryMove: 'inventory-move',
  /** Start-screen chest-close clip (claim badge buttons in-world). */
  homeButton: 'home-button',
} as const;

export type DefiningPlazaButtonSfxKind =
  | 'default'
  | (typeof DEFINING_PLAZA_BUTTON_SFX_KIND)[keyof typeof DEFINING_PLAZA_BUTTON_SFX_KIND];

/**
 * React props for a non-default button press sound.
 */
export function definingPlazaButtonSfxDataAttributes(
  kind: Exclude<DefiningPlazaButtonSfxKind, 'default'>
): Record<typeof DEFINING_PLAZA_BUTTON_SFX_DATA_ATTRIBUTE, string> {
  return {
    [DEFINING_PLAZA_BUTTON_SFX_DATA_ATTRIBUTE]: kind,
  };
}
