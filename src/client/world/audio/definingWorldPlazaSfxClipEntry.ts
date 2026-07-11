/**
 * Shared plaza SFX clip entry shape.
 *
 * Add new sounds in domain `defining*` catalogs, put pools as `SfxClipEntry[]`,
 * set optional group/surface volumes, compute with `computingWorldPlazaSfxEffectiveVolume`,
 * and play with `playingWorldPlazaStarAudioSfx`.
 *
 * @module components/world/audio/definingWorldPlazaSfxClipEntry
 */

/** One clip id or id plus optional per-clip volume multiplier (default 1). */
export type DefiningWorldPlazaSfxClipEntry<TClipId extends string> =
  | TClipId
  | {
      id: TClipId;
      /** Multiplier on base target volume. */
      volume?: number;
    };

/** Optional volume knobs on a pool or surface definition. */
export type DefiningWorldPlazaSfxVolumeDefinition = {
  /** Multiplier for every clip in this definition (default 1). */
  volume?: number;
};
