import { describe, expect, it } from 'vitest';
import {
  checkingWorldPlazaTreeStumpStudySelectionKey,
  formattingWorldPlazaTreeStumpStudySelectionKey,
  resolvingWorldPlazaTreeStumpStudyTileFromSelectionKey,
} from './formattingWorldPlazaTreeStumpStudySelectionKey';

describe('formattingWorldPlazaTreeStumpStudySelectionKey', () => {
  it('round-trips tile coordinates', () => {
    const key = formattingWorldPlazaTreeStumpStudySelectionKey(12, -4);

    expect(checkingWorldPlazaTreeStumpStudySelectionKey(key)).toBe(true);
    expect(resolvingWorldPlazaTreeStumpStudyTileFromSelectionKey(key)).toEqual({
      tileX: 12,
      tileY: -4,
    });
  });

  it('rejects non-stump selection keys', () => {
    expect(
      resolvingWorldPlazaTreeStumpStudyTileFromSelectionKey('tree:12,4')
    ).toBeNull();
  });
});
