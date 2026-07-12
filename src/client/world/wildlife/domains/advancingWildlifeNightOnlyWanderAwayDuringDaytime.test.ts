import { applyingWildlifeFairyBetrayalDeparture } from '@/components/world/wildlife/domains/applyingWildlifeFairyBetrayalDeparture';
import { advancingWildlifeNightOnlyWanderAwayDuringDaytime } from '@/components/world/wildlife/domains/advancingWildlifeNightOnlyWanderAwayDuringDaytime';
import { checkingWildlifeSpeciesIsNightOnlySpawn } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn';
import { checkingWildlifeSpeciesWandersAwayAtDaybreak } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesWandersAwayAtDaybreak';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DESPAWN_DISTANCE_GRID,
  DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import { despawningWildlifeNightOnlyInstancesDuringDaytime } from '@/components/world/wildlife/domains/despawningWildlifeNightOnlyInstancesDuringDaytime';
import { creatingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('fairy night light and daybreak wander-away', () => {
  it('marks fairy as night-only and wander-away at daybreak', () => {
    expect(checkingWildlifeSpeciesIsNightOnlySpawn('fairy')).toBe(true);
    expect(checkingWildlifeSpeciesWandersAwayAtDaybreak('fairy')).toBe(true);
    expect(checkingWildlifeSpeciesWandersAwayAtDaybreak('omega-wolf')).toBe(
      false
    );
  });

  it('does not hard-despawn fairies at sunrise', () => {
    const store = creatingWildlifeInstanceStore();
    const fairy = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:1',
      anchorId: 'wildlife:fairy:1',
      speciesId: 'fairy',
    });
    store.instances.set(fairy.instanceId, fairy);
    store.knownAnchorIds.add(fairy.anchorId);

    despawningWildlifeNightOnlyInstancesDuringDaytime(store, true);

    expect(store.instances.has(fairy.instanceId)).toBe(true);
  });

  it('stamps daybreak departure then soft-despawns after the timer', () => {
    const store = creatingWildlifeInstanceStore();
    const fairy = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:1',
      anchorId: 'wildlife:fairy:1',
      speciesId: 'fairy',
      position: { x: 10, y: 10, layer: 1 },
    });
    store.instances.set(fairy.instanceId, fairy);
    store.knownAnchorIds.add(fairy.anchorId);
    const playerCenter = { x: 10, y: 10, layer: 1 };

    advancingWildlifeNightOnlyWanderAwayDuringDaytime(
      store,
      true,
      playerCenter,
      1_000
    );

    const stamped = store.instances.get(fairy.instanceId);
    expect(stamped?.softDepartureStartedAtMs).toBe(1_000);
    expect(stamped?.softDepartureReason).toBe('daybreak');

    advancingWildlifeNightOnlyWanderAwayDuringDaytime(
      store,
      true,
      playerCenter,
      1_000 + DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DURATION_MS
    );

    expect(store.instances.has(fairy.instanceId)).toBe(false);
    expect(store.knownAnchorIds.has(fairy.anchorId)).toBe(false);
  });

  it('soft-despawns early when far from the player', () => {
    const store = creatingWildlifeInstanceStore();
    const fairy = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:2',
      anchorId: 'wildlife:fairy:2',
      speciesId: 'fairy',
      position: { x: 0, y: 0, layer: 1 },
      softDepartureStartedAtMs: 500,
      softDepartureReason: 'daybreak',
    });
    store.instances.set(fairy.instanceId, fairy);
    store.knownAnchorIds.add(fairy.anchorId);

    advancingWildlifeNightOnlyWanderAwayDuringDaytime(
      store,
      true,
      {
        x: DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DESPAWN_DISTANCE_GRID + 1,
        y: 0,
        layer: 1,
      },
      600
    );

    expect(store.instances.has(fairy.instanceId)).toBe(false);
  });

  it('clears daybreak stamp when night returns', () => {
    const store = creatingWildlifeInstanceStore();
    const fairy = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:3',
      anchorId: 'wildlife:fairy:3',
      speciesId: 'fairy',
      softDepartureStartedAtMs: 1_000,
      softDepartureReason: 'daybreak',
    });
    store.instances.set(fairy.instanceId, fairy);

    advancingWildlifeNightOnlyWanderAwayDuringDaytime(
      store,
      false,
      { x: 0, y: 0, layer: 1 },
      2_000
    );

    expect(
      store.instances.get(fairy.instanceId)?.softDepartureStartedAtMs
    ).toBeNull();
  });

  it('betrayed fairy flees and keeps departing at night until despawn', () => {
    const species = resolvingWildlifeSpeciesDefinition('fairy')!;
    const fairy = creatingWildlifeTestInstance({
      instanceId: 'wildlife:fairy:betray',
      anchorId: 'wildlife:fairy:betray',
      speciesId: 'fairy',
      position: { x: 5, y: 5, layer: 1 },
    });

    const betrayed = applyingWildlifeFairyBetrayalDeparture({
      instance: fairy,
      species,
      threatPoint: { x: 5, y: 5, layer: 1 },
      hazardSampling: { placedBlocks: [], isDaytime: false },
      nowMs: 3_000,
    });

    expect(betrayed.softDepartureReason).toBe('betrayal');
    expect(betrayed.softDepartureStartedAtMs).toBe(3_000);
    expect(betrayed.aiState.intent.mode).toBe('flee');

    const store = creatingWildlifeInstanceStore();
    store.instances.set(betrayed.instanceId, betrayed);
    store.knownAnchorIds.add(betrayed.anchorId);

    advancingWildlifeNightOnlyWanderAwayDuringDaytime(
      store,
      false,
      { x: 5, y: 5, layer: 1 },
      3_500
    );

    expect(store.instances.has(betrayed.instanceId)).toBe(true);
    expect(
      store.instances.get(betrayed.instanceId)?.softDepartureReason
    ).toBe('betrayal');

    advancingWildlifeNightOnlyWanderAwayDuringDaytime(
      store,
      false,
      { x: 5, y: 5, layer: 1 },
      3_000 + DEFINING_WILDLIFE_FAIRY_DAYBREAK_DEPARTURE_DURATION_MS
    );

    expect(store.instances.has(betrayed.instanceId)).toBe(false);
  });
});
