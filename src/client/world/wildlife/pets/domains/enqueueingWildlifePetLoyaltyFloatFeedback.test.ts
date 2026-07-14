import { formattingWorldPlazaEntityHealthFloatTextAmount } from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { applyingWildlifePetPettingLoyalty } from '@/components/world/wildlife/pets/domains/applyingWildlifePetPettingLoyalty';
import { DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import { enqueueingWildlifePetLoyaltyFloatFeedback } from '@/components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback';
import { describe, expect, it } from 'vitest';

describe('enqueueingWildlifePetLoyaltyFloatFeedback', () => {
  it('formats +N and skips zero grants', () => {
    expect(
      formattingWorldPlazaEntityHealthFloatTextAmount({
        kind: 'loyalty',
        amount: 10,
      })
    ).toBe('+10');

    const unchanged = enqueueingWildlifePetLoyaltyFloatFeedback({
      instance: creatingWildlifeTestInstance(),
      loyaltyPoints: 0,
      nowMs: 1_000,
    });
    expect(unchanged.floatingTexts).toHaveLength(0);

    const withFloat = enqueueingWildlifePetLoyaltyFloatFeedback({
      instance: creatingWildlifeTestInstance(),
      loyaltyPoints: 10,
      nowMs: 1_000,
    });
    expect(withFloat.floatingTexts).toHaveLength(1);
    expect(withFloat.floatingTexts[0]?.kind).toBe('loyalty');
    expect(withFloat.floatingTexts[0]?.amount).toBe(10);
  });
});

describe('applyingWildlifePetPettingLoyalty', () => {
  it('enqueues a loyalty float for the petting grant', () => {
    const { instance, loyaltyResult } = applyingWildlifePetPettingLoyalty({
      instance: creatingWildlifeTestInstance({
        speciesId: 'cat-orange',
      }),
      ownerUserId: 'player-1',
      nowMs: 5_000,
    });

    expect(loyaltyResult.granted).toBe(
      DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT
    );
    expect(
      instance.floatingTexts.some((floatText) => floatText.kind === 'loyalty')
    ).toBe(true);
    expect(
      instance.floatingTexts.find((floatText) => floatText.kind === 'loyalty')
        ?.amount
    ).toBe(DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT);
  });
});
