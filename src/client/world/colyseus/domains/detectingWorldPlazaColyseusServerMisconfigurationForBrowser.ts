import { DEFINING_WORLD_PLAZA_COLYSEUS_DEFAULT_URL } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import { resolvingWorldPlazaColyseusServerUrl } from "@/components/world/colyseus/domains/resolvingWorldPlazaColyseusServerUrl";

/** Hostnames treated as local development in the browser. */
const DETECTING_WORLD_PLAZA_COLYSEUS_LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
]);

/**
 * True when the plaza page runs on a public host but still points at the local
 * Colyseus default (`http://localhost:2567`). Usually means
 * `NEXT_PUBLIC_WORLD_PLAZA_COLYSEUS_URL` was not set at Vercel build time.
 */
export function detectingWorldPlazaColyseusServerMisconfigurationForBrowser(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const serverUrl = resolvingWorldPlazaColyseusServerUrl();
  const isUsingLocalDefault =
    serverUrl === DEFINING_WORLD_PLAZA_COLYSEUS_DEFAULT_URL ||
    serverUrl.includes("localhost") ||
    serverUrl.includes("127.0.0.1");
  const isPublicHost = !DETECTING_WORLD_PLAZA_COLYSEUS_LOCAL_HOSTNAMES.has(
    window.location.hostname,
  );

  return isUsingLocalDefault && isPublicHost;
}
