import type { PlazaMechanicsBuffBadgeRollCurvePreviewModifiers } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeRollCurvePreview';
import { resolvingPlazaMechanicsBuffBadgeRollCurvePreview } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeRollCurvePreview';
import { resolvingWorldPlazaDamageOutcomeTierDescriptor } from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import {
  DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY,
  type DefiningWorldPlazaEntityBuffDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';

function formattingPlazaMechanicsBuffBadgeForcedTierPlayerImpact(
  preview: PlazaMechanicsBuffBadgeRollCurvePreviewModifiers,
  polarity: DefiningWorldPlazaEntityBuffDescriptor['polarity']
): string | null {
  if (preview.forcedTier === null) {
    return null;
  }

  const tierLabel = resolvingWorldPlazaDamageOutcomeTierDescriptor(
    preview.forcedTier
  ).label;
  const isBuff = polarity === 'buff';
  const helpsDefender = preview.side === 'defender';

  if (helpsDefender) {
    return isBuff
      ? `Good for you: every hit against you rolls ${tierLabel}.`
      : `Bad for you: every hit against you rolls ${tierLabel}.`;
  }

  return isBuff
    ? `Good for you: every hit you land rolls ${tierLabel}.`
    : `Bad for you: every hit you land rolls ${tierLabel}.`;
}

function formattingPlazaMechanicsBuffBadgeRollPlayerImpact(
  preview: PlazaMechanicsBuffBadgeRollCurvePreviewModifiers,
  polarity: DefiningWorldPlazaEntityBuffDescriptor['polarity']
): string {
  const forcedTierImpact =
    formattingPlazaMechanicsBuffBadgeForcedTierPlayerImpact(preview, polarity);

  if (forcedTierImpact !== null) {
    return forcedTierImpact;
  }

  const parts: string[] = [];
  const isBuff = polarity === 'buff';
  const helpsAttacker = preview.side === 'attacker';
  const helpsDefender = preview.side === 'defender';

  if (preview.rollMode === 'lock_in') {
    return helpsAttacker
      ? isBuff
        ? 'Good for you: every hit lands exactly on EV with no low or high roll.'
        : 'Bad for you: your hits never spike above EV.'
      : isBuff
        ? 'Good for you: attackers cannot spike huge hits off EV against you.'
        : 'Bad for you: hits against you never dip below EV.';
  }

  if (preview.rollMode === 'chaotic') {
    return helpsAttacker
      ? isBuff
        ? 'Risky upside: wilder highs and lows on your damage rolls.'
        : 'Bad for you: your damage swings harder in both directions.'
      : isBuff
        ? 'Good for you: attackers get less predictable spikes against you.'
        : 'Bad for you: incoming hits swing harder in both directions.';
  }

  if (preview.luck > 0.05) {
    parts.push(
      helpsAttacker
        ? isBuff
          ? 'more crits and lethal spikes on your hits'
          : 'fewer weak hits when you attack'
        : isBuff
          ? 'attackers land fewer brutal spikes on you'
          : 'more brutal spikes on you when hit'
    );
  } else if (preview.luck < -0.05) {
    parts.push(
      helpsAttacker
        ? isBuff
          ? 'fewer whiffs when you attack'
          : 'more weak hits when you attack'
        : isBuff
          ? 'more blocked, dodged, and softened hits against you'
          : 'fewer blocked and softened hits against you'
    );
  }

  if (preview.deviationBiasShift > 0.05) {
    parts.push(
      helpsAttacker
        ? isBuff
          ? 'rolls shift toward crit tiers'
          : 'your hits skew lower'
        : isBuff
          ? 'more blocks and dodges against you'
          : 'fewer blocks and dodges against you'
    );
  } else if (preview.deviationBiasShift < -0.05) {
    parts.push(
      helpsDefender
        ? isBuff
          ? 'more blocks, dodges, and softened hits'
          : 'fewer defensive low outcomes'
        : isBuff
          ? 'your hits skew lower'
          : 'attackers spike harder against you'
    );
  }

  if (preview.expectedMultiplier < 0.95) {
    parts.push(
      helpsDefender
        ? isBuff
          ? 'incoming hits land softer on average'
          : 'you take heavier average hits'
        : isBuff
          ? 'your average hit damage drops'
          : 'your average hit damage rises'
    );
  } else if (preview.expectedMultiplier > 1.05) {
    parts.push(
      helpsAttacker
        ? isBuff
          ? 'your average hit damage rises'
          : 'your average hit damage drops'
        : isBuff
          ? 'you take heavier average hits'
          : 'incoming hits land softer on average'
    );
  }

  if (preview.varianceMultiplier > 1.05) {
    parts.push(
      isBuff
        ? 'damage swings wider (less predictable)'
        : 'damage swings wider (harder to read)'
    );
  } else if (preview.varianceMultiplier < 0.95) {
    parts.push(
      isBuff
        ? 'tighter rolls with fewer wild swings'
        : 'tighter rolls with fewer wild swings'
    );
  }

  if (parts.length === 0) {
    return isBuff
      ? 'Tilts combat rolls in your favor while active.'
      : 'Tilts combat rolls against you while active.';
  }

  const summary = parts.join('; ');
  return isBuff ? `Good for you: ${summary}.` : `Bad for you: ${summary}.`;
}

function formattingPlazaMechanicsBuffBadgeGeneralPlayerImpact(
  descriptor: DefiningWorldPlazaEntityBuffDescriptor
): string {
  const isBuff = descriptor.polarity === 'buff';
  const effect = descriptor.effect;

  switch (effect.kind) {
    case 'incoming_damage_multiplier':
      return effect.multiplier < 1
        ? isBuff
          ? 'Good for you: you take less damage from hits.'
          : 'Bad for you: you take more damage from hits.'
        : isBuff
          ? 'Good for you: you absorb more punishment.'
          : 'Bad for you: hits hurt more than usual.';
    case 'physical_damage_lifesteal':
      return isBuff
        ? `Good for you: physical hits heal you for ${Math.round(effect.ratio * 100)}% of damage dealt.`
        : `Bad for you: you lose ${Math.round(effect.ratio * 100)}% of dealt damage to healing instead.`;
    case 'incoming_physical_damage_heal':
      return isBuff
        ? `Good for you: physical hits heal you for ${Math.round(effect.ratio * 100)}% of damage taken.`
        : `Bad for you: you only recover ${Math.round(effect.ratio * 100)}% of incoming physical hits.`;
    case 'incoming_heal_amplifier':
      return isBuff
        ? `Good for you: all healing you receive is increased by ${Math.round(effect.ratio * 100)}%.`
        : `Bad for you: healing you receive is reduced by ${Math.round(effect.ratio * 100)}%.`;
    case 'outgoing_heal_amplifier':
      return isBuff
        ? `Good for you: all healing you give is increased by ${Math.round(effect.ratio * 100)}%.`
        : `Bad for you: healing you give is reduced by ${Math.round(effect.ratio * 100)}%.`;
    case 'temporary_max_health':
      return isBuff
        ? 'Good for you: extra max HP buys time in a fight.'
        : 'Bad for you: your max HP is reduced.';
    case 'max_health_scale':
      return effect.multiplier > 1
        ? isBuff
          ? 'Good for you: a larger health pool keeps you alive longer.'
          : 'Bad for you: your max HP is scaled down.'
        : isBuff
          ? 'Good for you: your max HP is scaled up.'
          : 'Bad for you: a smaller health pool leaves less room for mistakes.';
    case 'heat_resistance':
      return isBuff
        ? 'Good for you: heat damage ticks hurt less.'
        : 'Bad for you: heat damage ticks hurt more.';
    case 'cold_resistance':
      return isBuff
        ? 'Good for you: cold damage ticks hurt less.'
        : 'Bad for you: cold damage ticks hurt more.';
    case 'toggle_heat_immunity':
      return isBuff
        ? 'Good for you: heat damage cannot touch you.'
        : 'Bad for you: heat immunity is disabled.';
    case 'toggle_cold_immunity':
      return isBuff
        ? 'Good for you: cold damage cannot touch you.'
        : 'Bad for you: cold immunity is disabled.';
    case 'invincibility_toggle':
      return isBuff
        ? 'Good for you: you cannot take damage while this lasts.'
        : 'Bad for you: you are not protected from damage.';
    case 'movement_modifier':
      return isBuff
        ? 'Good for you: movement or stamina behaves in your favor.'
        : 'Bad for you: movement or stamina works against you.';
    default:
      return isBuff
        ? 'Good for you: helps while the badge is active.'
        : 'Bad for you: hurts while the badge is active.';
  }
}

/** Whether a badge impact helps, hurts, or trades off for the player. */
export type PlazaMechanicsBuffBadgePlayerImpactSentiment =
  | 'good'
  | 'bad'
  | 'mixed';

/** Structured impact line: sentiment drives the arrow, text is the summary. */
export type PlazaMechanicsBuffBadgePlayerImpact = {
  sentiment: PlazaMechanicsBuffBadgePlayerImpactSentiment;
  text: string;
};

/** Sentence prefixes mapped to sentiments, stripped from the display text. */
const DEFINING_PLAZA_MECHANICS_BUFF_BADGE_IMPACT_PREFIXES: readonly {
  prefix: string;
  sentiment: PlazaMechanicsBuffBadgePlayerImpactSentiment;
}[] = [
  { prefix: 'Good for you: ', sentiment: 'good' },
  { prefix: 'Bad for you: ', sentiment: 'bad' },
  { prefix: 'Risky upside: ', sentiment: 'mixed' },
];

function structuringPlazaMechanicsBuffBadgePlayerImpact(
  rawImpact: string,
  polarity: DefiningWorldPlazaEntityBuffDescriptor['polarity']
): PlazaMechanicsBuffBadgePlayerImpact {
  for (const entry of DEFINING_PLAZA_MECHANICS_BUFF_BADGE_IMPACT_PREFIXES) {
    if (rawImpact.startsWith(entry.prefix)) {
      const strippedText = rawImpact.slice(entry.prefix.length);

      return {
        sentiment: entry.sentiment,
        text: strippedText.charAt(0).toUpperCase() + strippedText.slice(1),
      };
    }
  }

  return {
    sentiment: polarity === 'buff' ? 'good' : 'bad',
    text: rawImpact,
  };
}

/** One short line on why a badge helps or hurts the player wearing it. */
export function resolvingPlazaMechanicsBuffBadgePlayerImpact(
  buffId: string
): PlazaMechanicsBuffBadgePlayerImpact | null {
  const descriptor = DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY[buffId];

  if (!descriptor) {
    return null;
  }

  if (descriptor.effect.kind === 'damage_roll_modifiers') {
    const preview = resolvingPlazaMechanicsBuffBadgeRollCurvePreview(buffId);

    if (preview.kind !== 'roll_modifiers') {
      return null;
    }

    return structuringPlazaMechanicsBuffBadgePlayerImpact(
      formattingPlazaMechanicsBuffBadgeRollPlayerImpact(
        preview,
        descriptor.polarity
      ),
      descriptor.polarity
    );
  }

  return structuringPlazaMechanicsBuffBadgePlayerImpact(
    formattingPlazaMechanicsBuffBadgeGeneralPlayerImpact(descriptor),
    descriptor.polarity
  );
}
