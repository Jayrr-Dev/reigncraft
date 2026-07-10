/**
 * Display-name formatting for named realms.
 *
 * Keep it simple: HUD shows the place name alone (e.g. "Summerchurch").
 *
 * @module components/world/domains/definingWorldPlazaNamedRealmTitleRegistry
 */

export type DefiningWorldPlazaNamedRealmTitleKind = 'place';

export type DefiningWorldPlazaNamedRealmTitleDefinition = {
  readonly kind: DefiningWorldPlazaNamedRealmTitleKind;
  /** How the title wraps the place name in HUD copy. */
  readonly formattingDisplayName: (placeName: string) => string;
};

/** Ordered title registry (hash picks an index). */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY: readonly DefiningWorldPlazaNamedRealmTitleDefinition[] =
  [
    {
      kind: 'place',
      formattingDisplayName: (placeName) => placeName,
    },
  ];
