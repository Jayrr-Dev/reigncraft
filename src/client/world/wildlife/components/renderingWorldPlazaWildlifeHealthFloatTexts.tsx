'use client';

import { Icon } from '@/components/ui/icon';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { STYLING_WORLD_PLAZA_HUD_LABEL_CLASS } from '@/components/world/domains/definingWorldPlazaHudThemeConstants';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  computingWorldPlazaEntityHealthDamageFloatAnimationDurationSec,
  computingWorldPlazaEntityHealthDamageFloatFontSizePx,
} from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamageFloatVisualScale';
import { computingWorldPlazaEntityHealthHealFloatVisualStyle } from '@/components/world/health/domains/computingWorldPlazaEntityHealthHealFloatVisualStyle';
import type { DefiningWorldPlazaEntityHealthFloatText } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextTypes';
import {
  formattingWorldPlazaEntityHealthFloatTextAmount,
  isWorldPlazaEntityHealthFloatDamageKind,
  resolvingWorldPlazaEntityHealthFloatTextClassName,
  shouldWorldPlazaEntityHealthFloatTextUseDisplayFont,
} from '@/components/world/health/domains/formattingWorldPlazaEntityHealthFloatTextLabel';
import { mappingWorldPlazaEntityHealthFloatTextIcon } from '@/components/world/health/domains/mappingWorldPlazaEntityHealthFloatTextIcon';
import type { DefiningWildlifeFloatingCombatText } from '@/components/world/wildlife/domains/definingWildlifeFloatingCombatTextTypes';
import { resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint } from '@/components/world/wildlife/domains/resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_WILDLIFE_HEALTH_FLOAT_TEXT_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_HEALTH_FLOAT_TEXT_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_WILDLIFE_HEALTH_FLOAT_TEXT_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

function computingWorldPlazaWildlifeHealthFloatTextIconSizePx(
  fontSizePx: number
): number {
  return Math.max(12, Math.round(fontSizePx * 0.82));
}

export type RenderingWorldPlazaWildlifeHealthFloatTextsProps = {
  floatingCombatTexts: readonly DefiningWildlifeFloatingCombatText[];
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
};

function renderingWildlifeFloatTextLabel(
  floatText: DefiningWorldPlazaEntityHealthFloatText
): React.JSX.Element {
  const colorClass = resolvingWorldPlazaEntityHealthFloatTextClassName(
    floatText.kind,
    floatText.outcomeTier,
    floatText.damageKind
  );
  const usesDisplayFont = shouldWorldPlazaEntityHealthFloatTextUseDisplayFont(
    floatText.kind
  );
  const isDamageFloat = isWorldPlazaEntityHealthFloatDamageKind(floatText.kind);
  const damageFontSizePx = isDamageFloat
    ? computingWorldPlazaEntityHealthDamageFloatFontSizePx(floatText)
    : null;
  const damageAnimationDurationSec = isDamageFloat
    ? computingWorldPlazaEntityHealthDamageFloatAnimationDurationSec(floatText)
    : null;
  const isHealFloat =
    floatText.kind === 'heal' || floatText.kind === 'heal_regen';
  const isHealthScaleFloat = floatText.kind === 'health_scale';
  const healVisualStyle =
    isHealFloat || isHealthScaleFloat
      ? computingWorldPlazaEntityHealthHealFloatVisualStyle({
          outcomeTier: isHealthScaleFloat
            ? 'critical'
            : floatText.kind === 'heal_regen'
              ? 'softened'
              : floatText.outcomeTier,
          deviationScore: isHealthScaleFloat ? 2 : floatText.deviationScore,
        })
      : null;
  const resolvedFontSizePx =
    damageFontSizePx ?? healVisualStyle?.fontSizePx ?? 18;
  const iconName = mappingWorldPlazaEntityHealthFloatTextIcon(floatText);
  const amountLabel =
    formattingWorldPlazaEntityHealthFloatTextAmount(floatText);
  const iconSizePx =
    computingWorldPlazaWildlifeHealthFloatTextIconSizePx(resolvedFontSizePx);

  return (
    <span
      className={`plaza-combat-float-text inline-flex items-center justify-center gap-0.5 whitespace-nowrap text-center font-bold leading-none ${colorClass} ${
        usesDisplayFont ? STYLING_WORLD_PLAZA_HUD_LABEL_CLASS : ''
      }`}
      style={{
        ...RENDERING_WORLD_PLAZA_WILDLIFE_HEALTH_FLOAT_TEXT_INITIAL_SCALE_STYLE,
        fontSize: `${resolvedFontSizePx}px`,
        ...(damageAnimationDurationSec !== null
          ? { animationDuration: `${damageAnimationDurationSec}s` }
          : {}),
        ...(healVisualStyle !== null
          ? {
              color: healVisualStyle.color,
              WebkitTextStroke: healVisualStyle.WebkitTextStroke,
              paintOrder: healVisualStyle.paintOrder,
              textShadow: healVisualStyle.textShadow,
            }
          : {}),
      }}
    >
      <Icon
        icon={iconName}
        aria-hidden
        className="shrink-0 text-current"
        width={iconSizePx}
        height={iconSizePx}
      />
      {amountLabel !== null ? (
        <span className="tabular-nums">{amountLabel}</span>
      ) : null}
    </span>
  );
}

