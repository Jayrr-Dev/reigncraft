/**
 * Early Document.elementFromPoint / elementsFromPoint finite-coordinate guard.
 *
 * Lives under public/ so Vite/Devvit copyPublicDir ships it to dist/client.
 * Classic (non-module) script from game.html / splash.html installs before
 * Reddit's webview click bridge can capture a native reference.
 * Devvit CSP forbids inline scripts; keep this file as plain JS (no imports).
 *
 * Also wraps HTMLDocument.clickListener: Reddit's onWebViewClick often closes
 * over native elementFromPoint, so prototype patches alone do not stop throws.
 *
 * The module path in bootingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard.ts
 * re-installs safely if this classic boot was skipped.
 */
(function () {
  var elementFromPointMarker = '__reigncraftElementFromPointFiniteGuard';
  var clickListenerMarker = '__reigncraftClickListenerFiniteGuard';
  var nonFiniteFragment = 'non-finite';

  function checkingNonFiniteElementFromPointError(error) {
    var message =
      error && error.message
        ? String(error.message)
        : typeof error === 'string'
          ? error
          : '';
    return (
      message.indexOf('elementFromPoint') !== -1 &&
      message.indexOf(nonFiniteFragment) !== -1
    );
  }

  function installingElementFromPointFiniteGuard() {
    if (typeof Document === 'undefined') {
      return;
    }

    var existing = Document.prototype.elementFromPoint;
    if (existing && existing[elementFromPointMarker]) {
      return;
    }

    var nativeElementFromPoint = Document.prototype.elementFromPoint;
    function elementFromPointFiniteGuard(x, y) {
      var finiteX = typeof x === 'number' ? x : Number(x);
      var finiteY = typeof y === 'number' ? y : Number(y);
      if (!Number.isFinite(finiteX) || !Number.isFinite(finiteY)) {
        return null;
      }
      try {
        return nativeElementFromPoint.call(this, finiteX, finiteY);
      } catch (_error) {
        return null;
      }
    }
    elementFromPointFiniteGuard[elementFromPointMarker] = true;

    Document.prototype.elementFromPoint = elementFromPointFiniteGuard;
    if (typeof HTMLDocument !== 'undefined') {
      HTMLDocument.prototype.elementFromPoint = elementFromPointFiniteGuard;
    }
    if (typeof document !== 'undefined') {
      document.elementFromPoint = function (x, y) {
        return elementFromPointFiniteGuard.call(document, x, y);
      };
    }

    if (typeof Document.prototype.elementsFromPoint === 'function') {
      var nativeElementsFromPoint = Document.prototype.elementsFromPoint;
      function elementsFromPointFiniteGuard(x, y) {
        var finiteX = typeof x === 'number' ? x : Number(x);
        var finiteY = typeof y === 'number' ? y : Number(y);
        if (!Number.isFinite(finiteX) || !Number.isFinite(finiteY)) {
          return [];
        }
        try {
          return nativeElementsFromPoint.call(this, finiteX, finiteY);
        } catch (_error) {
          return [];
        }
      }
      Document.prototype.elementsFromPoint = elementsFromPointFiniteGuard;
      if (typeof HTMLDocument !== 'undefined') {
        HTMLDocument.prototype.elementsFromPoint = elementsFromPointFiniteGuard;
      }
      if (typeof document !== 'undefined') {
        document.elementsFromPoint = function (x, y) {
          return elementsFromPointFiniteGuard.call(document, x, y);
        };
      }
    }
  }

  function wrappingClickListener(original) {
    if (typeof original !== 'function') {
      return original;
    }
    if (original[clickListenerMarker]) {
      return original;
    }

    function clickListenerFiniteGuard() {
      try {
        return original.apply(this, arguments);
      } catch (error) {
        if (checkingNonFiniteElementFromPointError(error)) {
          return null;
        }
        throw error;
      }
    }
    clickListenerFiniteGuard[clickListenerMarker] = true;
    return clickListenerFiniteGuard;
  }

  function installingClickListenerFiniteGuardOnTarget(target) {
    if (!target) {
      return;
    }

    try {
      var current =
        typeof target.clickListener === 'function'
          ? wrappingClickListener(target.clickListener)
          : target.clickListener;

      Object.defineProperty(target, 'clickListener', {
        configurable: true,
        enumerable: true,
        get: function () {
          return current;
        },
        set: function (nextListener) {
          current = wrappingClickListener(nextListener);
        },
      });
    } catch (_error) {
      try {
        if (typeof target.clickListener === 'function') {
          target.clickListener = wrappingClickListener(target.clickListener);
        }
      } catch (__error) {
        // Ignore non-configurable host bindings.
      }
    }
  }

  function installingClickListenerFiniteGuard() {
    if (typeof document !== 'undefined') {
      installingClickListenerFiniteGuardOnTarget(document);
    }
    if (typeof HTMLDocument !== 'undefined') {
      installingClickListenerFiniteGuardOnTarget(HTMLDocument);
      installingClickListenerFiniteGuardOnTarget(HTMLDocument.prototype);
    }
    if (typeof Document !== 'undefined') {
      installingClickListenerFiniteGuardOnTarget(Document);
      installingClickListenerFiniteGuardOnTarget(Document.prototype);
    }
  }

  function installingNonFiniteElementFromPointErrorSuppression() {
    if (
      typeof window === 'undefined' ||
      typeof window.addEventListener !== 'function'
    ) {
      return;
    }

    window.addEventListener(
      'error',
      function (event) {
        var message = event && event.message ? String(event.message) : '';
        if (
          message.indexOf('elementFromPoint') !== -1 &&
          message.indexOf(nonFiniteFragment) !== -1
        ) {
          event.preventDefault();
        }
      },
      true
    );
  }

  installingElementFromPointFiniteGuard();
  installingClickListenerFiniteGuard();
  installingNonFiniteElementFromPointErrorSuppression();
})();
