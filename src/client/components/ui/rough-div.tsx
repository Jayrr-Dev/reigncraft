import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RoughDivProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

/** Phase 1: plain div instead of rough.js sketch shell. */
export function RoughDiv({ className, children, ...props }: RoughDivProps) {
  return (
    <div className={cn('rounded-md border border-gray-300 bg-white/80', className)} {...props}>
      {children}
    </div>
  );
}
