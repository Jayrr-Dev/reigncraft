import { DEFINING_WORLD_PLAZA_COLYSEUS_DEFAULT_URL } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";

/**
 * Resolves the Colyseus server URL from public env or local default.
 */
export function resolvingWorldPlazaColyseusServerUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_WORLD_PLAZA_COLYSEUS_URL?.trim();

  if (configuredUrl && configuredUrl.length > 0) {
    return configuredUrl;
  }

  return DEFINING_WORLD_PLAZA_COLYSEUS_DEFAULT_URL;
}
