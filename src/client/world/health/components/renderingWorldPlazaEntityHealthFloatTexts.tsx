'use client';

import { Icon } from '@/components/ui/icon';
import {
  applyingWorldPlazaCameraZoomedDomOverlayScaleToElement,
  computingWorldPlazaCameraZoomedDomOverlayPositionTransform,
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle,
} from '@/components/world/domains/computingWorldPlazaCameraZoomedDomOverlayTransform';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { STYLING_WORLD_PLAZA_HUD_LABEL_CLASS } from '@/components/world/domains/definingWorldPlazaHudThemeConstants';
import type { DefiningWorldPlazaRemotePlayer } from '@/components/world/domains/definingWorldPlazaOnlineRoom';
import type { DefiningWorldPlazaPlayerRenderPosition } from '@/components/world/domains/definingWorldPlazaPlayerRenderPosition';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
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
import { resolvingWorldPlazaEntityHealthFloatTextScreenPoint } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthFloatTextScreenPoint';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { useLayoutEffect, useRef } from 'react';

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_WRAPPER_CLASS_NAME =
  'absolute left-0 top-0 z-10 will-change-transform select-none' as const;

const RENDERING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_INITIAL_SCALE_STYLE =
  computingWorldPlazaCameraZoomedDomOverlayScaleStyle();

function computingWorldPlazaEntityHealthFloatTextIconSizePx(
  fontSizePx: number
): number {
  return Math.max(12, Math.round(fontSizePx * 0.82));
}

export interface RenderingWorldPlazaEntityHealthFloatTextsProps {
  localUserId: string;
  anchorGridX: number;
  anchorGridY: number;
  floatingTexts: readonly DefiningWorldPlazaEntityHealthFloatText[];
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  remotePlayerRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaRemotePlayer>
  >;
  playerRenderPositionRegistryRef: React.RefObject<
    Map<string, DefiningWorldPlazaPlayerRenderPosition>
  >;
  remotePlayers: readonly DefiningWorldPlazaRemotePlayer[];
  cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  cameraWorldZoomRef: React.RefObject<number>;
}

/**
 * Cinzel combat floats that rise directly above the local player's avatar head.
 */
