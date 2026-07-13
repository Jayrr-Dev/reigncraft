"use client";

/**
 * Full-viewport edge vignette for wildlife danger sense + status-damage pulses.
 *
 * Wildlife: yellow caution / red danger by bearing.
 * Status ticks: full-rim orange-red (heat), white-blue (cold), black-red (hunger),
 * black-green (poison), black-brown (bleed).
 *
 * @module components/world/components/renderingWorldPlazaDangerSenseHudOverlay
 */

import { advancingWorldPlazaDangerSenseHudSampleIntensities } from '@/components/world/domains/advancingWorldPlazaDangerSenseHudSampleIntensities';
import { computingWorldPlazaDangerSenseHudSampleIntensities } from '@/components/world/domains/computingWorldPlazaDangerSenseHudSampleIntensities';
import { computingWorldPlazaDangerSenseHudThreatBearings } from '@/components/world/domains/computingWorldPlazaDangerSenseHudThreatBearings';
import {
  creatingWorldPlazaDangerSenseHudSampleIntensities,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_WRITE_EPSILON,
} from '@/components/world/domains/definingWorldPlazaDangerSenseHudConstants';
import {
  DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY,
  type DefiningWorldPlazaDangerSenseStatusDamagePulseId,
} from '@/components/world/domains/definingWorldPlazaDangerSenseStatusDamagePulseRegistry';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { listingWorldPlazaDangerSenseStatusDamagePulses } from '@/components/world/domains/managingWorldPlazaDangerSenseStatusDamagePulseStore';
import {
  resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage,
  resolvingWorldPlazaDangerSenseHudEdgeFadeMaskStyles,
} from '@/components/world/domains/resolvingWorldPlazaDangerSenseHudVignetteCss';
import { resolvingWorldPlazaDangerSenseStatusDamagePulseBackgroundImage } from '@/components/world/domains/resolvingWorldPlazaDangerSenseStatusDamagePulseCss';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import {
  listingWildlifeInstances,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { useLayoutEffect, useRef } from 'react';

export type RenderingWorldPlazaDangerSenseHudOverlayProps = {
  readonly wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly playerUserId: string | null;
};

const DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES =
  resolvingWorldPlazaDangerSenseHudEdgeFadeMaskStyles();

const DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_PULSE_LAYER_CLASS_NAME =
  'pointer-events-none absolute inset-0' as const;

/**
 * Imperatively updates wildlife conic + status pulse layers from DOM overlay rAF.
 */
export function RenderingWorldPlazaDangerSenseHudOverlay({
  wildlifeStoreRef,
  playerPositionRef,
  playerUserId,
}: RenderingWorldPlazaDangerSenseHudOverlayProps): React.JSX.Element {
  const wildlifeLayerRef = useRef<HTMLDivElement | null>(null);
  const statusPulseLayerRefs = useRef<
    Partial<
      Record<DefiningWorldPlazaDangerSenseStatusDamagePulseId, HTMLDivElement | null>
    >
  >({});
  const displayedDangerSamplesRef = useRef(
    creatingWorldPlazaDangerSenseHudSampleIntensities()
  );
  const displayedCautionSamplesRef = useRef(
    creatingWorldPlazaDangerSenseHudSampleIntensities()
  );
  const targetDangerSamplesRef = useRef(
    creatingWorldPlazaDangerSenseHudSampleIntensities()
  );
  const targetCautionSamplesRef = useRef(
    creatingWorldPlazaDangerSenseHudSampleIntensities()
  );
  const lastWildlifeFingerprintRef = useRef('');
  const lastStatusFingerprintRef = useRef('');
  const playerUserIdRef = useRef(playerUserId);
  playerUserIdRef.current = playerUserId;

  useLayoutEffect(() => {
    return subscribingWorldPlazaDomOverlayFrame((deltaMs, frameTimeMs) => {
      const wildlifeLayerElement = wildlifeLayerRef.current;
      const store = wildlifeStoreRef.current;
      const playerPosition = playerPositionRef.current;
      const currentPlayerUserId = playerUserIdRef.current;

      if (wildlifeLayerElement) {
        const threats =
          store && playerPosition && currentPlayerUserId
            ? computingWorldPlazaDangerSenseHudThreatBearings({
                instances: listingWildlifeInstances(store),
                playerPosition,
                playerUserId: currentPlayerUserId,
              })
            : [];

        computingWorldPlazaDangerSenseHudSampleIntensities(
          threats,
          targetDangerSamplesRef.current,
          targetCautionSamplesRef.current
        );
        advancingWorldPlazaDangerSenseHudSampleIntensities(
          displayedDangerSamplesRef.current,
          targetDangerSamplesRef.current,
          deltaMs
        );
        advancingWorldPlazaDangerSenseHudSampleIntensities(
          displayedCautionSamplesRef.current,
          targetCautionSamplesRef.current,
          deltaMs
        );

        const dangerSamples = displayedDangerSamplesRef.current;
        const cautionSamples = displayedCautionSamplesRef.current;
        const backgroundImage =
          resolvingWorldPlazaDangerSenseHudConicGradientBackgroundImage(
            dangerSamples,
            cautionSamples
          );

        if (backgroundImage === 'none') {
          if (lastWildlifeFingerprintRef.current !== 'none') {
            lastWildlifeFingerprintRef.current = 'none';
            wildlifeLayerElement.style.opacity = '0';
            wildlifeLayerElement.style.backgroundImage = 'none';
          }
        } else {
          let fingerprintSum = 0;
          for (
            let sampleIndex = 0;
            sampleIndex < dangerSamples.length;
            sampleIndex += 1
          ) {
            fingerprintSum +=
              Math.round(
                (dangerSamples[sampleIndex] ?? 0) /
                  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_WRITE_EPSILON
              ) *
                (sampleIndex + 1) +
              Math.round(
                (cautionSamples[sampleIndex] ?? 0) /
                  DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_SAMPLE_WRITE_EPSILON
              ) *
                (sampleIndex + 1) *
                17;
          }
          const fingerprint = String(fingerprintSum);
          if (fingerprint !== lastWildlifeFingerprintRef.current) {
            lastWildlifeFingerprintRef.current = fingerprint;
            wildlifeLayerElement.style.opacity = '1';
            wildlifeLayerElement.style.backgroundImage = backgroundImage;
          }
        }
      }

      const activePulses =
        listingWorldPlazaDangerSenseStatusDamagePulses(frameTimeMs);
      const activeById = new Map(
        activePulses.map((pulse) => [pulse.pulseId, pulse])
      );
      let statusFingerprint = '';

      for (const definition of DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY) {
        const pulse = activeById.get(definition.pulseId);
        const intensity = pulse?.intensity ?? 0;
        const strengthScale = pulse?.strengthScale ?? 0;
        statusFingerprint += `${definition.pulseId}:${intensity.toFixed(3)}:${strengthScale.toFixed(3)};`;
      }

      if (statusFingerprint !== lastStatusFingerprintRef.current) {
        lastStatusFingerprintRef.current = statusFingerprint;

        for (const definition of DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY) {
          const layerElement = statusPulseLayerRefs.current[definition.pulseId];
          if (!layerElement) {
            continue;
          }

          const pulse = activeById.get(definition.pulseId);
          const intensity = pulse?.intensity ?? 0;
          const strengthScale = pulse?.strengthScale ?? 0;
          const backgroundImage =
            resolvingWorldPlazaDangerSenseStatusDamagePulseBackgroundImage(
              definition,
              intensity,
              strengthScale
            );

          if (backgroundImage === 'none') {
            layerElement.style.opacity = '0';
            layerElement.style.backgroundImage = 'none';
          } else {
            layerElement.style.opacity = '1';
            layerElement.style.backgroundImage = backgroundImage;
          }
        }
      }
    });
  }, [playerPositionRef, wildlifeStoreRef]);

  const maskStyles = {
    WebkitMaskImage:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskImage,
    WebkitMaskSize:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskSize,
    WebkitMaskPosition:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskPosition,
    WebkitMaskRepeat:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskRepeat,
    WebkitMaskComposite:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.WebkitMaskComposite,
    maskImage: DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskImage,
    maskSize: DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskSize,
    maskPosition:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskPosition,
    maskRepeat:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskRepeat,
    maskComposite:
      DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_EDGE_MASK_STYLES.maskComposite,
  } as const;

  return (
    <div
      className={DEFINING_WORLD_PLAZA_DANGER_SENSE_HUD_OVERLAY_CLASS_NAME}
      aria-hidden
    >
      <div
        ref={wildlifeLayerRef}
        className={DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_PULSE_LAYER_CLASS_NAME}
        style={{
          opacity: 0,
          backgroundImage: 'none',
          ...maskStyles,
        }}
      />
      {DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_DAMAGE_PULSE_REGISTRY.map(
        (definition) => (
          <div
            key={definition.pulseId}
            ref={(element) => {
              statusPulseLayerRefs.current[definition.pulseId] = element;
            }}
            className={DEFINING_WORLD_PLAZA_DANGER_SENSE_STATUS_PULSE_LAYER_CLASS_NAME}
            data-danger-sense-status-pulse={definition.pulseId}
            style={{
              opacity: 0,
              backgroundImage: 'none',
              ...maskStyles,
            }}
          />
        )
      )}
    </div>
  );
}
