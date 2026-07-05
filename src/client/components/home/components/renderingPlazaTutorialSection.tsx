'use client';

import { Icon } from '@/components/ui/icon';

export type RenderingPlazaTutorialSectionProps = {
  title: string;
  description: string;
  icon: string;
  delayMs?: number;
  children: React.ReactNode;
};

/**
 * One titled tutorial card with icon, copy, and a live visual demo slot.
 */
export function RenderingPlazaTutorialSection({
  title,
  description,
  icon,
  delayMs = 0,
  children,
}: RenderingPlazaTutorialSectionProps): React.JSX.Element {
  return (
    <section
      className="plaza-pop-in flex flex-col gap-3 rounded-md border border-poster-teal/20 bg-parchment/35 p-4"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-poster-gold/40 bg-poster-teal/10 text-poster-teal-deep">
          <Icon icon={icon} className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold tracking-wide text-ink">
            {title}
          </h3>
          <p className="mt-0.5 text-sm font-medium leading-snug text-ink-soft">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
