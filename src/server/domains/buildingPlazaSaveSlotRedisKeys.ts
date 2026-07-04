/** Redis hash holding all single-player save slots for one Reddit user. */
export function buildingPlazaSaveSlotsRedisKey(userId: string): string {
  return `plaza:saves:${userId}`;
}
