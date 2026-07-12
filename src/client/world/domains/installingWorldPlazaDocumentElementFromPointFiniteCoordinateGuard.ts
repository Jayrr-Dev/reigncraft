/**
 * Prevents `document.elementFromPoint` from throwing when Reddit or Devvit
 * click bridges pass non-finite coordinates during expanded webview clicks.
 *
 * Patches `Document.prototype`, `HTMLDocument.prototype`, and the `document`
 * instance. Also wraps `clickListener` (Reddit `onWebViewClick` often closes
 * over native `elementFromPoint`, so prototype patches alone are not enough).
 *
 * Reddit's webview click bridge may capture a method reference before module
 * code runs (see classic early boot script in `game.html` / `splash.html`).
 *
 * @module components/world/domains/installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard
 */

import { checkingWorldPlazaDocumentElementFromPointNonFiniteBridgeError } from '@/components/world/domains/checkingWorldPlazaDocumentElementFromPointNonFiniteBridgeError';

const DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER =
  '__reigncraftElementFromPointFiniteGuard' as const;

const DEFINING_WORLD_PLAZA_CLICK_LISTENER_FINITE_GUARD_MARKER =
  '__reigncraftClickListenerFiniteGuard' as const;

type DefiningWorldPlazaElementFromPointFiniteGuard = ((
  this: Document,
  x: number,
  y: number
) => Element | null) & {
  [DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER]?: true;
};

type DefiningWorldPlazaClickListenerFiniteGuard = ((
  ...args: unknown[]
) => unknown) & {
  [DEFINING_WORLD_PLAZA_CLICK_LISTENER_FINITE_GUARD_MARKER]?: true;
};

type DefiningWorldPlazaClickListenerHost = {
  clickListener?: (...args: unknown[]) => unknown;
};

let installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled = false;

function checkingWorldPlazaElementFromPointFiniteGuardIsInstalled(
  candidate: Document['elementFromPoint'] | undefined
): boolean {
  return (
    typeof candidate === 'function' &&
    DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER in candidate &&
    (candidate as DefiningWorldPlazaElementFromPointFiniteGuard)[
      DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER
    ] === true
  );
}

function creatingWorldPlazaElementFromPointFiniteGuard(
  nativeElementFromPoint: Document['elementFromPoint']
): DefiningWorldPlazaElementFromPointFiniteGuard {
  const elementFromPointFiniteGuard: DefiningWorldPlazaElementFromPointFiniteGuard =
    function elementFromPointFiniteGuard(
      this: Document,
      x: number,
      y: number
    ): Element | null {
      const finiteX = typeof x === 'number' ? x : Number(x);
      const finiteY = typeof y === 'number' ? y : Number(y);

      if (!Number.isFinite(finiteX) || !Number.isFinite(finiteY)) {
        return null;
      }

      try {
        return nativeElementFromPoint.call(this, finiteX, finiteY);
      } catch {
        return null;
      }
    };

  elementFromPointFiniteGuard[
    DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER
  ] = true;

  return elementFromPointFiniteGuard;
}

function creatingWorldPlazaElementsFromPointFiniteGuard(
  nativeElementsFromPoint: Document['elementsFromPoint']
): Document['elementsFromPoint'] {
  return function elementsFromPointFiniteGuard(
    this: Document,
    x: number,
    y: number
  ): Element[] {
    const finiteX = typeof x === 'number' ? x : Number(x);
    const finiteY = typeof y === 'number' ? y : Number(y);

    if (!Number.isFinite(finiteX) || !Number.isFinite(finiteY)) {
      return [];
    }

    try {
      return nativeElementsFromPoint.call(this, finiteX, finiteY);
    } catch {
      return [];
    }
  };
}

function wrappingWorldPlazaClickListenerFiniteGuard(
  original: unknown
): unknown {
  if (typeof original !== 'function') {
    return original;
  }

  const originalListener =
    original as DefiningWorldPlazaClickListenerFiniteGuard;

  if (
    originalListener[
      DEFINING_WORLD_PLAZA_CLICK_LISTENER_FINITE_GUARD_MARKER
    ] === true
  ) {
    return originalListener;
  }

  const clickListenerFiniteGuard: DefiningWorldPlazaClickListenerFiniteGuard =
    function clickListenerFiniteGuard(
      this: unknown,
      ...args: unknown[]
    ): unknown {
      try {
        return originalListener.apply(this, args);
      } catch (error) {
        if (
          checkingWorldPlazaDocumentElementFromPointNonFiniteBridgeError(error)
        ) {
          return null;
        }

        throw error;
      }
    };

  clickListenerFiniteGuard[
    DEFINING_WORLD_PLAZA_CLICK_LISTENER_FINITE_GUARD_MARKER
  ] = true;

  return clickListenerFiniteGuard;
}

