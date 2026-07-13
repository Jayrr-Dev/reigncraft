'use client';

/**
 * Subscribes to the pending Pet selection store for companion wildlife.
 *
 * @module components/world/wildlife/hooks/usingWildlifeDocileAttackConfirm
 */

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
};

/**
 * React binding for the Pet label pending state.
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
  };
}
