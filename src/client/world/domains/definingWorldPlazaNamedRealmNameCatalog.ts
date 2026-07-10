import villageNamesRaw from '../../assets/500_village_names.txt?raw';

/**
 * Place-name catalog for named realms (from village name asset).
 *
 * @module components/world/domains/definingWorldPlazaNamedRealmNameCatalog
 */

function parsingWorldPlazaNamedRealmNameCatalog(
  rawText: string
): readonly string[] {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const line of rawText.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    names.push(trimmed);
  }

  return names;
}

/** Deduped village place names used as realm place roots. */
export const DEFINING_WORLD_PLAZA_NAMED_REALM_PLACE_NAMES =
  parsingWorldPlazaNamedRealmNameCatalog(villageNamesRaw);
