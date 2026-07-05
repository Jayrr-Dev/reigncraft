/**
 * Minecraft-style hunger icon fill states (10 icons, half-step increments).
 *
 * @module components/world/hunger/domains/listingWorldPlazaHungerIconFillStates
 */

/** Number of food icons shown in the hunger HUD row. */
export const DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT = 10;

/** Hunger points represented by one icon (two points per icon = 20 total). */
export const DEFINING_WORLD_PLAZA_HUNGER_POINTS_PER_ICON = 2;

/** Fill amount for one hunger icon: empty, half, or full. */
export type DefiningWorldPlazaHungerIconFillState = 0 | 0.5 | 1;

/**
 * Maps a 0..1 hunger ratio to ten icon fill states, mirroring Minecraft's
 * drumstick row (each icon holds two hunger points).
 */
export function listingWorldPlazaHungerIconFillStates(
  hungerRatio: number
): DefiningWorldPlazaHungerIconFillState[] {
  const clampedRatio = Math.min(1, Math.max(0, hungerRatio));
  const totalPoints =
    clampedRatio *
    DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT *
    DEFINING_WORLD_PLAZA_HUNGER_POINTS_PER_ICON;

  return Array.from(
    { length: DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT },
    (_, iconIndex): DefiningWorldPlazaHungerIconFillState => {
      const iconPoints = Math.min(
        DEFINING_WORLD_PLAZA_HUNGER_POINTS_PER_ICON,
        Math.max(
          0,
          totalPoints - iconIndex * DEFINING_WORLD_PLAZA_HUNGER_POINTS_PER_ICON
        )
      );

      if (iconPoints >= DEFINING_WORLD_PLAZA_HUNGER_POINTS_PER_ICON) {
        return 1;
      }

      if (iconPoints >= 1) {
        return 0.5;
      }

      return 0;
    }
  );
}
