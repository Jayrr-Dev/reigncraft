'use client';

import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { useCallback } from 'react';

export type UsingWorldPlazaGameplayHudToastResult = {
  readonly showingGameplayHudToast: (message: string) => void;
};

/**
 * Plaza gameplay toast helper. Routes through the Reigncraft Sonner toaster
 * stacked above the minimap.
 */
export function usingWorldPlazaGameplayHudToast(): UsingWorldPlazaGameplayHudToastResult {
  const showingGameplayHudToast = useCallback((message: string): void => {
    showingReigncraftToast(message);
  }, []);

  return {
    showingGameplayHudToast,
  };
}
