/**
 * Prevents `document.elementFromPoint` from throwing when Reddit or Devvit
 * click bridges pass non-finite coordinates during expanded webview clicks.
 *
 * Patches `Document.prototype`, `HTMLDocument.prototype`, and the `document`
 * instance. Reddit's webview click bridge may call any of those paths, and
 * may capture a method reference before module code runs (see classic early
 * boot script in `game.html` / `splash.html`).
 *
 * @module components/world/domains/installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard
 */

const DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER =
  '__reigncraftElementFromPointFiniteGuard' as const;

type DefiningWorldPlazaElementFromPointFiniteGuard = ((
  this: Document,
  x: number,
  y: number
) => Element | null) & {
  [DEFINING_WORLD_PLAZA_ELEMENT_FROM_POINT_FINITE_GUARD_MARKER]?: true;
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

/**
 * Wraps document hit-testing APIs so NaN and Infinity return empty results
 * instead of throwing. Safe to call more than once.
 */
export function installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard(): void {
  if (
    installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled ||
    typeof document === 'undefined' ||
    typeof Document === 'undefined'
  ) {
    return;
  }

  if (
    checkingWorldPlazaElementFromPointFiniteGuardIsInstalled(
      Document.prototype.elementFromPoint
    )
  ) {
    installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled = true;
    return;
  }

  installingWorldPlazaDocumentElementFromPointFiniteCoordinateGuardIsInstalled = true;

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
