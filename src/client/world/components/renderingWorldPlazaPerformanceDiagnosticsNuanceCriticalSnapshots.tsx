'use client';

import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_FAILURE,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_SUCCESS,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_EMPTY,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_SECTION,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotConstants';
import {
  listingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
  subscribingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
  type ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot,
} from '@/components/world/domains/managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotStore';
import { showToast } from '@devvit/web/client';
import { useSyncExternalStore } from 'react';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CRITICAL_SECTION_LABEL_CLASS_NAME =
  'font-semibold text-amber-200' as const;

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CRITICAL_COPY_BUTTON_CLASS_NAME =
  'rounded border border-amber-200/30 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-semibold text-amber-50 hover:bg-amber-400/20' as const;

function formattingCriticalCaptureRowLabel(
  capture: ManagingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshot
): string {
  const timeLabel = new Date(capture.capturedAtMs).toLocaleTimeString();
  return `${capture.label} ${capture.index.toFixed(2)} · ${timeLabel}`;
}

/**
 * Lists auto-captured critical nuance snapshots with per-row Copy.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots(): React.JSX.Element {
  const captures = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
    listingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
    () => []
  );

  return (
    <div className="mt-2 border-t border-amber-300/15 pt-2">
      <div
        className={
          RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CRITICAL_SECTION_LABEL_CLASS_NAME
        }
      >
        {
          LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_SECTION
        }
      </div>
      {captures.length === 0 ? (
        <div className="text-amber-100/80">
          {
            LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_EMPTY
          }
        </div>
      ) : (
        <div className="space-y-1">
          {captures.map((capture) => (
            <div
              key={capture.id}
              className="flex items-start justify-between gap-2"
            >
              <div className="min-w-0 flex-1 text-red-100/90">
                {formattingCriticalCaptureRowLabel(capture)}
              </div>
              <button
                type="button"
                {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                className={
                  RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_CRITICAL_COPY_BUTTON_CLASS_NAME
                }
                onClick={() => {
                  void copyingWorldPlazaTextToClipboard(capture.text).then(
                    (didCopy) => {
                      showToast(
                        didCopy
                          ? LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_SUCCESS
                          : LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_FAILURE
                      );
                    }
                  );
                }}
              >
                {
                  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY
                }
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
