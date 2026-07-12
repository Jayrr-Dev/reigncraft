import { applyingWildlifeDamageThreat } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { checkingWildlifeMayMeleeWildlifeTarget } from '@/components/world/wildlife/domains/checkingWildlifeMayMeleeWildlifeTarget';
import { checkingWildlifeSpeciesAlwaysFollowsPlayer } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesAlwaysFollowsPlayer';
import { checkingWildlifeSpeciesHasPassiveTrait } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesHasPassiveTrait';
import { checkingWildlifeSpeciesIsNightOnlySpawn } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn';
import { checkingWildlifeSpeciesUsesGlowOrbPresentation } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesGlowOrbPresentation';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  DEFINING_WILDLIFE_FAIRY_ALWAYS_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_FAIRY_SPECIES_ID,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeFairyLightSources } from '@/components/world/wildlife/domains/resolvingWildlifeFairyLightSources';
import { describe, expect, it } from 'vitest';

describe('wildlife fairy companion', () => {
  it('registers fairy as a permanent glow-orb follower', () => {
    const fairy = resolvingWildlifeSpeciesDefinition(
      DEFINING_WILDLIFE_FAIRY_SPECIES_ID
    );

    expect(fairy).not.toBeNull();
    expect(checkingWildlifeSpeciesUsesGlowOrbPresentation(fairy!)).toBe(true);
    expect(checkingWildlifeSpeciesAlwaysFollowsPlayer(fairy!)).toBe(true);
    expect(checkingWildlifeSpeciesIsNightOnlySpawn(fairy!.speciesId)).toBe(
      true
    );
    expect(fairy!.alwaysFollowMaxDistanceGrid).toBe(
      DEFINING_WILDLIFE_FAIRY_ALWAYS_FOLLOW_MAX_DISTANCE_GRID
    );
    expect(fairy!.temperamentId).toBe('docile');
    expect(fairy!.neverSleeps).toBe(true);
    expect(
      checkingWildlifeSpeciesHasPassiveTrait(
        fairy!,
        'never-triggers-wildlife-aggro'
      )
    ).toBe(true);
  });

  it('is invisible to predator hunt until it attacks wildlife', () => {
    const fairy = resolvingWildlifeSpeciesDefinition(
      DEFINING_WILDLIFE_FAIRY_SPECIES_ID
    );
    const wolf = resolvingWildlifeSpeciesDefinition('grey-wolf');

    expect(fairy).not.toBeNull();
    expect(wolf).not.toBeNull();
    expect(checkingWildlifePredatorMayHuntPrey(wolf!, fairy!, 'starving')).toBe(
      false
    );
    expect(
      checkingWildlifePredatorMayHuntPrey(wolf!, fairy!, 'starving', {
        preyHasProvokedWildlifeAggro: true,
      })
    ).toBe(true);
  });

  it('builds damage threat and melee retaliation against a fairy attacker', () => {
    const fairyId = 'wildlife:fairy:1';
    const boar = creatingWildlifeTestInstance({
      instanceId: 'wildlife:boar:1',
      speciesId: 'boar',
    });
    const fairy = resolvingWildlifeSpeciesDefinition(
      DEFINING_WILDLIFE_FAIRY_SPECIES_ID
    )!;
    const boarSpecies = resolvingWildlifeSpeciesDefinition('boar')!;

    const threatened = applyingWildlifeDamageThreat(
      boar,
      boarSpecies,
      fairyId,
      4,
      1_000
    );

    expect(threatened.aggroState.activeTargetId).toBe(fairyId);
    expect(
      checkingWildlifeMayMeleeWildlifeTarget({
        attackerSpecies: boarSpecies,
        targetSpecies: fairy,
        targetInstanceId: fairyId,
        activeTargetId: fairyId,
      })
    ).toBe(true);
  });

  it('publishes a gold night light for living fairies only', () => {
    const livingFairy = {
      instanceId: 'fairy-1',
      speciesId: DEFINING_WILDLIFE_FAIRY_SPECIES_ID,
      isDead: false,
      position: { x: 12.5, y: 8.25, layer: 0 },
    } as DefiningWildlifeInstance;
    const deadFairy = {
      ...livingFairy,
      instanceId: 'fairy-2',
      isDead: true,
    } as DefiningWildlifeInstance;
    const chicken = {
      ...livingFairy,
      instanceId: 'chicken-1',
      speciesId: 'chicken',
    } as DefiningWildlifeInstance;

    const lights = resolvingWildlifeFairyLightSources([
      livingFairy,
      deadFairy,
      chicken,
    ]);

    expect(lights).toHaveLength(1);
    expect(lights[0]?.id).toBe('fairy:fairy-1');
    expect(lights[0]?.colorTint).toBe(0xffe08a);
    expect(lights[0]?.gridX).toBe(12.5);
    expect(lights[0]?.gridY).toBe(8.25);
  });
});
