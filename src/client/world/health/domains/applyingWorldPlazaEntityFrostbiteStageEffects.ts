/**
 * Applies frostbite stage buff effects with scoped instance ids.
 *
 * @module components/world/health/domains/applyingWorldPlazaEntityFrostbiteStageEffects
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_CONFUSION_INTENSITY,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import type { DefiningWorldPlazaEntityFrostbiteStageDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';
import { listingWorldPlazaEntityFrostbiteStageDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { creatingWorldPlazaEntityHealthDamageRollPresetModifierId } from '@/components/world/health/domains/definingWorldPlazaEntityHealthDamageRollPresets';
import type {
  DefiningWorldPlazaEntityHealthDamageRollModifier,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  addingWorldPlazaEntityHealthConfusionEffect,
  addingWorldPlazaEntityHealthHealBlockModifier,
  addingWorldPlazaEntityHealthMovementModifier,
  addingWorldPlazaEntityHealthStunEffect,
  removingWorldPlazaEntityHealthConfusionEffect,
  removingWorldPlazaEntityHealthHealBlockModifier,
  removingWorldPlazaEntityHealthMovementModifier,
  removingWorldPlazaEntityHealthStunEffect,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';

export function buildingWorldPlazaEntityFrostbiteStageEffectInstanceId(
  buffId: string
): string {
  return `${DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX}${buffId}`;
}

export function resolvingWorldPlazaEntityFrostbiteStageTemplateBuffId(
  instanceId: string
): string | null {
  if (!instanceId.startsWith(DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX)) {
    return null;
  }

  return instanceId.slice(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX.length
  );
}

const FROSTBITE_CONFUSION_EFFECT_ID = `${DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX}confusion`;
const FROSTBITE_NECROTIC_STUN_EFFECT_ID = `${DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX}necrotic-stun`;

function listingWorldPlazaEntityFrostbiteScopedInstanceIds(): string[] {
  const ids: string[] = [
    FROSTBITE_CONFUSION_EFFECT_ID,
    FROSTBITE_NECROTIC_STUN_EFFECT_ID,
  ];

  for (const stage of listingWorldPlazaEntityFrostbiteStageDescriptors()) {
    for (const buffId of stage.buffIds) {
      ids.push(buildingWorldPlazaEntityFrostbiteStageEffectInstanceId(buffId));
      const descriptor = resolvingWorldPlazaEntityBuffDescriptor(buffId);
      if (descriptor?.effect.kind === 'damage_roll_modifiers') {
        for (
          let modifierIndex = 0;
          modifierIndex < descriptor.effect.modifiers.length;
          modifierIndex += 1
        ) {
          ids.push(
            creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
              buildingWorldPlazaEntityFrostbiteStageEffectInstanceId(buffId),
              modifierIndex
            )
          );
        }
      }
    }
  }

  return ids;
}

/**
 * Removes all frostbite-scoped movement, heal-block, confusion, stun, and
 * attacker damage-roll modifiers.
 */
export function clearingWorldPlazaEntityFrostbiteScopedEffects(
  state: DefiningWorldPlazaEntityHealthState,
  attackerDamageRollModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): {
  state: DefiningWorldPlazaEntityHealthState;
  attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
} {
  const scopedIds = new Set(listingWorldPlazaEntityFrostbiteScopedInstanceIds());
  let nextState = state;

  for (const instanceId of scopedIds) {
    nextState = removingWorldPlazaEntityHealthMovementModifier(
      nextState,
      instanceId
    );
    nextState = removingWorldPlazaEntityHealthHealBlockModifier(
      nextState,
      instanceId
    );
  }

  nextState = removingWorldPlazaEntityHealthConfusionEffect(
    nextState,
    FROSTBITE_CONFUSION_EFFECT_ID
  );
  nextState = removingWorldPlazaEntityHealthStunEffect(
    nextState,
    FROSTBITE_NECROTIC_STUN_EFFECT_ID
  );

  return {
    state: nextState,
    attackerDamageRollModifiers: attackerDamageRollModifiers.filter(
      (modifier) =>
        !modifier.id.startsWith(DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX)
    ),
  };
}

