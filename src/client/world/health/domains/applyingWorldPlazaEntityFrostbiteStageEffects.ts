/**
 * Applies frostbite stage buff effects with scoped instance ids.
 *
 * @module components/world/health/domains/applyingWorldPlazaEntityFrostbiteStageEffects
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_CONFUSION_INTENSITY,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_SPEED_EFFECT_INSTANCE_ID,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_STAMINA_REGEN_EFFECT_INSTANCE_ID,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import type { DefiningWorldPlazaEntityFrostbiteStageDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';
import { listingWorldPlazaEntityFrostbiteStageDescriptors } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';
import { computingWorldPlazaFrostbiteSpeedMovementMultiplier } from '@/components/world/health/domains/computingWorldPlazaFrostbiteSpeedMovementMultiplier';
import { computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier } from '@/components/world/health/domains/computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier';
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
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_SPEED_EFFECT_INSTANCE_ID,
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_STAMINA_REGEN_EFFECT_INSTANCE_ID,
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
    let nextState = state;
    const appliesTierSpeed =
      effect.modifierKind === 'speed' &&
      (buffId === 'frostbite-necrotic-immobilize-debuff' ||
        (descriptor.actionLocks !== undefined &&
          descriptor.actionLocks.length > 0));

    if (effect.modifierKind !== 'speed' || appliesTierSpeed) {
      nextState = addingWorldPlazaEntityHealthMovementModifier(state, {
        id: instanceId,
        kind: effect.modifierKind,
        multiplier: effect.multiplier,
        expiresAtMs: null,
      });
    }

    for (const companion of effect.companionModifiers ?? []) {
      if (companion.modifierKind === 'stamina_regen') {
        continue;
      }

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
 * Syncs linear stack speed and stamina regen, every reached tier's other buffs,
 * plus confusion / necrotic stun. Overlapping stamina max, jump, and outgoing-damage
 * modifiers keep the harshest value only.
 */
export function syncingWorldPlazaEntityFrostbiteStageEffects({
  state,
  stackCount,
  stage,
  nowMs,
  attackerDamageRollModifiers,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  stackCount: number;
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

  if (stackCount <= 0) {
    return cleared;
  }

  let nextState = addingWorldPlazaEntityHealthLinearFrostbiteSpeedModifier(
    cleared.state,
    stackCount
  );
  nextState = addingWorldPlazaEntityHealthLinearFrostbiteStaminaRegenModifier(
    nextState,
    stackCount
  );
  let nextAttackerModifiers = cleared.attackerDamageRollModifiers;

  if (stage === null) {
    return {
      state: nextState,
      attackerDamageRollModifiers: nextAttackerModifiers,
    };
  }

  const reachedStages = listingWorldPlazaEntityFrostbiteStageDescriptors().filter(
    (entry) => entry.minStacks <= stage.minStacks
  );

  for (const reachedStage of reachedStages) {
    for (const buffId of reachedStage.buffIds) {
      const applied = applyingWorldPlazaEntityFrostbiteBuffDescriptor(
        nextState,
        buffId,
        nowMs,
        nextAttackerModifiers
      );
      nextState = applied.state;
      nextAttackerModifiers = applied.attackerDamageRollModifiers;
    }
  }

  nextState = collapsingWorldPlazaEntityFrostbiteMovementModifiers(nextState);
  nextAttackerModifiers =
    collapsingWorldPlazaEntityFrostbiteAttackerExpectedModifiers(
      nextAttackerModifiers
    );

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

function addingWorldPlazaEntityHealthLinearFrostbiteSpeedModifier(
  state: DefiningWorldPlazaEntityHealthState,
  stackCount: number
): DefiningWorldPlazaEntityHealthState {
  const multiplier =
    computingWorldPlazaFrostbiteSpeedMovementMultiplier(stackCount);

  if (multiplier >= 1) {
    return state;
  }

  return addingWorldPlazaEntityHealthMovementModifier(state, {
    id: DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_SPEED_EFFECT_INSTANCE_ID,
    kind: 'speed',
    multiplier,
    expiresAtMs: null,
  });
}

function addingWorldPlazaEntityHealthLinearFrostbiteStaminaRegenModifier(
  state: DefiningWorldPlazaEntityHealthState,
  stackCount: number
): DefiningWorldPlazaEntityHealthState {
  const multiplier =
    computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier(stackCount);

  if (multiplier >= 1) {
    return state;
  }

  return addingWorldPlazaEntityHealthMovementModifier(state, {
    id: DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_LINEAR_STAMINA_REGEN_EFFECT_INSTANCE_ID,
    kind: 'stamina_regen',
    multiplier,
    expiresAtMs: null,
  });
}

/**
 * Among frostbite movement modifiers of the same kind, keep only the lowest
 * multiplier so inherited tiers do not stack penalties together.
 * Speed and stamina regen use linear stacks; necrotic immobilize speed 0 wins.
 */
function collapsingWorldPlazaEntityFrostbiteMovementModifiers(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  const frostbiteModifiers = state.movementModifiers.filter((modifier) =>
    modifier.id.startsWith(DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX)
  );
  const otherModifiers = state.movementModifiers.filter(
    (modifier) =>
      !modifier.id.startsWith(
        DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX
      )
  );

  const harshestByKind = new Map<
    DefiningWorldPlazaEntityHealthState['movementModifiers'][number]['kind'],
    DefiningWorldPlazaEntityHealthState['movementModifiers'][number]
  >();

  for (const modifier of frostbiteModifiers) {
    const existing = harshestByKind.get(modifier.kind);

    if (existing === undefined || modifier.multiplier < existing.multiplier) {
      harshestByKind.set(modifier.kind, modifier);
    }
  }

  return {
    ...state,
    movementModifiers: [...otherModifiers, ...harshestByKind.values()],
  };
}

/**
 * Among frostbite attacker `expected` modifiers, keep only the lowest value.
 */
function collapsingWorldPlazaEntityFrostbiteAttackerExpectedModifiers(
  attackerDamageRollModifiers: readonly DefiningWorldPlazaEntityHealthDamageRollModifier[]
): DefiningWorldPlazaEntityHealthDamageRollModifier[] {
  const frostbiteExpected = attackerDamageRollModifiers.filter(
    (modifier) =>
      modifier.id.startsWith(
        DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX
      ) && modifier.kind === 'expected'
  );
  const others = attackerDamageRollModifiers.filter(
    (modifier) =>
      !(
        modifier.id.startsWith(
          DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_EFFECT_ID_PREFIX
        ) && modifier.kind === 'expected'
      )
  );

  if (frostbiteExpected.length === 0) {
    return [...attackerDamageRollModifiers];
  }

  let harshest = frostbiteExpected[0];

  for (const modifier of frostbiteExpected) {
    if (modifier.value < harshest.value) {
      harshest = modifier;
    }
  }

  return [...others, harshest];
}
