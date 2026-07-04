/**
 * The deterministic fire tick logic lives in shared code so the client can
 * run the identical simulation for single-player worlds; this module keeps
 * the original server import path working.
 */
export {
  buildingWorldFireSimulationPlacedBlocksByTile,
  computingWorldFireSimulationTick,
  creatingWorldFireDevvitCell,
  type ComputingWorldFireSimulationPlacedBlockAtTile,
  type ComputingWorldFireSimulationTickInput,
  type ComputingWorldFireSimulationTickResult,
} from '../../shared/worldFireSimulation';
