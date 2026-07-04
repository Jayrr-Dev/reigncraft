import type { WorldBuildingDevvitBlockRow } from './worldBuildingDevvit';
import {
  buildingWorldFireDevvitTileKey,
  computingWorldFireDevvitIntensityFromFuel,
  resolvingWorldFireDevvitMaterialProperties,
  WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID,
  WORLD_FIRE_DEVVIT_SPREAD_BASE_CHANCE,
  WORLD_FIRE_DEVVIT_TICK_MS,
  type WorldFireDevvitCell,
  type WorldFireDevvitCellKind,
} from './worldFireDevvit';

/**
 * Pure deterministic fire simulation shared by the Devvit server (multiplayer
 * rooms) and the client (single-player local worlds). Both run the exact same
 * tick math so a fire behaves identically regardless of where it simulates.
 *
 * @module shared/worldFireSimulation
 */

/**
 * Deterministic spread roll for fire simulation (0..1).
 *
 * @param roomScope - Room scope string.
 * @param tickIndex - Simulation tick index.
 * @param fromTileX - Source fire tile X.
 * @param fromTileY - Source fire tile Y.
 * @param toTileX - Candidate neighbor tile X.
 * @param toTileY - Candidate neighbor tile Y.
 * @param worldLayer - World layer index.
 */
