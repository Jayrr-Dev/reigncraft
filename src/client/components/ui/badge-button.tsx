import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export function BadgeButton({ className, children, ...props }: BadgeButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs font-medium',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
