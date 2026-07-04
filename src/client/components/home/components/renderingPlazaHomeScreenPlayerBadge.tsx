import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { resolvingWorldPlazaPlayerNameLabelAvatarInitial } from '@/components/world/domains/resolvingWorldPlazaPlayerNameLabelAvatarInitial';
import { useState } from 'react';

export type RenderingPlazaHomeScreenPlayerBadgeProps = {
  avatarUrl: string | null;
  username: string;
  welcomeBack?: boolean;
};

export function RenderingPlazaHomeScreenPlayerBadge({
  avatarUrl,
  username,
  welcomeBack = false,
}: RenderingPlazaHomeScreenPlayerBadgeProps): React.JSX.Element {
  const [hasImageError, setHasImageError] = useState(false);
  const showsImage = Boolean(avatarUrl) && !hasImageError;
  const avatarInitial =
    resolvingWorldPlazaPlayerNameLabelAvatarInitial(username);
  const label = welcomeBack ? `Welcome back, ${username}` : username;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-poster-gold/60 bg-ink/40 py-1 pl-1 pr-3 font-body text-sm font-bold text-parchment [text-shadow:0_1px_1px_rgba(0,0,0,0.4)]">
      <Avatar className="size-6 ring-1 ring-poster-gold/70">
        {showsImage ? (
          <AvatarImage
            src={avatarUrl ?? undefined}
            alt=""
            aria-hidden
            onError={() => {
              setHasImageError(true);
            }}
          />
        ) : null}
        <AvatarFallback className="bg-poster-teal text-[10px] font-semibold uppercase text-parchment">
          {avatarInitial}
        </AvatarFallback>
      </Avatar>
      {label}
    </span>
  );
}
