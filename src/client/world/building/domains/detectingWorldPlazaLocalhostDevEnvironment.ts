/**
 * Detects when the plaza is running on a local dev host.
 *
 * @module components/world/building/domains/detectingWorldPlazaLocalhostDevEnvironment
 */

/** Hostnames treated as local development environments. */
const DETECTING_WORLD_PLAZA_LOCALHOST_DEV_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
] as const;

/**
 * Returns true when the current browser host is local development.
 */
export function detectingWorldPlazaLocalhostDevEnvironment(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return DETECTING_WORLD_PLAZA_LOCALHOST_DEV_HOSTNAMES.includes(
    window.location.hostname as (typeof DETECTING_WORLD_PLAZA_LOCALHOST_DEV_HOSTNAMES)[number],
  );
}
