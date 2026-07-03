import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn('aspect-square h-full w-full', className)} {...props} />;
}

export function AvatarFallback({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-xs',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
