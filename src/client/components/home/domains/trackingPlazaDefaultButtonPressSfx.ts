import { notifyingPlazaDefaultButtonPressed } from '@/components/home/domains/notifyingPlazaDefaultButtonPressed';
import { resolvingPlazaDefaultButtonSfxKindFromElement } from '@/components/home/domains/resolvingPlazaDefaultButtonSfxKindFromElement';

/**
 * Capture clicks on home UI buttons and play the default chest-close clip unless
 * the button declares a custom or silent press sound.
 */
export function trackingPlazaDefaultButtonPressSfx(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handlingButtonPress = (event: MouseEvent): void => {
    if (event.button !== 0) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const resolvedPress = resolvingPlazaDefaultButtonSfxKindFromElement(target);
    if (!resolvedPress) {
      return;
    }

    notifyingPlazaDefaultButtonPressed(resolvedPress.kind);
  };

  window.addEventListener('click', handlingButtonPress, { capture: true });

  return () => {
    window.removeEventListener('click', handlingButtonPress, { capture: true });
  };
}
