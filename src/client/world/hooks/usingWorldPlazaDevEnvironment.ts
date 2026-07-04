'use client';

import { detectingWorldPlazaDevEnvironment } from '@/components/world/building/domains/detectingWorldPlazaDevEnvironment';
import { useEffect, useState } from 'react';

/**
 * Tracks whether dev-only plaza tooling should be available.
 */
export function usingWorldPlazaDevEnvironment(): boolean {
  const [isDevEnvironment, setIsDevEnvironment] = useState(false);

  useEffect(() => {
    setIsDevEnvironment(detectingWorldPlazaDevEnvironment());
  }, []);

  return isDevEnvironment;
}
