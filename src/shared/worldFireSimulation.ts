import type { WorldBuildingDevvitBlockRow } from './worldBuildingDevvit';
import { checkingWorldBurnStageMetadataIsBurnt } from './worldBurnStage';
import {
  computingWorldCampfireEffectiveIntensity,
  countingWorldCampfireNearbyFuelWoodBlocks,
} from './worldCampfireFuel';
import {
  buildingWorldFireDevvitTileKey,
  computingWorldFireDevvitIntensityFromFuel,
  resolvingWorldFireDevvitMaterialProperties,
  WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID,
  WORLD_FIRE_DEVVIT_GRASS_SURFACE_DEFINITION_ID,
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
  worldLayer: number
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
  readonly isBurnt: boolean;
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
  readonly burntGrassTileKeys: ReadonlySet<string>;
};

/** Output from one fire simulation tick. */
export type ComputingWorldFireSimulationTickResult = {
  readonly nextCells: Map<string, WorldFireDevvitCell>;
  readonly burnedBlockIds: string[];
  readonly burntGrassTileKeys: string[];
  readonly extinguishedCampfireTiles: ComputingWorldFireSimulationExtinguishedCampfireTile[];
};

/** Tile position for a campfire whose fuel just ran out. */
export type ComputingWorldFireSimulationExtinguishedCampfireTile = {
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
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
        isBurnt: checkingWorldBurnStageMetadataIsBurnt(block.metadata),
      }
    );
  }

  return placedBlocksByTile;
}

function updatingWorldFireSimulationCellFuel(
  cell: WorldFireDevvitCell,
  fuelRemainingMs: number,
  placedBlocksByTile: ReadonlyMap<
    string,
    ComputingWorldFireSimulationPlacedBlockAtTile
  >
): WorldFireDevvitCell {
  if (cell.kind === 'campfire') {
    const nearbyWoodCount = countingWorldCampfireNearbyFuelWoodBlocks(
      cell.tileX,
      cell.tileY,
      cell.worldLayer,
      placedBlocksByTile
    );
    const initialFuelMs =
      cell.initialFuelMs > 0 ? cell.initialFuelMs : cell.fuelRemainingMs;

    return {
      ...cell,
      fuelRemainingMs,
      initialFuelMs,
      intensity: computingWorldCampfireEffectiveIntensity(
        nearbyWoodCount,
        fuelRemainingMs,
        initialFuelMs,
        cell.inventoryFuelWoodCount ?? 0
      ),
    };
  }

  const initialFuelMs =
    cell.initialFuelMs > 0 ? cell.initialFuelMs : cell.fuelRemainingMs;

  return {
    ...cell,
    fuelRemainingMs,
    initialFuelMs,
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
    initialFuelMs: burnDurationMs,
    intensity: 1,
  };
}

function attemptingWorldFireSimulationSpreadToNeighbor(
  input: ComputingWorldFireSimulationTickInput,
  cell: WorldFireDevvitCell,
  neighborTileX: number,
  neighborTileY: number,
  nextCells: Map<string, WorldFireDevvitCell>,
  ignitedAtMs: number
): void {
  const neighborTileKey = buildingWorldFireDevvitTileKey(
    neighborTileX,
    neighborTileY,
    cell.worldLayer
  );

  if (nextCells.has(neighborTileKey) || input.cells.has(neighborTileKey)) {
    return;
  }

  if (input.burntGrassTileKeys.has(neighborTileKey)) {
    return;
  }

  const neighborBlock = input.placedBlocksByTile.get(neighborTileKey);

  if (neighborBlock?.isBurnt) {
    return;
  }

  const materialDefinitionId =
    neighborBlock?.definitionId ??
    WORLD_FIRE_DEVVIT_GRASS_SURFACE_DEFINITION_ID;
  const materialProperties =
    resolvingWorldFireDevvitMaterialProperties(materialDefinitionId);

  if (!materialProperties || materialProperties.flammability <= 0) {
    return;
  }

  if (
    neighborBlock?.definitionId ===
    WORLD_FIRE_DEVVIT_CAMPFIRE_BLOCK_DEFINITION_ID
  ) {
    return;
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
    return;
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
  const burntGrassTileKeys: string[] = [];
  const extinguishedCampfireTiles: ComputingWorldFireSimulationExtinguishedCampfireTile[] =
    [];
  const ignitedAtMs = input.tickIndex * WORLD_FIRE_DEVVIT_TICK_MS;

  for (const [tileKey, cell] of input.cells) {
    const nextFuelRemainingMs =
      cell.fuelRemainingMs - WORLD_FIRE_DEVVIT_TICK_MS;

    if (nextFuelRemainingMs <= 0) {
      if (cell.kind === 'spreading') {
        const placedBlock = input.placedBlocksByTile.get(tileKey);

        if (placedBlock) {
          burnedBlockIds.push(placedBlock.blockId);
        } else {
          burntGrassTileKeys.push(tileKey);
        }
      }

      if (cell.kind === 'campfire') {
        extinguishedCampfireTiles.push({
          tileX: cell.tileX,
          tileY: cell.tileY,
          worldLayer: cell.worldLayer,
        });
      }

      continue;
    }

    nextCells.set(
      tileKey,
      updatingWorldFireSimulationCellFuel(
        cell,
        nextFuelRemainingMs,
        input.placedBlocksByTile
      )
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
      attemptingWorldFireSimulationSpreadToNeighbor(
        input,
        cell,
        cell.tileX + offset.dx,
        cell.tileY + offset.dy,
        nextCells,
        ignitedAtMs
      );
    }
  }

  return {
    nextCells,
    burnedBlockIds,
    burntGrassTileKeys,
    extinguishedCampfireTiles,
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
  fuelRemainingMs: number,
  intensity = 1,
  inventoryFuelWoodCount = 0
): WorldFireDevvitCell {
  return {
    tileX,
    tileY,
    worldLayer,
    kind,
    ignitedAtMs: Date.now(),
    fuelRemainingMs,
    initialFuelMs: fuelRemainingMs,
    ...(inventoryFuelWoodCount > 0 ? { inventoryFuelWoodCount } : {}),
    intensity,
  };
}