export function seedingWorldFireSpreadRoll(
  roomScope: string,
  tickIndex: number,
  fromTileX: number,
  fromTileY: number,
  toTileX: number,
  toTileY: number,
  worldLayer: number,
): number {
  const seedString = `${roomScope}:${tickIndex}:${fromTileX}:${fromTileY}:${toTileX}:${toTileY}:${worldLayer}`;
  let hash = 2166136261;

  for (let index = 0; index < seedString.length; index += 1) {
    hash ^= seedString.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967296;
}

/** Placed block lookup entry keyed by tile. */
export type ComputingWorldFireSimulationPlacedBlockAtTile = {
  readonly blockId: string;
  readonly definitionId: string;
};

/** Input for one deterministic fire simulation tick. */
export type ComputingWorldFireSimulationTickInput = {
  readonly roomScope: string;
  readonly tickIndex: number;
  readonly cells: ReadonlyMap<string, WorldFireDevvitCell>;
  readonly placedBlocksByTile: ReadonlyMap<
    string,
    ComputingWorldFireSimulationPlacedBlockAtTile
  >;
};

/** Output from one fire simulation tick. */
export type ComputingWorldFireSimulationTickResult = {
  readonly nextCells: Map<string, WorldFireDevvitCell>;
  readonly burnedBlockIds: string[];
};

const WORLD_FIRE_NEIGHBOR_OFFSETS: readonly {
  readonly dx: number;
  readonly dy: number;
}[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

/**
 * Builds a tile-keyed map of placed blocks for fire spread lookups.
 *
 * @param blocks - All placed blocks in the room scope.
 */
export function buildingWorldFireSimulationPlacedBlocksByTile(
  blocks: readonly WorldBuildingDevvitBlockRow[]
): Map<string, ComputingWorldFireSimulationPlacedBlockAtTile> {
  const placedBlocksByTile = new Map<
    string,
    ComputingWorldFireSimulationPlacedBlockAtTile
  >();

  for (const block of blocks) {
    placedBlocksByTile.set(
      buildingWorldFireDevvitTileKey(
        block.tile_x,
        block.tile_y,
        block.world_layer
      ),
      {
        blockId: block.id,
        definitionId: block.definition_id,
      }
    );
  }

  return placedBlocksByTile;
}

function resolvingWorldFireSimulationInitialFuelMs(
  cell: WorldFireDevvitCell
): number {
  if (cell.kind === 'campfire') {
    return cell.fuelRemainingMs;
  }

  return cell.intensity > 0
    ? cell.fuelRemainingMs / Math.max(cell.intensity, 0.01)
    : WORLD_FIRE_DEVVIT_TICK_MS;
}

function updatingWorldFireSimulationCellFuel(
  cell: WorldFireDevvitCell,
  fuelRemainingMs: number
): WorldFireDevvitCell {
  const initialFuelMs = resolvingWorldFireSimulationInitialFuelMs(cell);

  return {
    ...cell,
    fuelRemainingMs,
    intensity: computingWorldFireDevvitIntensityFromFuel(
      fuelRemainingMs,
      initialFuelMs
    ),
  };
}

function creatingWorldFireSimulationSpreadCell(
  tileX: number,
  tileY: number,
  worldLayer: number,
  ignitedAtMs: number,
  burnDurationMs: number
): WorldFireDevvitCell {
  return {
    tileX,
    tileY,
    worldLayer,
    kind: 'spreading',
    ignitedAtMs,
    fuelRemainingMs: burnDurationMs,
    intensity: 1,
  };
}

/**
 * Advances fire simulation by one deterministic tick.
 *
 * @param input - Room scope, tick index, current cells, and placed blocks.
 */
export function computingWorldFireSimulationTick(
  input: ComputingWorldFireSimulationTickInput
): ComputingWorldFireSimulationTickResult {
  const nextCells = new Map<string, WorldFireDevvitCell>();
  const burnedBlockIds: string[] = [];
  const ignitedAtMs = input.tickIndex * WORLD_FIRE_DEVVIT_TICK_MS;

  for (const [tileKey, cell] of input.cells) {
    const nextFuelRemainingMs =
      cell.fuelRemainingMs - WORLD_FIRE_DEVVIT_TICK_MS;

    if (nextFuelRemainingMs <= 0) {
      if (cell.kind === 'spreading') {
        const placedBlock = input.placedBlocksByTile.get(tileKey);

        if (placedBlock) {
          burnedBlockIds.push(placedBlock.blockId);
        }
      }

      continue;
    }

    nextCells.set(
      tileKey,
      updatingWorldFireSimulationCellFuel(cell, nextFuelRemainingMs)
    );
  }

  for (const [, cell] of input.cells) {
    if (cell.kind !== 'spreading') {
      continue;
    }

    if (cell.fuelRemainingMs - WORLD_FIRE_DEVVIT_TICK_MS <= 0) {
      continue;
    }

    for (const offset of WORLD_FIRE_NEIGHBOR_OFFSETS) {
      const neighborTileX = cell.tileX + offset.dx;
      const neighborTileY = cell.tileY + offset.dy;
      const neighborTileKey = buildingWorldFireDevvitTileKey(
        neighborTileX,
        neighborTileY,
        cell.worldLayer
      );

      if (nextCells.has(neighborTileKey) || input.cells.has(neighborTileKey)) {
        continue;
      }

      const neighborBlock = input.placedBlocksByTile.get(neighborTileKey);

      if (!neighborBlock) {
        continue;
      }

      if (
        neighborBlock.definitionId ===
        WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID
      ) {
        continue;
      }

      const materialProperties = resolvingWorldFireDevvitMaterialProperties(
        neighborBlock.definitionId
      );

      if (!materialProperties || materialProperties.flammability <= 0) {
        continue;
      }

      const spreadRoll = seedingWorldFireSpreadRoll(
        input.roomScope,
        input.tickIndex,
        cell.tileX,
        cell.tileY,
        neighborTileX,
        neighborTileY,
        cell.worldLayer
      );

      if (
        spreadRoll >
        materialProperties.flammability * WORLD_FIRE_DEVVIT_SPREAD_BASE_CHANCE
      ) {
        continue;
      }

      nextCells.set(
        neighborTileKey,
        creatingWorldFireSimulationSpreadCell(
          neighborTileX,
          neighborTileY,
          cell.worldLayer,
          ignitedAtMs,
          materialProperties.burnDurationMs
        )
      );
    }
  }

  return {
    nextCells,
    burnedBlockIds,
  };
}

/**
 * Creates a new fire cell for ignite actions.
 *
 * @param kind - Fire cell kind.
 * @param tileX - Tile X index.
 * @param tileY - Tile Y index.
 * @param worldLayer - World layer index.
 * @param fuelRemainingMs - Starting fuel.
 */
export function creatingWorldFireDevvitCell(
  kind: WorldFireDevvitCellKind,
  tileX: number,
  tileY: number,
  worldLayer: number,
  fuelRemainingMs: number
): WorldFireDevvitCell {
  return {
    tileX,
    tileY,
    worldLayer,
    kind,
    ignitedAtMs: Date.now(),
    fuelRemainingMs,
    intensity: 1,
  };
}
