import {
  COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS,
  COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS,
} from '@/components/world/domains/computingWorldPlazaInGameDurationMs';

/** Formats a real-ms offset as readable in-game time (hours or days). */
export function formattingPlazaMechanicsInGameDurationLabel(
  durationMs: number
): string {
  if (durationMs <= 0) {
    return 'On symptom onset';
  }

  const wholeDays = Math.round(
    durationMs / COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS
  );
  const dayRemainderMs =
    durationMs - wholeDays * COMPUTING_WORLD_PLAZA_IN_GAME_DAY_MS;

  if (wholeDays > 0 && dayRemainderMs < COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS) {
    return wholeDays === 1 ? '1 in-game day' : `${wholeDays} in-game days`;
  }

  const totalHours = Math.max(
    1,
    Math.round(durationMs / COMPUTING_WORLD_PLAZA_IN_GAME_HOUR_MS)
  );

  if (totalHours >= 24 && totalHours % 24 === 0) {
    const days = totalHours / 24;
    return days === 1 ? '1 in-game day' : `${days} in-game days`;
  }

  return totalHours === 1 ? '1 in-game hour' : `${totalHours} in-game hours`;
}

/** Formats a bell-curve window as an in-game time range. */
export function formattingPlazaMechanicsInGameDurationRangeLabel({
  minMs,
  maxMs,
}: {
  minMs: number;
  maxMs: number;
}): string {
  if (minMs >= maxMs) {
    return formattingPlazaMechanicsInGameDurationLabel(minMs);
  }

  return `${formattingPlazaMechanicsInGameDurationLabel(minMs)}–${formattingPlazaMechanicsInGameDurationLabel(maxMs)}`;
}
