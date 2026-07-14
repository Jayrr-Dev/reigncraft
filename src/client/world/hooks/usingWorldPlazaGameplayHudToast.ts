'use client';

import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import type { ReactNode } from 'react';
import { useCallback } from 'react';

export type UsingWorldPlazaGameplayHudToastResult = {
  readonly showingGameplayHudToast: (message: ReactNode) => void;
};

/**
 * Plaza gameplay toast helper. Routes through the Reigncraft Sonner toaster
 * stacked under the top action bar.
 */
export function usingWorldPlazaGameplayHudToast(): UsingWorldPlazaGameplayHudToastResult {
  const showingGameplayHudToast = useCallback((message: ReactNode): void => {
    showingReigncraftToast(message);
  }, []);

  return {
    showingGameplayHudToast,
  };
}
