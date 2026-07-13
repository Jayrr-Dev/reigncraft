import { describe, expect, it } from 'vitest';

import { advancingWildlifeStalkerBehaviour } from '@/components/world/wildlife/domains/advancingWildlifeStalkerBehaviour';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.tiger;
const resolveSpecies = (speciesId: string) =>
  DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null;

describe('advancingWildlifeStalkerBehaviour', () => {
  it('opens attack after the shadow when hungry', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'tiger',
      position: { x: 10, y: 10, layer: 1 },
      hungerState: {
        hungerRatio: 0.2,
        driveLevel: 'hungry',
        lastFedAtMs: null,
      },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 0,
        stalkPhase: 'shadowing',
        stalkPhaseEnteredAtMs: 0,
        pendingStalkEvents: [],
        stalkLockedPreyTargetId: 'player-1',
      },
    });

    const nowMs = DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS + 100;
    const next = advancingWildlifeStalkerBehaviour({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 12, y: 10, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      nowMs,
      aggroState: instance.aggroState,
      resolveSpecies,
    });

    expect(next.stalkPhase).toBe('attacking');
  });

  it('stays shadowing while sated and prey is healthy', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'tiger',
      position: { x: 10, y: 10, layer: 1 },
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
      aggressionLevel: 'normal',
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkingPreySinceMs: 0,
        stalkPhase: 'shadowing',
        stalkPhaseEnteredAtMs: 0,
        pendingStalkEvents: [],
        stalkLockedPreyTargetId: 'player-1',
      },
    });

    const nowMs = DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS + 100;
    const next = advancingWildlifeStalkerBehaviour({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 12, y: 10, layer: 1 },
      playerUserId: 'player-1',
      playerHealthRatio: 1,
      playerStaminaRatio: 1,
      playerStaminaIsDepleted: false,
      playerStillDurationMs: 0,
      nowMs,
      aggroState: instance.aggroState,
      resolveSpecies,
    });

    expect(next.stalkPhase).toBe('shadowing');
  });
});
