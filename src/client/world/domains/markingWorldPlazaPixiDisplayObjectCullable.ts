import type { Container } from 'pixi.js';

/**
 * Centralized viewport-culling policy for cached plaza display objects.
 *
 * The plaza scene registers Pixi's CullerPlugin, which runs before each render.
 * The culler recurses through layer containers and, for any object flagged
 * cullable, skips draw calls when its global bounds leave the screen.
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
  displayObject: Container
): void {
  displayObject.cullable = true;
}