function installingWorldPlazaClickListenerFiniteGuardOnTarget(
  target: DefiningWorldPlazaClickListenerHost | null | undefined
): void {
  if (!target) {
    return;
  }

  try {
    let current = wrappingWorldPlazaClickListenerFiniteGuard(
      target.clickListener
    );

    Object.defineProperty(target, 'clickListener', {
      configurable: true,
      enumerable: true,
      get(): unknown {
        return current;
      },
      set(nextListener: unknown): void {
        current = wrappingWorldPlazaClickListenerFiniteGuard(nextListener);
      },
    });
  } catch {
    try {
      if (typeof target.clickListener === 'function') {
        target.clickListener = wrappingWorldPlazaClickListenerFiniteGuard(
          target.clickListener
        ) as DefiningWorldPlazaClickListenerHost['clickListener'];
      }
    } catch {
      // Ignore non-configurable host bindings.
    }
  }
}

function installingWorldPlazaClickListenerFiniteGuard(): void {
  if (typeof document !== 'undefined') {
    installingWorldPlazaClickListenerFiniteGuardOnTarget(
      document as unknown as DefiningWorldPlazaClickListenerHost
    );
  }

  if (typeof HTMLDocument !== 'undefined') {
    installingWorldPlazaClickListenerFiniteGuardOnTarget(
      HTMLDocument as unknown as DefiningWorldPlazaClickListenerHost
    );
    installingWorldPlazaClickListenerFiniteGuardOnTarget(
      HTMLDocument.prototype as unknown as DefiningWorldPlazaClickListenerHost
    );
  }

  if (typeof Document !== 'undefined') {
    installingWorldPlazaClickListenerFiniteGuardOnTarget(
      Document as unknown as DefiningWorldPlazaClickListenerHost
    );
    installingWorldPlazaClickListenerFiniteGuardOnTarget(
      Document.prototype as unknown as DefiningWorldPlazaClickListenerHost
    );
  }
}

function installingWorldPlazaNonFiniteElementFromPointErrorSuppression(): void {
  if (
    typeof window === 'undefined' ||
    typeof window.addEventListener !== 'function'
  ) {
    return;
  }

  window.addEventListener(
    'error',
    (event) => {
      if (
        checkingWorldPlazaDocumentElementFromPointNonFiniteBridgeError(
          event.message
        )
      ) {
        event.preventDefault();
      }
    },
    true
  );
}

/**
 * Wraps document hit-testing APIs so NaN and Infinity return empty results
 * instead of throwing. Also wraps Reddit `clickListener` and suppresses the
 * matching window error. Safe to call more than once.
 */
export function installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard(): void {
  if (
    installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled ||
    typeof document === 'undefined' ||
    typeof Document === 'undefined'
  ) {
    return;
  }

  installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled = true;

  if (
    !checkingWorldPlazaElementFromPointFiniteGuardIsInstalled(
      Document.prototype.elementFromPoint
    )
  ) {
    const nativeElementFromPoint = Document.prototype.elementFromPoint;
    const elementFromPointFiniteGuard =
      creatingWorldPlazaElementFromPointFiniteGuard(nativeElementFromPoint);

    Document.prototype.elementFromPoint = elementFromPointFiniteGuard;

    if (typeof HTMLDocument !== 'undefined') {
      HTMLDocument.prototype.elementFromPoint = elementFromPointFiniteGuard;
    }

    document.elementFromPoint = ((x: number, y: number) =>
      elementFromPointFiniteGuard.call(
        document,
        x,
        y
      )) as Document['elementFromPoint'];

    if (typeof Document.prototype.elementsFromPoint === 'function') {
      const nativeElementsFromPoint = Document.prototype.elementsFromPoint;
      const elementsFromPointFiniteGuard =
        creatingWorldPlazaElementsFromPointFiniteGuard(nativeElementsFromPoint);

      Document.prototype.elementsFromPoint = elementsFromPointFiniteGuard;

      if (typeof HTMLDocument !== 'undefined') {
        HTMLDocument.prototype.elementsFromPoint = elementsFromPointFiniteGuard;
      }

      document.elementsFromPoint = ((x: number, y: number) =>
        elementsFromPointFiniteGuard.call(
          document,
          x,
          y
        )) as Document['elementsFromPoint'];
    }
  }

  installingWorldPlazaClickListenerFiniteGuard();
  installingWorldPlazaNonFiniteElementFromPointErrorSuppression();
}
