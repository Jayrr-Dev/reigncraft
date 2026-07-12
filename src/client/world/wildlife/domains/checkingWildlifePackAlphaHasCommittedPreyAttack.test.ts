import { checkingWildlifePackAlphaHasCommittedPreyAttack } from '@/components/world/wildlife/domains/checkingWildlifePackAlphaHasCommittedPreyAttack';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { describe, expect, it } from 'vitest';

const preyPosition = { x: 10, y: 10, layer: 1 };

describe('checkingWildlifePackAlphaHasCommittedPreyAttack', () => {
  it('treats an attacking-phase alpha as committed even while repathing flanks', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
        stalkLockedPreyTargetId: 'player-1',
        stalkPhase: 'attacking',
      },
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        intent: {
          mode: 'stalk',
          targetInstanceId: 'player-1',
          targetPoint: { x: 6, y: 10, layer: 1 },
          pace: 'run',
        },
      },
    });

    expect(
      checkingWildlifePackAlphaHasCommittedPreyAttack({
        alpha,
        preyTargetId: 'player-1',
        preyPosition,
      })
    ).toBe(true);
  });
});
