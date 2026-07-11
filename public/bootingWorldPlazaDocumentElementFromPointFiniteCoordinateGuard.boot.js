/**
 * Early Document.elementFromPoint / elementsFromPoint finite-coordinate guard.
 *
 * Lives under public/ so Vite/Devvit copyPublicDir ships it to dist/client.
 * Classic (non-module) script from game.html / splash.html installs before
 * Reddit's webview click bridge can capture a native reference.
 * Devvit CSP forbids inline scripts; keep this file as plain JS (no imports).
 *
 * The module path in bootingWorldPlazaDocumentElementFromPointFiniteCoordinateGuard.ts
 * re-installs safely if this classic boot was skipped.
 */
(function () {
  if (typeof Document === 'undefined') {
    return;
  }

  var marker = '__reigncraftElementFromPointFiniteGuard';
  var existing = Document.prototype.elementFromPoint;
  if (existing && existing[marker]) {
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
  elementFromPointFiniteGuard[marker] = true;

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
})();
