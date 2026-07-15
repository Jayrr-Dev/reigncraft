/**
 * Session-scoped Perma Death character-picker offer.
 *
 * Rolls once per run. Backing out and reopening keeps the same five forms.
 * Cleared when Begin Run starts so the next death gets a fresh roll.
 *
 * @module components/world/domains/managingWorldPlazaPermaDeathCharacterPickerOfferStore
 */

/** Skin ids offered for the current pending Perma Death run. */
let managingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds:
  | readonly string[]
  | null = null;

/**
 * Returns the locked picker offer skin ids, or null when none is stored yet.
 */
export function gettingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds():
  | readonly string[]
  | null {
  return managingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds;
}

/**
 * Locks the picker offer for this pending run.
 *
 * @param skinIds - Unique playable skin ids shown in the picker.
 */
export function settingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds(
  skinIds: readonly string[]
): void {
  managingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds = [...skinIds];
}

/**
 * Clears the locked picker offer so the next open rolls again.
 */
export function clearingWorldPlazaPermaDeathCharacterPickerOffer(): void {
  managingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds = null;
}

/**
 * Resets the picker offer store for unit tests.
 */
export function resettingWorldPlazaPermaDeathCharacterPickerOfferStoreForTests(): void {
  managingWorldPlazaPermaDeathCharacterPickerOfferedSkinIds = null;
}