export function RenderingWorldPlazaEntityHealthFloatTexts({
  localUserId,
  anchorGridX,
  anchorGridY,
  floatingTexts,
  playerPositionRef,
  remotePlayerRegistryRef,
  playerRenderPositionRegistryRef,
  remotePlayers,
  cameraOffsetRef,
  cameraWorldZoomRef,
}: RenderingWorldPlazaEntityHealthFloatTextsProps): React.JSX.Element {
  const floatingTextsRef = useRef(floatingTexts);
  const remotePlayersRef = useRef(remotePlayers);
  const floatElementByIdRef = useRef<Map<string, HTMLDivElement>>(new Map());

  floatingTextsRef.current = floatingTexts;
  remotePlayersRef.current = remotePlayers;

  useLayoutEffect(() => {
    if (floatingTexts.length === 0) {
      return;
    }

    let isActive = true;

    const updatingFloatPositions = (): void => {
      if (!isActive) {
        return;
      }

      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;

      for (const floatText of floatingTextsRef.current) {
        const floatElement = floatElementByIdRef.current.get(floatText.id);

        if (!floatElement) {
          continue;
        }

        const screenPoint = resolvingWorldPlazaEntityHealthFloatTextScreenPoint(
          {
            userId: localUserId,
            anchorGridX,
            anchorGridY,
            localUserId,
            playerPositionRef,
            remotePlayerRegistryRef,
            playerRenderPositionRegistryRef,
            remotePlayers: remotePlayersRef.current,
            cameraOffset,
            cameraWorldZoom,
            stackIndex: floatText.stackIndex,
          }
        );

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
  }, [
    anchorGridX,
    anchorGridY,
    cameraOffsetRef,
    cameraWorldZoomRef,
    floatingTexts.length,
    localUserId,
    playerPositionRef,
    playerRenderPositionRegistryRef,
    remotePlayerRegistryRef,
  ]);

  if (floatingTexts.length === 0) {
    return <></>;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {floatingTexts.map((floatText) => {
        const colorClass = resolvingWorldPlazaEntityHealthFloatTextClassName(
          floatText.kind,
          floatText.outcomeTier,
          floatText.damageKind
        );
        const usesDisplayFont =
          shouldWorldPlazaEntityHealthFloatTextUseDisplayFont(floatText.kind);
        const isDamageFloat = isWorldPlazaEntityHealthFloatDamageKind(
          floatText.kind
        );
        const damageFontSizePx = isDamageFloat
          ? computingWorldPlazaEntityHealthDamageFloatFontSizePx(floatText)
          : null;
        const damageAnimationDurationSec = isDamageFloat
          ? computingWorldPlazaEntityHealthDamageFloatAnimationDurationSec(
              floatText
            )
          : null;
        const isHealFloat =
          floatText.kind === 'heal' || floatText.kind === 'heal_regen';
        const isStudyFloat = floatText.kind === 'study';
        const isItemGainFloat = floatText.kind === 'item_gain';
        const isHealthScaleFloat = floatText.kind === 'health_scale';
        const healVisualStyle =
          isHealFloat || isHealthScaleFloat
            ? computingWorldPlazaEntityHealthHealFloatVisualStyle({
                outcomeTier: isHealthScaleFloat
                  ? 'critical'
                  : floatText.kind === 'heal_regen'
                    ? 'softened'
                    : floatText.outcomeTier,
                deviationScore: isHealthScaleFloat
                  ? 2
                  : floatText.deviationScore,
              })
            : null;
        const studyFontSizePx = isStudyFloat
          ? 18 + Math.max(0, Math.round(floatText.amount) - 1) * 3
          : null;
        const itemGainFontSizePx = isItemGainFloat ? 18 : null;
        const resolvedFontSizePx =
          damageFontSizePx ??
          healVisualStyle?.fontSizePx ??
          studyFontSizePx ??
          itemGainFontSizePx ??
          18;
        const iconName = mappingWorldPlazaEntityHealthFloatTextIcon(floatText);
        const amountLabel =
          formattingWorldPlazaEntityHealthFloatTextAmount(floatText);
        const iconSizePx =
          computingWorldPlazaEntityHealthFloatTextIconSizePx(
            resolvedFontSizePx
          );
        const itemTypeId =
          isItemGainFloat &&
          floatText.itemTypeId !== null &&
          floatText.itemTypeId !== undefined &&
          floatText.itemTypeId.length > 0
            ? floatText.itemTypeId
            : null;

        return (
          <div
            key={floatText.id}
            ref={(element) => {
              if (element) {
                floatElementByIdRef.current.set(floatText.id, element);
                return;
              }

              floatElementByIdRef.current.delete(floatText.id);
            }}
            className={
              RENDERING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_WRAPPER_CLASS_NAME
            }
            style={{
              transform:
                RENDERING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_HIDDEN_TRANSFORM,
            }}
          >
            <span
              className={`plaza-combat-float-text inline-flex items-center justify-center gap-0.5 whitespace-nowrap text-center font-bold leading-none ${colorClass} ${
                usesDisplayFont ? STYLING_WORLD_PLAZA_HUD_LABEL_CLASS : ''
              }`}
              style={{
                ...RENDERING_WORLD_PLAZA_ENTITY_HEALTH_FLOAT_TEXT_INITIAL_SCALE_STYLE,
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
              {itemTypeId !== null ? (
                <RenderingWorldPlazaInventoryItemGlyph
                  itemTypeId={itemTypeId}
                  registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
                  iconClassName="shrink-0"
                  iconStyle={{
                    width: iconSizePx,
                    height: iconSizePx,
                  }}
                  emojiStyle={{
                    fontSize: `${iconSizePx}px`,
                    lineHeight: 1,
                  }}
                  fallbackTextStyle={{
                    fontSize: `${Math.max(10, Math.round(iconSizePx * 0.7))}px`,
                  }}
                />
              ) : (
                <Icon
                  icon={iconName}
                  aria-hidden
                  className="shrink-0 text-current"
                  width={iconSizePx}
                  height={iconSizePx}
                />
              )}
              {amountLabel !== null ? (
                <span className="tabular-nums">{amountLabel}</span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