/**
 * Combat floats above wildlife sprites, matching the local player style.
 */
export function RenderingWorldPlazaWildlifeHealthFloatTexts({
  floatingCombatTexts,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaWildlifeHealthFloatTextsProps): React.JSX.Element {
  const floatingCombatTextsRef = useRef(floatingCombatTexts);
  const floatElementByIdRef = useRef<Map<string, HTMLDivElement>>(new Map());

  floatingCombatTextsRef.current = floatingCombatTexts;

  useLayoutEffect(() => {
    if (floatingCombatTexts.length === 0) {
      return;
    }

    let isActive = true;

    const updatingFloatPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      for (const entry of floatingCombatTextsRef.current) {
        const floatElement = floatElementByIdRef.current.get(
          entry.floatText.id
        );

        if (!floatElement) {
          continue;
        }

        const screenPoint =
          resolvingWorldPlazaWildlifeHealthFloatTextScreenPoint({
            gridPoint: { x: entry.gridX, y: entry.gridY, layer: 1 },
            sizeScale: entry.sizeScale,
            cameraOffset,
            cameraWorldZoom,
            stackIndex: entry.floatText.stackIndex,
          });

        floatElement.style.transform =
          computingWorldPlazaCameraZoomedDomOverlayPositionTransform(
            screenPoint.x,
            screenPoint.y
          );
        applyingWorldPlazaCameraZoomedDomOverlayScaleToElement(
          floatElement.firstElementChild as HTMLElement | null,
          cameraWorldZoom
        );
      }
    };

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      () => {
        updatingFloatPositions();
      }
    );

    return () => {
      isActive = false;
      unsubscribeDomOverlayFrame();
    };
  }, [cameraOffsetRef, cameraWorldZoomRef, floatingCombatTexts.length]);

  if (floatingCombatTexts.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {floatingCombatTexts.map((entry) => (
        <div
          key={entry.floatText.id}
          ref={(element) => {
            if (element) {
              floatElementByIdRef.current.set(entry.floatText.id, element);
              return;
            }

            floatElementByIdRef.current.delete(entry.floatText.id);
          }}
          className={
            RENDERING_WORLD_PLAZA_WILDLIFE_HEALTH_FLOAT_TEXT_WRAPPER_CLASS_NAME
          }
          style={{
            transform:
              RENDERING_WORLD_PLAZA_WILDLIFE_HEALTH_FLOAT_TEXT_HIDDEN_TRANSFORM,
          }}
        >
          {renderingWildlifeFloatTextLabel(entry.floatText)}
        </div>
      ))}
    </div>
  );
}
