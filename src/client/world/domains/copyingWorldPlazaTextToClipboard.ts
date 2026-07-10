/**
 * Clipboard helper with a textarea fallback for mobile WebViews.
 *
 * @module components/world/domains/copyingWorldPlazaTextToClipboard
 */

/**
 * Copies text to the clipboard. Resolves true on success.
 */
export async function copyingWorldPlazaTextToClipboard(
  text: string
): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path.
    }
  }

  if (typeof document === 'undefined') {
    return false;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let didCopy = false;

  try {
    didCopy = document.execCommand('copy');
  } catch {
    didCopy = false;
  }

  document.body.removeChild(textarea);
  return didCopy;
}
