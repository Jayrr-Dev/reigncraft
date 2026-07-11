from pathlib import Path

p = Path("src/client/world/collision/domains/resolvingWorldCollisionBlockedPoint.ts")
text = p.read_text(encoding="utf-8")

import_anchor = "import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';"
new_import = """import {
  formattingWorldPlazaClientCapturedError,
  loggingWorldPlazaClientError,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';"""

if import_anchor not in text:
    raise SystemExit("import anchor not found")
text = text.replace(import_anchor, new_import, 1)

# Wrap eject function
eject_start = """export function resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
  options: DefiningWorldCollisionOptions = {}
): DefiningWorldPlazaWorldPoint {
  const movementFrom = options.fallbackPosition ?? desired;"""

eject_start_new = """export function resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
  options: DefiningWorldCollisionOptions = {}
): DefiningWorldPlazaWorldPoint {
  try {
  const movementFrom = options.fallbackPosition ?? desired;"""

if eject_start not in text:
    raise SystemExit("eject start not found")
text = text.replace(eject_start, eject_start_new, 1)

eject_end = """  return finalPosition;
}

/**
 * Stops a move at the visible edge of the first tile that matches a predicate."""

eject_end_new = """  return finalPosition;
  } catch (error) {
    loggingWorldPlazaClientError(
      `[collision:eject] ${formattingWorldPlazaClientCapturedError(error)}`
    );
    return options.fallbackPosition ?? desired;
  }
}

/**
 * Stops a move at the visible edge of the first tile that matches a predicate."""

if eject_end not in text:
    raise SystemExit("eject end not found")
text = text.replace(eject_end, eject_end_new, 1)

# Wrap blocked world point
blocked_start = """export function resolvingWorldCollisionBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
  options: DefiningWorldCollisionOptions = {}
): DefiningWorldPlazaWorldPoint {
  let resolvedX = desired.x;"""

blocked_start_new = """export function resolvingWorldCollisionBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
  options: DefiningWorldCollisionOptions = {}
): DefiningWorldPlazaWorldPoint {
  try {
  let resolvedX = desired.x;"""

if blocked_start not in text:
    raise SystemExit("blocked start not found")
text = text.replace(blocked_start, blocked_start_new, 1)

# The function ends with `return resolvedPosition;\n}` at end of file-ish
# Find the last occurrence carefully - after wrapping eject, the blocked function
# should still end with return resolvedPosition
blocked_end = """  return resolvedPosition;
}
"""

# Only replace the last occurrence (blocked world point is last export ending that way)
idx = text.rfind(blocked_end)
if idx < 0:
    raise SystemExit("blocked end not found")

blocked_end_new = """  return resolvedPosition;
  } catch (error) {
    loggingWorldPlazaClientError(
      `[collision:blocked-world-point] ${formattingWorldPlazaClientCapturedError(error)}`
    );
    return options.fallbackPosition ?? desired;
  }
}
"""
text = text[:idx] + blocked_end_new + text[idx + len(blocked_end) :]

p.write_text(text, encoding="utf-8")
print("collision blocked/eject wrapped")
