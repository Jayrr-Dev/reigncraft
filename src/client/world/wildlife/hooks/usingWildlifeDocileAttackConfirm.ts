'use client';

/**
 * Subscribes to the pending Betray? selection store for docile wildlife.
 *
 * @module components/world/wildlife/hooks/usingWildlifeDocileAttackConfirm
 */

import { authorizingWildlifeDocileAttack } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackAuthorizationStore';
import {
  clearingWildlifeDocileAttackConfirmPending,
  readingWildlifeDocileAttackConfirmPending,
  subscribingWildlifeDocileAttackConfirmPending,
  type ManagingWildlifeDocileAttackConfirmPending,
} from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import { useEffect, useState } from 'react';

export type UsingWildlifeDocileAttackConfirmResult = {
  pending: ManagingWildlifeDocileAttackConfirmPending | null;
  cancelingPending: () => void;
  confirmingPending: (
    confirmedPending: ManagingWildlifeDocileAttackConfirmPending,
    onApplyDamage: (
      instanceId: string,
      damageAmount: number,
      projectileArchetypeId?: string
    ) => void
  ) => void;
};

/**
 * React binding for the Betray? label pending state.
 */
export function usingWildlifeDocileAttackConfirm(): UsingWildlifeDocileAttackConfirmResult {
  const [pending, setPending] =
    useState<ManagingWildlifeDocileAttackConfirmPending | null>(
      readingWildlifeDocileAttackConfirmPending
    );

  useEffect(() => {
    return subscribingWildlifeDocileAttackConfirmPending(setPending);
  }, []);

  return {
    pending,
    cancelingPending: clearingWildlifeDocileAttackConfirmPending,
    confirmingPending: (confirmedPending, onApplyDamage) => {
      authorizingWildlifeDocileAttack(confirmedPending.instanceId);
      clearingWildlifeDocileAttackConfirmPending();
      onApplyDamage(
        confirmedPending.instanceId,
        confirmedPending.damageAmount,
        confirmedPending.projectileArchetypeId
      );
    },
  };
}
