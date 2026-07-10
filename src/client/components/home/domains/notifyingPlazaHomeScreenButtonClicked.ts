import { notifyingPlazaDefaultButtonPressed } from '@/components/home/domains/notifyingPlazaDefaultButtonPressed';
import { unlockingWorldPlazaBiomeMusicFromUserGesture } from '@/components/world/domains/unlockingWorldPlazaBiomeMusicFromUserGesture';

/**
 * Plays the next chest-close click clip for an explicitly wired home button.
 */
export function notifyingPlazaHomeScreenButtonClicked(): void {
  unlockingWorldPlazaBiomeMusicFromUserGesture();
  notifyingPlazaDefaultButtonPressed('default');
}
