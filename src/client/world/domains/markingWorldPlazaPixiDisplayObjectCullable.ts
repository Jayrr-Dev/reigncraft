import type { Container } from "pixi.js";

/**
 * Centralized viewport-culling policy for cached plaza display objects.
 *
 * The plaza scene registers Pixi's CullerPlugin, which runs
 * `Culler.shared.cull(stage, renderer.screen)` before every render. The culler
 * recurses through non-cullable layer containers and, for any object flagged
 * cullable, sets `culled` based on its global bounds versus the screen. Culled
 * objects are skipped by the renderer, so off-screen prefetched terrain columns,
 * rocks, trees, and floor chunks stop costing render time.
 *
 * @module components/world/domains/markingWorldPlazaPixiDisplayObjectCullable
 */

/**
 * Flags a cached display object so Pixi culls it when it leaves the screen.
 *
 * Use only for static, position-stable objects (terrain columns, rocks, trees,
 * floor chunks). Avatars and other moving entities stay near the camera center
 * and are intentionally left unculled.
 *
 * @param displayObject - The cached Pixi container or graphics to cull.
 */
export function markingWorldPlazaPixiDisplayObjectCullable(
  displayObject: Container,
): void {
  displayObject.cullable = true;
}
