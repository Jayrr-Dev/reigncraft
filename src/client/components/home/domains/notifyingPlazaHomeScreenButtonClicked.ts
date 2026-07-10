import { notifyingPlazaDefaultButtonPressed } from '@/components/home/domains/notifyingPlazaDefaultButtonPressed';

/**
 * Plays the next chest-close click clip for an explicitly wired home button.
 */
export function notifyingPlazaHomeScreenButtonClicked(): void {
  notifyingPlazaDefaultButtonPressed('default');
}
