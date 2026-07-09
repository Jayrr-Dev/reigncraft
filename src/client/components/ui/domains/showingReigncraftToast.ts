/**
 * Thin wrappers around Sonner that route to Reigncraft toaster instances.
 *
 * @module components/ui/domains/showingReigncraftToast
 */

import {
  DEFINING_REIGNCRAFT_TOAST_DURATION_MS,
  DEFINING_REIGNCRAFT_TOASTER_ID,
  type DefiningReigncraftToasterId,
} from '@/components/ui/domains/definingReigncraftToastConstants';
import { toast, type ExternalToast } from 'sonner';

export type ShowingReigncraftToastOptions = Omit<ExternalToast, 'toasterId'> & {
  readonly toasterId?: DefiningReigncraftToasterId;
};

function resolvingReigncraftToastOptions(
  options?: ShowingReigncraftToastOptions
): ExternalToast {
  return {
    duration: DEFINING_REIGNCRAFT_TOAST_DURATION_MS,
    ...options,
    toasterId: options?.toasterId ?? DEFINING_REIGNCRAFT_TOASTER_ID.plaza,
  };
}

/**
 * Shows a default Reigncraft toast (gameplay feedback by default).
 */
export function showingReigncraftToast(
  message: string,
  options?: ShowingReigncraftToastOptions
): string | number {
  return toast(message, resolvingReigncraftToastOptions(options));
}

/**
 * Shows a success Reigncraft toast.
 */
export function showingReigncraftToastSuccess(
  message: string,
  options?: ShowingReigncraftToastOptions
): string | number {
  return toast.success(message, resolvingReigncraftToastOptions(options));
}

/**
 * Shows an error Reigncraft toast.
 */
export function showingReigncraftToastError(
  message: string,
  options?: ShowingReigncraftToastOptions
): string | number {
  return toast.error(message, resolvingReigncraftToastOptions(options));
}

/**
 * Shows a warning Reigncraft toast.
 */
export function showingReigncraftToastWarning(
  message: string,
  options?: ShowingReigncraftToastOptions
): string | number {
  return toast.warning(message, resolvingReigncraftToastOptions(options));
}

/**
 * Shows an info Reigncraft toast.
 */
export function showingReigncraftToastInfo(
  message: string,
  options?: ShowingReigncraftToastOptions
): string | number {
  return toast.info(message, resolvingReigncraftToastOptions(options));
}
