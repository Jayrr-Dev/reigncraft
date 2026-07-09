'use client';

/**
 * Subscribes to the pending Attack? confirm store for docile wildlife.
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
    onApplyDamage: (
      instanceId: string,
      damageAmount: number,
      projectileArchetypeId?: string
    ) => void
  ) => void;
};

/**
 * React binding for the Attack? dialog pending state.
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
    confirmingPending: (onApplyDamage) => {
      const current = readingWildlifeDocileAttackConfirmPending();

      if (!current) {
        return;
      }

      authorizingWildlifeDocileAttack(current.instanceId);
      clearingWildlifeDocileAttackConfirmPending();
      onApplyDamage(
        current.instanceId,
        current.damageAmount,
        current.projectileArchetypeId
      );
    },
  };
}
