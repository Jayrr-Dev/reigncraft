'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER,
  listingWorldPlazaEntityDiseaseDescriptors,
  type DefiningWorldPlazaEntityDiseaseId,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_DISEASE_DEV_PREVIEW_DURATION_SCALE } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseTimeConstants';

const RENDERING_WORLD_PLAZA_DEV_MODE_DISEASE_BUTTON_CLASS_NAME =
  'rounded border border-lime-400/35 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-lime-100/90 hover:bg-lime-500/15' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_DISEASE_DESCRIPTORS =
  listingWorldPlazaEntityDiseaseDescriptors().sort((left, right) => {
    const severityDelta =
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[left.severity] -
      DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[right.severity];

    if (severityDelta !== 0) {
      return severityDelta;
    }

    return left.label.localeCompare(right.label);
  });

export type RenderingWorldPlazaDevModeDiseaseControlsProps = {
  onApplyDisease: (diseaseId: DefiningWorldPlazaEntityDiseaseId) => void;
};

/**
 * Dev panel buttons that grant any registered disease on a 5x-compressed timeline.
 */
export function RenderingWorldPlazaDevModeDiseaseControls({
  onApplyDisease,
}: RenderingWorldPlazaDevModeDiseaseControlsProps): React.JSX.Element {
  const previewSpeedLabel = Math.round(
    1 / DEFINING_WORLD_PLAZA_ENTITY_DISEASE_DEV_PREVIEW_DURATION_SCALE
  );

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Diseases
      </span>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Grant any disease with incubation, stages, and illness compressed{' '}
        {previewSpeedLabel}x. Re-click replaces an active copy and clears
        immunity for that disease so you can retest.
      </div>
      <div className="grid grid-cols-2 gap-1">
        {RENDERING_WORLD_PLAZA_DEV_MODE_DISEASE_DESCRIPTORS.map(
          (descriptor) => (
            <button
              key={descriptor.id}
              type="button"
              title={`${descriptor.description} (${descriptor.severity})`}
              className={
                RENDERING_WORLD_PLAZA_DEV_MODE_DISEASE_BUTTON_CLASS_NAME
              }
              onClick={() => onApplyDisease(descriptor.id)}
            >
              {descriptor.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
