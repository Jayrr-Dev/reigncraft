/**
 * The deterministic spread roll lives in shared code so the client can run
 * the identical simulation for single-player worlds; this module keeps the
 * original server import path working.
 */
export { seedingWorldFireSpreadRoll } from '../../shared/worldFireSimulation';