function applyingWorldPlazaEntityFrostbiteBuffDescriptor(
  state: DefiningWorldPlazaEntityHealthState,
  buffId: string,
  nowMs: number,
  attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[]
): {
  state: DefiningWorldPlazaEntityHealthState;
  attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
} {
  const descriptor = resolvingWorldPlazaEntityBuffDescriptor(buffId);

  if (!descriptor) {
    return { state, attackerDamageRollModifiers };
  }

  const instanceId = buildingWorldPlazaEntityFrostbiteStageEffectInstanceId(buffId);
  const { effect } = descriptor;

  if (effect.kind === 'movement_modifier') {
    let nextState = addingWorldPlazaEntityHealthMovementModifier(state, {
      id: instanceId,
      kind: effect.modifierKind,
      multiplier: effect.multiplier,
      expiresAtMs: null,
    });

    for (const companion of effect.companionModifiers ?? []) {
      nextState = addingWorldPlazaEntityHealthMovementModifier(nextState, {
        id: instanceId,
        kind: companion.modifierKind,
        multiplier: companion.multiplier,
        expiresAtMs: null,
      });
    }

    return { state: nextState, attackerDamageRollModifiers };
  }

  if (effect.kind === 'heal_block') {
    return {
      state: addingWorldPlazaEntityHealthHealBlockModifier(state, {
        id: instanceId,
        expiresAtMs: null,
      }),
      attackerDamageRollModifiers,
    };
  }

  if (effect.kind === 'damage_roll_modifiers' && effect.side === 'attacker') {
    const withoutExisting = attackerDamageRollModifiers.filter(
      (modifier) => !modifier.id.startsWith(`${instanceId}:`)
    );
    const nextModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[] = [
      ...withoutExisting,
      ...effect.modifiers.map((modifier, modifierIndex) => ({
        id: creatingWorldPlazaEntityHealthDamageRollPresetModifierId(
          instanceId,
          modifierIndex
        ),
        kind: modifier.kind,
        value: modifier.value,
        expiresAtMs: null,
      })),
    ];

    return { state, attackerDamageRollModifiers: nextModifiers };
  }

  void nowMs;
  return { state, attackerDamageRollModifiers };
}

/**
 * Syncs stage buffs, confusion, and necrotic immobilize stun for the active stage.
 */
export function syncingWorldPlazaEntityFrostbiteStageEffects({
  state,
  stage,
  nowMs,
  attackerDamageRollModifiers,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  stage: DefiningWorldPlazaEntityFrostbiteStageDescriptor | null;
  nowMs: number;
  attackerDamageRollModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[];
}): {
  state: DefiningWorldPlazaEntityHealthState;
  attackerDamageRollModifiers: DefiningWorldPlazaEntityHealthDamageRollModifier[];
} {
  let cleared = clearingWorldPlazaEntityFrostbiteScopedEffects(
    state,
    attackerDamageRollModifiers
  );

  if (stage === null) {
    return cleared;
  }

  let nextState = cleared.state;
  let nextAttackerModifiers = cleared.attackerDamageRollModifiers;

  for (const buffId of stage.buffIds) {
    const applied = applyingWorldPlazaEntityFrostbiteBuffDescriptor(
      nextState,
      buffId,
      nowMs,
      nextAttackerModifiers
    );
    nextState = applied.state;
    nextAttackerModifiers = applied.attackerDamageRollModifiers;
  }

  if (stage.appliesConfusion) {
    nextState = addingWorldPlazaEntityHealthConfusionEffect(nextState, {
      id: FROSTBITE_CONFUSION_EFFECT_ID,
      targetIntensity: DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_CONFUSION_INTENSITY,
      appliedAtMs: nowMs,
      expiresAtMs: null,
      phaseSeed: 2.1,
    });
  }

  if (stage.forcesImmobilize) {
    nextState = addingWorldPlazaEntityHealthStunEffect(nextState, {
      id: FROSTBITE_NECROTIC_STUN_EFFECT_ID,
      appliedAtMs: nowMs,
      expiresAtMs: Number.POSITIVE_INFINITY,
      phaseSeed: 1.3,
    });
  }

  return {
    state: nextState,
    attackerDamageRollModifiers: nextAttackerModifiers,
  };
}
