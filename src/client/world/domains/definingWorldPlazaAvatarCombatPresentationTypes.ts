/**
 * Live combat presentation requests for the local GirlSample avatar.
 */

import type { RefObject } from 'react';

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

/** Timed roll dodge with directional travel. */
export type DefiningWorldPlazaAvatarRollPresentationState = {
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly startedAtMs: number;
  readonly startPosition: { readonly x: number; readonly y: number };
  readonly targetPosition: { readonly x: number; readonly y: number };
};

/** Timed melee swing facing a grid target; damage lands when the strip finishes. */
export type DefiningWorldPlazaAvatarMeleePresentationState = {
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly startedAtMs: number;
  readonly targetGridX: number;
  readonly targetGridY: number;
  readonly targetInstanceId: string;
  readonly damageAmount: number;
  readonly durationMs: number;
  readonly animationFps: number;
  damageRegistered: boolean;
};

/** Push-into-obstacle reaction. */
export type DefiningWorldPlazaAvatarPushPresentationState = {
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly startedAtMs: number;
};

/** Defensive block reaction after soften / block / dodge roll tiers. */
export type DefiningWorldPlazaAvatarBlockReactionPresentationState = {
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly startedAtMs: number;
};

/** Damaged hit-react after taking health damage. */
export type DefiningWorldPlazaAvatarDamagedPresentationState = {
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly startedAtMs: number;
};

/** Death presentation started when health reaches zero. */
export type DefiningWorldPlazaAvatarDeathPresentationState = {
  readonly direction: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly startedAtMs: number;
};

/** Mutable refs the plaza scene and avatar share for combat presentation. */
export type DefiningWorldPlazaAvatarCombatPresentationRefs = {
  rollRequestedRef: RefObject<boolean>;
  rollStateRef: RefObject<DefiningWorldPlazaAvatarRollPresentationState | null>;
  rollChainUnlockAtMsRef: RefObject<number>;
  meleeAttackStateRef: RefObject<DefiningWorldPlazaAvatarMeleePresentationState | null>;
  pushStateRef: RefObject<DefiningWorldPlazaAvatarPushPresentationState | null>;
  blockReactionStateRef: RefObject<DefiningWorldPlazaAvatarBlockReactionPresentationState | null>;
  damagedStateRef: RefObject<DefiningWorldPlazaAvatarDamagedPresentationState | null>;
  deathStateRef: RefObject<DefiningWorldPlazaAvatarDeathPresentationState | null>;
  isRollingRef: RefObject<boolean>;
  isRollDodgeActiveRef: RefObject<boolean>;
  rollDodgeProgressRef: RefObject<number>;
  defensiveReactionRequestedRef: RefObject<DefiningWorldPlazaGirlSampleWalkDirection | null>;
  damagedReactionRequestedRef: RefObject<DefiningWorldPlazaGirlSampleWalkDirection | null>;
};
