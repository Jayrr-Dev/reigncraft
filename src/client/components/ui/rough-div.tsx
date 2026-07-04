import type { RoughSketchFillStyle } from '@/lib/theme/definingRoughSketchOptions';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode, Ref } from 'react';

/** Props kept for call sites until rough.js styling returns; not forwarded to the DOM. */
type RoughDivSketchProps = {
  variant?: string;
  roughnessLevel?: string;
  outlineStyle?: string;
  outlineThickness?: string;
  rounded?: string;
  showShadow?: boolean;
  fillStyle?: RoughSketchFillStyle;
  fillOpacity?: number;
  sketchColors?: unknown;
};

type RoughDivProps = HTMLAttributes<HTMLDivElement> &
  RoughDivSketchProps & {
    children?: ReactNode;
    ref?: Ref<HTMLDivElement>;
  };

/** Phase 1: plain div instead of rough.js sketch shell. */
export function RoughDiv({
  ref,
  className,
  children,
  variant: _variant,
  roughnessLevel: _roughnessLevel,
  outlineStyle: _outlineStyle,
  outlineThickness: _outlineThickness,
  rounded: _rounded,
  showShadow: _showShadow,
  fillStyle: _fillStyle,
  fillOpacity: _fillOpacity,
  sketchColors: _sketchColors,
  ...props
}: RoughDivProps) {
  return (
    <div ref={ref} className={cn('rounded-md border border-gray-300 bg-white/80', className)} {...props}>
      {children}
    </div>
  );
}
