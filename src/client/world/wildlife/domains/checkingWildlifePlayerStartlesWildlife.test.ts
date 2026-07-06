import { checkingWildlifePlayerStartlesWildlife } from '@/components/world/wildlife/domains/checkingWildlifePlayerStartlesWildlife';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifePlayerStartlesWildlife', () => {
  it('returns true when the player is sprinting', () => {
    expect(checkingWildlifePlayerStartlesWildlife(true, false)).toBe(true);
  });

  it('returns true when the player is jumping', () => {
    expect(checkingWildlifePlayerStartlesWildlife(false, true)).toBe(true);
  });

  it('returns false when the player is walking or idle', () => {
    expect(checkingWildlifePlayerStartlesWildlife(false, false)).toBe(false);
  });
});
