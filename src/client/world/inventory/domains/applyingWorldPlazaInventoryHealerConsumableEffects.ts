import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityFrostbiteStack } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import { clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity } from '@/components/world/health/domains/clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { shorteningWorldPlazaEntityDiseaseRemainingDuration } from '@/components/world/health/domains/shorteningWorldPlazaEntityDiseaseRemainingDuration';
import { applyingWorldPlazaInventoryFlowerEatEffects } from '@/components/world/inventory/domains/applyingWorldPlazaInventoryFlowerEatEffects';
import { resolvingWorldPlazaHealerConsumableEffectKind } from '@/components/world/inventory/domains/definingWorldPlazaHealerConsumableEffectRegistry';
import {
  DEFINING_WORLD_PLAZA_HEALER_BELLADONNA_PURGE_SUCCESS_CHANCE,
  DEFINING_WORLD_PLAZA_HEALER_EFFECT_PROC_ROLL_ALWAYS,
  DEFINING_WORLD_PLAZA_HEALER_FOXGLOVE_SUCCESS_CHANCE,
  DEFINING_WORLD_PLAZA_HEALER_GRADED_PURGE_SEVERE_CHANCE,
} from '@/components/world/inventory/domains/definingWorldPlazaHealerConsumableEffectTunables';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';

function applyingHealerFlowerEffect(
  state: DefiningWorldPlazaEntityHealthState,
  speciesId: WorldFlowerSpeciesId,
  nowMs: number,
  worldEpochMs: number,
  foxgloveRoll = DEFINING_WORLD_PLAZA_HEALER_EFFECT_PROC_ROLL_ALWAYS
): DefiningWorldPlazaEntityHealthState {
  return applyingWorldPlazaInventoryFlowerEatEffects({
    speciesId,
    healthState: state,
    nowMs,
    worldEpochMs,
    preparation: 'brewed',
    effectProcChanceBonus: 1,
    effectProcRoll: DEFINING_WORLD_PLAZA_HEALER_EFFECT_PROC_ROLL_ALWAYS,
    foxgloveRoll,
  }).nextHealthState;
}

function shorteningWolfFeverOrAllDiseases(
  state: DefiningWorldPlazaEntityHealthState,
  worldEpochMs: number
): DefiningWorldPlazaEntityHealthState {
  if (
    !state.diseaseEffects.some((effect) => effect.diseaseId === 'wolf-fever')
  ) {
    return shorteningWorldPlazaEntityDiseaseRemainingDuration(
      state,
      worldEpochMs
    );
  }

  return {
    ...state,
    diseaseEffects: state.diseaseEffects.map((effect) => {
      if (
        effect.diseaseId !== 'wolf-fever' ||
        effect.expiresAtMs <= worldEpochMs
      ) {
        return effect;
      }

      return {
        ...effect,
        symptomsStartAtMs:
          effect.symptomsStartAtMs > worldEpochMs
            ? worldEpochMs + (effect.symptomsStartAtMs - worldEpochMs) * 0.6
            : effect.symptomsStartAtMs,
        expiresAtMs: worldEpochMs + (effect.expiresAtMs - worldEpochMs) * 0.6,
      };
    }),
  };
}

export type ApplyingWorldPlazaInventoryHealerConsumableEffectsParams = {
  readonly itemTypeId: string;
  readonly healthState: DefiningWorldPlazaEntityHealthState;
  readonly nowMs: number;
  readonly worldEpochMs: number;
  readonly effectRoll?: number;
};

export function applyingWorldPlazaInventoryHealerConsumableEffects({
  itemTypeId,
  healthState,
  nowMs,
  worldEpochMs,
  effectRoll = Math.random(),
}: ApplyingWorldPlazaInventoryHealerConsumableEffectsParams): DefiningWorldPlazaEntityHealthState {
  const effectKind = resolvingWorldPlazaHealerConsumableEffectKind(itemTypeId);

  if (!effectKind) {
    return healthState;
  }

  const applyingFlower = (speciesId: WorldFlowerSpeciesId) =>
    applyingHealerFlowerEffect(healthState, speciesId, nowMs, worldEpochMs);
  const applyingBraced = (state: DefiningWorldPlazaEntityHealthState) =>
    applyingHealerFlowerEffect(state, 'arnica', nowMs, worldEpochMs);

  switch (effectKind) {
    case 'bleedDowngrade':
      return applyingFlower('yarrow');
    case 'healAndMending':
      return applyingFlower('calendula');
    case 'sleepOrClearConfusion':
      return applyingFlower('chamomile');
    case 'clearSicknessDebuffs':
      return applyingFlower('lavender');
    case 'coldTolerance':
      return applyingFlower('peppermint');
    case 'heatTolerance':
      return applyingFlower('meadowsweet');
    case 'coldResistance':
      return applyingFlower('rose');
    case 'vigorBuff':
      return applyingWorldPlazaEntityBuff(
        healthState,
        'well-fed-vigor-buff',
        nowMs
      );
    case 'braced':
      return applyingBraced(healthState);
    case 'shortenDiseaseOrResist':
      return applyingFlower('echinacea');
    case 'sleepRegen':
      return applyingFlower('valerian');
    case 'sleepAndPurgeMild':
      return clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity(
        applyingFlower('valerian'),
        'mild'
      );
    case 'bleedAndBraced':
      return applyingBraced(applyingFlower('yarrow'));
    case 'shortenDiseaseTargeted':
      return shorteningWolfFeverOrAllDiseases(healthState, worldEpochMs);
    case 'shortenDisease':
      return shorteningWorldPlazaEntityDiseaseRemainingDuration(
        healthState,
        worldEpochMs
      );
    case 'infectionResist':
      return applyingFlower('echinacea');
    case 'deepSleepRegenAndAccelerateDisease':
      return shorteningWorldPlazaEntityDiseaseRemainingDuration(
        shorteningWorldPlazaEntityDiseaseRemainingDuration(
          applyingFlower('valerian'),
          worldEpochMs
        ),
        worldEpochMs
      );
    case 'foxgloveGamble':
      // Flower path succeeds when foxgloveRoll < flower threshold; force win/lose from healer odds.
      return applyingHealerFlowerEffect(
        healthState,
        'foxglove',
        nowMs,
        worldEpochMs,
        effectRoll < DEFINING_WORLD_PLAZA_HEALER_FOXGLOVE_SUCCESS_CHANCE ? 0 : 1
      );
    case 'frostbiteClearAndBraced':
      return applyingBraced(
        applyingWorldPlazaEntityFrostbiteStack({
          state: healthState,
          stackCount: 0,
          nowMs,
        }).state
      );
    case 'purgeByMaxSeverityModerate': {
      const purgedModerate =
        clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity(
          healthState,
          'moderate'
        );
      return effectRoll < DEFINING_WORLD_PLAZA_HEALER_GRADED_PURGE_SEVERE_CHANCE
        ? clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity(
            purgedModerate,
            'severe'
          )
        : purgedModerate;
    }
    case 'purgeSevereGamble':
      return effectRoll <
        DEFINING_WORLD_PLAZA_HEALER_BELLADONNA_PURGE_SUCCESS_CHANCE
        ? clearingWorldPlazaEntityDiseaseEffectsByMaxSeverity(
            healthState,
            'critical'
          )
        : applyingFlower('belladonna');
  }
}
