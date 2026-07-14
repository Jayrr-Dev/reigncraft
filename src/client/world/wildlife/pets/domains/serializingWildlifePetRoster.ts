/**
 * Pure serialize / parse helpers for pet roster save data. Delegates to the
 * shared parser so client and server validate the same JSON shape.
 *
 * @module components/world/wildlife/pets/domains/serializingWildlifePetRoster
 */

import {
  creatingEmptyPlazaSinglePlayerSavePetRoster,
  parsingPlazaSinglePlayerSavePetRecord,
  parsingPlazaSinglePlayerSavePetRoster,
  serializingPlazaSinglePlayerSavePetRecord,
  serializingPlazaSinglePlayerSavePetRoster,
} from '../../../../../shared/parsingPlazaSinglePlayerSavePetRoster';
import type {
  DefiningWildlifePetPersistedRecord,
  DefiningWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

export type ParsingWildlifePetRosterResult = {
  roster: DefiningWildlifePetRoster;
  droppedPetCount: number;
};

/** Validates one persisted pet record from save JSON. */
export function parsingWildlifePetPersistedRecord(
  raw: unknown
): DefiningWildlifePetPersistedRecord | null {
  return parsingPlazaSinglePlayerSavePetRecord(raw);
}

/** Empty roster used when save data is missing or invalid. */
export function creatingEmptyWildlifePetRoster(): DefiningWildlifePetRoster {
  return creatingEmptyPlazaSinglePlayerSavePetRoster();
}

/** Validates roster JSON and drops malformed pet rows. */
export function parsingWildlifePetRoster(
  raw: unknown
): ParsingWildlifePetRosterResult {
  return parsingPlazaSinglePlayerSavePetRoster(raw);
}

/** JSON-serializable roster payload for save slots. */
export function serializingWildlifePetRoster(
  roster: DefiningWildlifePetRoster
): {
  activePetId: string | null;
  pets: DefiningWildlifePetPersistedRecord[];
} {
  const serialized = serializingPlazaSinglePlayerSavePetRoster(roster);

  return {
    activePetId: serialized.activePetId,
    pets: [...serialized.pets],
  };
}

/** Serializes one pet record for save slots. */
export function serializingWildlifePetPersistedRecord(
  record: DefiningWildlifePetPersistedRecord
): DefiningWildlifePetPersistedRecord {
  return serializingPlazaSinglePlayerSavePetRecord(record);
}
