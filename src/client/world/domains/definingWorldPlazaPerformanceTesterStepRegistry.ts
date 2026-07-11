/**
 * Declarative multistep performance tester catalog.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry
 */

import type { DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_PROCEDURAL_SETTLE_MS,
} from '@/components/world/domains/definingWorldPlazaPerformanceTesterConstants';

/** Step ids in suite execution order. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP = {
  BASELINE_RESTORE: 'baseline-restore',
  IDLE_BASELINE: 'idle-baseline',
  WALK_PROMPT: 'walk-prompt',
  PROCEDURAL_OFF: 'procedural-off',
  PROCEDURAL_ON: 'procedural-on',
  COLLISION_DEBUG_ON: 'collision-debug-on',
  COLLISION_DEBUG_OFF: 'collision-debug-off',
  LAYERS_NO_TREES: 'layers-no-trees',
  LAYERS_NO_CANOPIES: 'layers-no-canopies',
  LAYERS_NO_FLOOR: 'layers-no-floor',
  LAYERS_NO_AVATARS: 'layers-no-avatars',
  LAYERS_NO_MINIMAP: 'layers-no-minimap',
  LAYERS_MINIMAL: 'layers-minimal',
  LAYERS_RESTORE: 'layers-restore',
} as const;

/** One performance tester step id. */
export type DefiningWorldPlazaPerformanceTesterStepId =
  (typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP)[keyof typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP];

/** Scene toggles applied before a step samples. */
export type DefiningWorldPlazaPerformanceTesterStepConfig = {
  readonly proceduralTreesAndRocks?: boolean;
  readonly collisionDebugVisible?: boolean;
  readonly renderLayers?: Partial<
    Record<DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId, boolean>
  >;
  readonly restoreAllRenderLayers?: boolean;
};

/** One declarative tester step. */
export type DefiningWorldPlazaPerformanceTesterStepDefinition = {
  readonly id: DefiningWorldPlazaPerformanceTesterStepId;
  readonly label: string;
  readonly description: string;
  readonly settleMs: number;
  readonly sampleMs: number;
  readonly promptWalk?: boolean;
  readonly config: DefiningWorldPlazaPerformanceTesterStepConfig;
};

const LAYER = DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER;

const BASELINE_CONFIG: DefiningWorldPlazaPerformanceTesterStepConfig = {
  restoreAllRenderLayers: true,
  collisionDebugVisible: false,
};

const LAYERS_MINIMAL_CONFIG: DefiningWorldPlazaPerformanceTesterStepConfig = {
  renderLayers: {
    [LAYER.FLOOR_TILES]: true,
    [LAYER.TREE_TRUNKS]: false,
    [LAYER.TREE_CANOPIES]: false,
    [LAYER.AVATARS]: true,
    [LAYER.PLACED_BLOCKS]: false,
    [LAYER.BIOME_BACKDROP]: false,
    [LAYER.MINIMAP]: false,
  },
};

/** Suite order matches registry array order. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY: readonly DefiningWorldPlazaPerformanceTesterStepDefinition[] =
  [
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.BASELINE_RESTORE,
      label: 'Baseline restore',
      description:
        'All render layers on, collision debug off, procedural preference unchanged.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: BASELINE_CONFIG,
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.IDLE_BASELINE,
      label: 'Idle baseline',
      description: 'Same as baseline while standing still.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: BASELINE_CONFIG,
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.WALK_PROMPT,
      label: 'Walk prompt',
      description: 'Same config; walk during the sample window.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      promptWalk: true,
      config: BASELINE_CONFIG,
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.PROCEDURAL_OFF,
      label: 'Procedural off',
      description: 'Disable procedural trees and rocks.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_PROCEDURAL_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: { proceduralTreesAndRocks: false },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.PROCEDURAL_ON,
      label: 'Procedural on',
      description: 'Enable procedural trees and rocks.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_PROCEDURAL_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: { proceduralTreesAndRocks: true },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.COLLISION_DEBUG_ON,
      label: 'Collision debug on',
      description: 'Draw collision overlay.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: { collisionDebugVisible: true },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.COLLISION_DEBUG_OFF,
      label: 'Collision debug off',
      description: 'Hide collision overlay.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: { collisionDebugVisible: false },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_NO_TREES,
      label: 'No tree layers',
      description: 'Disable trunk and canopy render layers.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: {
        renderLayers: {
          [LAYER.TREE_TRUNKS]: false,
          [LAYER.TREE_CANOPIES]: false,
        },
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_NO_CANOPIES,
      label: 'No canopies',
      description: 'Disable canopy render layer only.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: {
        renderLayers: {
          [LAYER.TREE_CANOPIES]: false,
        },
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_NO_FLOOR,
      label: 'No floor',
      description: 'Disable floor tile render layer.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: {
        renderLayers: {
          [LAYER.FLOOR_TILES]: false,
        },
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_NO_AVATARS,
      label: 'No avatars',
      description: 'Disable avatar render layer.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: {
        renderLayers: {
          [LAYER.AVATARS]: false,
        },
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_NO_MINIMAP,
      label: 'No minimap',
      description: 'Disable minimap render layer.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: {
        renderLayers: {
          [LAYER.MINIMAP]: false,
        },
      },
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_MINIMAL,
      label: 'Minimal layers',
      description: 'Only floor tiles and avatars enabled.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: LAYERS_MINIMAL_CONFIG,
    },
    {
      id: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.LAYERS_RESTORE,
      label: 'Layers restore',
      description: 'Restore all render layers.',
      settleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS,
      sampleMs: DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS,
      config: { restoreAllRenderLayers: true },
    },
  ];

/**
 * Returns one step definition by id.
 *
 * @param stepId - Registry step id.
 */
export function gettingWorldPlazaPerformanceTesterStepById(
  stepId: DefiningWorldPlazaPerformanceTesterStepId
): DefiningWorldPlazaPerformanceTesterStepDefinition {
  const stepDefinition =
    DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY.find(
      (step) => step.id === stepId
    );

  if (!stepDefinition) {
    throw new Error(`Unknown performance tester step: ${stepId}`);
  }

  return stepDefinition;
}

/**
 * Returns true when the id is a known tester step.
 *
 * @param stepId - Candidate step id.
 */
export function checkingWorldPlazaPerformanceTesterStepIdIsKnown(
  stepId: string
): stepId is DefiningWorldPlazaPerformanceTesterStepId {
  return DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY.some(
    (step) => step.id === stepId
  );
}
