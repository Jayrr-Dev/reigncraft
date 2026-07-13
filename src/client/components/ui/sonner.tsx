'use client';

import {
  DEFINING_REIGNCRAFT_TOAST_DURATION_MS,
  DEFINING_REIGNCRAFT_TOAST_GAP_PX,
  DEFINING_REIGNCRAFT_TOAST_STYLE,
  DEFINING_REIGNCRAFT_TOAST_VISIBLE_COUNT,
  DEFINING_REIGNCRAFT_TOAST_WIDTH_PX,
  DEFINING_REIGNCRAFT_TOASTER_ID,
  type DefiningReigncraftToasterId,
} from '@/components/ui/domains/definingReigncraftToastConstants';
import { cn } from '@/lib/utils';
import type { CSSProperties, JSX } from 'react';
import { Toaster as SonnerToaster, type ToasterProps } from 'sonner';

export type RenderingReigncraftToasterProps = Omit<
  ToasterProps,
  | 'id'
  | 'toastOptions'
  | 'theme'
  | 'position'
  | 'duration'
  | 'gap'
  | 'visibleToasts'
> & {
  readonly toasterId: DefiningReigncraftToasterId;
  readonly position?: ToasterProps['position'];
  readonly className?: string;
  /** When true, use compact gameplay chrome instead of parchment cards. */
  readonly variant?: 'parchment' | 'gameplay';
  /**
   * Toast column width in CSS px. Plaza passes the action-bar toast width.
   */
  readonly toastWidthPx?: number;
};

/**
 * shadcn-style Sonner host with Reigncraft chrome.
 *
 * @see https://ui.shadcn.com/docs/components/base/sonner
 */
export function RenderingReigncraftToaster({
  toasterId,
  position = 'bottom-left',
  className,
  variant = 'parchment',
  toastWidthPx = DEFINING_REIGNCRAFT_TOAST_WIDTH_PX,
  ...props
}: RenderingReigncraftToasterProps): JSX.Element {
  const isGameplay = variant === 'gameplay';
  const resolvedWidthPx = Math.max(1, Math.round(toastWidthPx));

  return (
    <SonnerToaster
      id={toasterId}
      theme="light"
      position={position}
      duration={DEFINING_REIGNCRAFT_TOAST_DURATION_MS}
      gap={DEFINING_REIGNCRAFT_TOAST_GAP_PX}
      visibleToasts={DEFINING_REIGNCRAFT_TOAST_VISIBLE_COUNT}
      expand
      className={cn(
        toasterId === DEFINING_REIGNCRAFT_TOASTER_ID.plaza
          ? DEFINING_REIGNCRAFT_TOAST_STYLE.plazaToasterClassName
          : DEFINING_REIGNCRAFT_TOAST_STYLE.globalToasterClassName,
        className
      )}
      style={
        {
          // Plaza: action-bar toast column width. Global: same default.
          '--width': `${resolvedWidthPx}px`,
          width: `${resolvedWidthPx}px`,
          minWidth: `${resolvedWidthPx}px`,
          maxWidth: `${resolvedWidthPx}px`,
        } as CSSProperties
      }
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: isGameplay
            ? DEFINING_REIGNCRAFT_TOAST_STYLE.gameplayToastClassName
            : DEFINING_REIGNCRAFT_TOAST_STYLE.toastClassName,
          title: isGameplay
            ? DEFINING_REIGNCRAFT_TOAST_STYLE.gameplayTitleClassName
            : DEFINING_REIGNCRAFT_TOAST_STYLE.titleClassName,
          description: DEFINING_REIGNCRAFT_TOAST_STYLE.descriptionClassName,
          success: DEFINING_REIGNCRAFT_TOAST_STYLE.successClassName,
          error: DEFINING_REIGNCRAFT_TOAST_STYLE.errorClassName,
          warning: DEFINING_REIGNCRAFT_TOAST_STYLE.warningClassName,
          info: DEFINING_REIGNCRAFT_TOAST_STYLE.infoClassName,
          icon: DEFINING_REIGNCRAFT_TOAST_STYLE.iconClassName,
          content: 'min-w-0 flex-1',
        },
      }}
      {...props}
    />
  );
}
