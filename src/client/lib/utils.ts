import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Phase 1: persistence disabled — no Supabase env on Devvit. */
export function hasEnvVars(): boolean {
  return false;
}
