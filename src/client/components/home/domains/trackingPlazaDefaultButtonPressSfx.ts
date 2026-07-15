import type { DefiningPlazaButtonSfxKind } from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import { notifyingPlazaDefaultButtonPressed } from '@/components/home/domains/notifyingPlazaDefaultButtonPressed';
import { resolvingPlazaDefaultButtonSfxKindFromElement } from '@/components/home/domains/resolvingPlazaDefaultButtonSfxKindFromElement';

export type TrackingPlazaDefaultButtonPressSfxOptions = {
  /** Scale applied to chest-close / home-button clips (bag + book kinds ignore this). */
  readonly volumeMultiplier?: number;
  /**
   * When a button has no data attribute (`default`), play this kind instead.
   * Home keeps chest-close; plaza world remaps to inventory move.
   */
  readonly remapDefaultKindTo?: Exclude<DefiningPlazaButtonSfxKind, 'default'>;
};

/**
 * Capture clicks on UI buttons and play the resolved press sound unless
 * the button declares a silent press sound.
 */
export function trackingPlazaDefaultButtonPressSfx(
  options: TrackingPlazaDefaultButtonPressSfxOptions = {}
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const volumeMultiplier = options.volumeMultiplier ?? 1;
  const remapDefaultKindTo = options.remapDefaultKindTo;

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

    const kind =
      resolvedPress.kind === 'default' && remapDefaultKindTo
        ? remapDefaultKindTo
        : resolvedPress.kind;

    notifyingPlazaDefaultButtonPressed(kind, volumeMultiplier);
  };

  window.addEventListener('click', handlingButtonPress, { capture: true });

  return () => {
    window.removeEventListener('click', handlingButtonPress, { capture: true });
  };
}
