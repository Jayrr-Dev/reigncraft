"use client";

import { COMMUNITY_PAGE_USERS_CARD_SKELETON_HEIGHT_CLASS } from "@/components/community/domains/definingCommunityMemberProfile";
import { resolvingCommunityMemberProfileCardDisplay } from "@/components/community/domains/resolvingCommunityMemberProfileCardDisplay";
import { resolvingCommunityMemberProfilePagePath } from "@/components/community/domains/resolvingCommunityMemberProfilePagePath";
import { RenderingUserProfileCard } from "@/components/dashboard/profile/renderingUserProfileCard";
import { computingWorldPlazaPlayerProfileModalScaledCardLayout } from "@/components/world/domains/computingWorldPlazaPlayerProfileModalScaledCardLayout";
import { computingWorldPlazaPlayerProfilePopoverScaledCardLayout } from "@/components/world/domains/computingWorldPlazaPlayerProfilePopoverScaledCardLayout";
import { usingWorldPlazaPlayerProfileByUserId } from "@/components/world/hooks/usingWorldPlazaPlayerProfileByUserId";
import { useMemo } from "react";

/** Layout preset for the plaza profile card shell. */
export type RenderingWorldPlazaPlayerProfileCardLayoutVariant = "popover" | "modal";

export interface RenderingWorldPlazaPlayerProfilePopoverCardProps {
  /** Remote player auth user id. */
  userId: string;
  /** True while the parent popover or modal is open. */
  isOpen: boolean;
  /** Popover uses a compact scale; modal uses the full card size. */
  layoutVariant?: RenderingWorldPlazaPlayerProfileCardLayoutVariant;
}

/** Skeleton shown while the profile card loads. */
const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SKELETON_CLASS_NAME =
  `w-full animate-pulse rounded-xl bg-muted/80 ${COMMUNITY_PAGE_USERS_CARD_SKELETON_HEIGHT_CLASS}`;

const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_SCALED_CARD_LAYOUT =
  computingWorldPlazaPlayerProfilePopoverScaledCardLayout();

const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_SCALED_CARD_LAYOUT =
  computingWorldPlazaPlayerProfileModalScaledCardLayout();

/** Overrides community card min-width so the popover scale can shrink it. */
const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_CLASS_NAME =
  "!min-w-0 !max-w-none" as const;

/** Modal card fills the fixed-width shell without side gaps. */
const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CARD_CLASS_NAME =
  "!min-w-0 !max-w-none w-full" as const;

/**
 * Profile card body for a remote plaza player's popover.
 */
export function RenderingWorldPlazaPlayerProfilePopoverCard({
  userId,
  isOpen,
  layoutVariant = "popover",
}: RenderingWorldPlazaPlayerProfilePopoverCardProps): React.JSX.Element {
  const scaledCardLayout =
    layoutVariant === "modal"
      ? RENDERING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_SCALED_CARD_LAYOUT
      : RENDERING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_SCALED_CARD_LAYOUT;

  const { data: profile, isLoading, isError } = usingWorldPlazaPlayerProfileByUserId(
    userId,
    isOpen,
  );

  const cardDisplay = useMemo(() => {
    if (!profile) {
      return null;
    }

    return resolvingCommunityMemberProfileCardDisplay(profile);
  }, [profile]);

  if (isLoading) {
    return (
      <div style={scaledCardLayout.shell}>
        <div style={scaledCardLayout.scaledContent}>
          <div
            className={RENDERING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_SKELETON_CLASS_NAME}
            aria-busy="true"
            aria-label="Loading profile"
          />
        </div>
      </div>
    );
  }

  if (isError || !profile || !cardDisplay) {
    return (
      <p className="px-1 py-2 text-center text-sm text-muted-foreground">
        Could not load this profile.
      </p>
    );
  }

  return (
    <div style={scaledCardLayout.shell}>
      <div style={scaledCardLayout.scaledContent}>
        <RenderingUserProfileCard
          className={
            layoutVariant === "modal"
              ? RENDERING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CARD_CLASS_NAME
              : RENDERING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_CARD_CLASS_NAME
          }
          name={cardDisplay.displayName}
          description="No description provided"
          credentials={[]}
          tags={[]}
          imageUrl={null}
          imageAlt={`${cardDisplay.displayName} profile`}
          bannerUrl={null}
          userId={profile.userId}
          profilePagePath={resolvingCommunityMemberProfilePagePath(profile.userId)}
          opensProfilePageInNewWindow={layoutVariant === "modal"}
          isMasonryLayout
        />
      </div>
    </div>
  );
}
