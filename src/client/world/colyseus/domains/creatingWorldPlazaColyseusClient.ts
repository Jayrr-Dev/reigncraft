import { Client } from "@colyseus/sdk";
import { resolvingWorldPlazaColyseusServerUrl } from "@/components/world/colyseus/domains/resolvingWorldPlazaColyseusServerUrl";

/** Shared Colyseus client for the plaza (one WebSocket endpoint per page). */
let creatingWorldPlazaColyseusClientInstance: Client | null = null;

/**
 * Returns a singleton {@link Client} pointed at the configured plaza server URL.
 */
export function creatingWorldPlazaColyseusClient(): Client {
  if (!creatingWorldPlazaColyseusClientInstance) {
    creatingWorldPlazaColyseusClientInstance = new Client(
      resolvingWorldPlazaColyseusServerUrl(),
    );
  }

  return creatingWorldPlazaColyseusClientInstance;
}

/**
 * Clears the cached client (used when the server URL changes in tests).
 */
export function resettingWorldPlazaColyseusClient(): void {
  creatingWorldPlazaColyseusClientInstance = null;
}
