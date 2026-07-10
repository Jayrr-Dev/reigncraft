/**
 * Copies the mobile debug report and shows gameplay toasts.
 *
 * @module components/world/domains/copyingWorldPlazaMobileDebugReport
 */

import {
  showingReigncraftToastError,
  showingReigncraftToastSuccess,
} from '@/components/ui/domains/showingReigncraftToast';
import { buildingWorldPlazaMobileDebugReport } from '@/components/world/domains/buildingWorldPlazaMobileDebugReport';
import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import {
  LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_FAILED,
  LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_SUCCESS,
} from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import type { ManagingWorldPlazaMobileDebugFrameStats } from '@/components/world/domains/managingWorldPlazaMobileDebugSampler';
import { peekingWorldPlazaMobileDebugReportParams } from '@/components/world/domains/registeringWorldPlazaMobileDebugConsoleApi';

export type CopyingWorldPlazaMobileDebugReportParams = {
  readonly performanceProfile: DefiningWorldPlazaPerformanceProfile;
  readonly frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  readonly uptimeSec: number;
};

/**
 * Builds the report, copies it to the clipboard, and returns the text.
 */
export async function copyingWorldPlazaMobileDebugReport(
  params: CopyingWorldPlazaMobileDebugReportParams
): Promise<string> {
  const reportText = buildingWorldPlazaMobileDebugReport(params);
  const didCopy = await copyingWorldPlazaTextToClipboard(reportText);

  if (didCopy) {
    showingReigncraftToastSuccess(
      LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_SUCCESS
    );
  } else {
    showingReigncraftToastError(LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_FAILED);
  }

  return reportText;
}

/**
 * Copies a report from the live plaza context (Settings button).
 */
export async function copyingWorldPlazaMobileDebugReportFromLiveContext(): Promise<string> {
  const reportParams = peekingWorldPlazaMobileDebugReportParams();

  if (!reportParams) {
    showingReigncraftToastError(LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_FAILED);
    return '';
  }

  return copyingWorldPlazaMobileDebugReport(reportParams);
}
