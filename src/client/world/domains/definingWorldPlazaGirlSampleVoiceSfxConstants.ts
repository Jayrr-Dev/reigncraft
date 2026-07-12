/**
 * Voice Essential Female pack SFX for the girl-sample avatar skin.
 *
 * Assets live under `public/creatures/sfx/voice/girl-sample-voice/`.
 *
 * @module components/world/domains/definingWorldPlazaGirlSampleVoiceSfxConstants
 */

/** Public URL prefix for shipped girl voice clips. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_ASSET_BASE_URL =
  '/creatures/sfx/voice/girl-sample-voice' as const;

/** Stable ids for each bundled girl voice clip. */
export type DefiningWorldPlazaGirlSampleVoiceClipId =
  | 'attack_v1_01'
  | 'attack_v1_02'
  | 'attack_v1_03'
  | 'attack_v1_04'
  | 'attack_v1_05'
  | 'attack_v1_06'
  | 'attack_v1_07'
  | 'attack_v1_08'
  | 'attack_v1_09'
  | 'hit_short_v1_01'
  | 'hit_short_v1_02'
  | 'hit_short_v1_03'
  | 'hit_short_v1_04'
  | 'hit_short_v1_05'
  | 'hit_short_v1_06'
  | 'pain_v1_01'
  | 'pain_v1_02'
  | 'pain_v1_03'
  | 'pain_v1_04'
  | 'pain_v1_05'
  | 'pain_v1_06'
  | 'pain_v1_07'
  | 'pain_v1_08';

/** One girl voice clip entry. */
export type DefiningWorldPlazaGirlSampleVoiceClipDefinition = {
  /** Stable clip id. */
  id: DefiningWorldPlazaGirlSampleVoiceClipId;
  /** OGG filename on disk. */
  fileName: string;
};

/** Every girl voice clip shipped in the preload manifest. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_CLIP_CATALOG: Record<
  DefiningWorldPlazaGirlSampleVoiceClipId,
  DefiningWorldPlazaGirlSampleVoiceClipDefinition
> = {
  attack_v1_01: { id: 'attack_v1_01', fileName: 'attack-v1-01.ogg' },
  attack_v1_02: { id: 'attack_v1_02', fileName: 'attack-v1-02.ogg' },
  attack_v1_03: { id: 'attack_v1_03', fileName: 'attack-v1-03.ogg' },
  attack_v1_04: { id: 'attack_v1_04', fileName: 'attack-v1-04.ogg' },
  attack_v1_05: { id: 'attack_v1_05', fileName: 'attack-v1-05.ogg' },
  attack_v1_06: { id: 'attack_v1_06', fileName: 'attack-v1-06.ogg' },
  attack_v1_07: { id: 'attack_v1_07', fileName: 'attack-v1-07.ogg' },
  attack_v1_08: { id: 'attack_v1_08', fileName: 'attack-v1-08.ogg' },
  attack_v1_09: { id: 'attack_v1_09', fileName: 'attack-v1-09.ogg' },
  hit_short_v1_01: { id: 'hit_short_v1_01', fileName: 'hit-short-v1-01.ogg' },
  hit_short_v1_02: { id: 'hit_short_v1_02', fileName: 'hit-short-v1-02.ogg' },
  hit_short_v1_03: { id: 'hit_short_v1_03', fileName: 'hit-short-v1-03.ogg' },
  hit_short_v1_04: { id: 'hit_short_v1_04', fileName: 'hit-short-v1-04.ogg' },
  hit_short_v1_05: { id: 'hit_short_v1_05', fileName: 'hit-short-v1-05.ogg' },
  hit_short_v1_06: { id: 'hit_short_v1_06', fileName: 'hit-short-v1-06.ogg' },
  pain_v1_01: { id: 'pain_v1_01', fileName: 'pain-v1-01.ogg' },
  pain_v1_02: { id: 'pain_v1_02', fileName: 'pain-v1-02.ogg' },
  pain_v1_03: { id: 'pain_v1_03', fileName: 'pain-v1-03.ogg' },
  pain_v1_04: { id: 'pain_v1_04', fileName: 'pain-v1-04.ogg' },
  pain_v1_05: { id: 'pain_v1_05', fileName: 'pain-v1-05.ogg' },
  pain_v1_06: { id: 'pain_v1_06', fileName: 'pain-v1-06.ogg' },
  pain_v1_07: { id: 'pain_v1_07', fileName: 'pain-v1-07.ogg' },
  pain_v1_08: { id: 'pain_v1_08', fileName: 'pain-v1-08.ogg' },
};

/** Local avatar events that can trigger girl voice lines. */
export type DefiningWorldPlazaGirlSampleVoiceSfxEventKind =
  | 'attack_swing'
  | 'jump_takeoff'
  | 'roll_dodge'
  | 'hit_taken'
  | 'pain';

/** Rotating attack grunts on melee wind-up. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS = [
  'attack_v1_01',
  'attack_v1_02',
  'attack_v1_03',
  'attack_v1_04',
  'attack_v1_05',
  'attack_v1_06',
  'attack_v1_07',
  'attack_v1_08',
  'attack_v1_09',
] as const satisfies readonly DefiningWorldPlazaGirlSampleVoiceClipId[];

/** Effort grunts when a jump starts (reuse attack pool). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_JUMP_SFX_CLIP_IDS =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS;

/** Effort grunts when a roll dodge starts (reuse attack pool). */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ROLL_SFX_CLIP_IDS =
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_CLIP_IDS;

/** Rotating light hit reactions. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SHORT_SFX_CLIP_IDS = [
  'hit_short_v1_01',
  'hit_short_v1_02',
  'hit_short_v1_03',
  'hit_short_v1_04',
  'hit_short_v1_05',
  'hit_short_v1_06',
] as const satisfies readonly DefiningWorldPlazaGirlSampleVoiceClipId[];

/** Rotating heavy pain reactions. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_CLIP_IDS = [
  'pain_v1_01',
  'pain_v1_02',
  'pain_v1_03',
  'pain_v1_04',
  'pain_v1_05',
  'pain_v1_06',
  'pain_v1_07',
  'pain_v1_08',
] as const satisfies readonly DefiningWorldPlazaGirlSampleVoiceClipId[];

/** Incoming damage tiers that play the pain pool instead of light hits. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_DAMAGE_OUTCOME_TIERS =
  ['critical', 'fatal', 'lethal'] as const;

/** Attack grunt volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ATTACK_SFX_TARGET_VOLUME = 0.52;

/** Jump effort grunt volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_JUMP_SFX_TARGET_VOLUME = 0.48;

/** Roll effort grunt volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_ROLL_SFX_TARGET_VOLUME = 0.5;

/** Light hit reaction volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_HIT_SFX_TARGET_VOLUME = 0.58;

/** Heavy pain reaction volume before master volume is applied. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_PAIN_SFX_TARGET_VOLUME = 0.64;

/** Minimum ms between girl voice one-shots so hits do not stack. */
export const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_VOICE_SFX_COOLDOWN_MS = 280;
