/**
 * Detects when the plaza is running in a development environment.
 *
 * @module components/world/building/domains/detectingWorldPlazaDevEnvironment
 */

import { detectingWorldPlazaLocalhostDevEnvironment } from '@/components/world/building/domains/detectingWorldPlazaLocalhostDevEnvironment';

/**
 * Returns true when dev-only plaza tooling should be available.
 */
export function detectingWorldPlazaDevEnvironment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (detectingWorldPlazaLocalhostDevEnvironment()) {
    return true;
  }

  return process.env.NODE_ENV === 'development';
}
