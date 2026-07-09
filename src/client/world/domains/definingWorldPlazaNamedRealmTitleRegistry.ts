/**
 * Political / geographic title prefixes for named realms.
 *
 * Wanderer voice: kingdoms, marches, reaches. Avoid modern state jargon.
 *
 * @module components/world/domains/definingWorldPlazaNamedRealmTitleRegistry
 */

export type DefiningWorldPlazaNamedRealmTitleKind =
  | 'kingdom'
  | 'realm'
  | 'march'
  | 'reach'
  | 'lands'
  | 'hold';

export type DefiningWorldPlazaNamedRealmTitleDefinition = {
  readonly kind: DefiningWorldPlazaNamedRealmTitleKind;
  /** How the title wraps the place name in HUD copy. */
  readonly formattingDisplayName: (placeName: string) => string;
};

/** Ordered title registry (hash picks an index). */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_TITLE_REGISTRY: readonly DefiningWorldPlazaNamedRealmTitleDefinition[] =
  [
    {
      kind: 'kingdom',
      formattingDisplayName: (placeName) => `Kingdom of ${placeName}`,
    },
    {
      kind: 'realm',
      formattingDisplayName: (placeName) => `Realm of ${placeName}`,
    },
    {
      kind: 'march',
      formattingDisplayName: (placeName) => `The ${placeName} March`,
    },
    {
      kind: 'reach',
      formattingDisplayName: (placeName) => `The ${placeName} Reach`,
    },
    {
      kind: 'lands',
      formattingDisplayName: (placeName) => `The ${placeName} Lands`,
    },
    {
      kind: 'hold',
      formattingDisplayName: (placeName) => `${placeName} Hold`,
    },
  ];
