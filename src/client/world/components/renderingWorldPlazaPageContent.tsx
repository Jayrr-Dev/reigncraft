"use client";

import { useAuthUser, useUserData } from "@/components/hooks/useAuth";

import { RenderingWorldPlazaOnlineSignInGate } from "@/components/world/components/renderingWorldPlazaOnlineSignInGate";
import { computingWorldPlazaEmbeddedHostSizeStyle } from "@/components/world/domains/computingWorldPlazaEmbeddedHostSizeStyle";

import { resolvingWorldPlazaOnlineRoomDisplayName } from "@/components/world/domains/resolvingWorldPlazaOnlineRoomDisplayName";
import { DEFINING_WORLD_PLAZA_USER_NAME_LABEL_PROFILE_QUERY_KEY } from "@/components/world/domains/definingWorldPlazaUserNameLabelProfileConstants";
import { fetchingWorldPlazaUserNameLabelProfile } from "@/components/world/domains/fetchingWorldPlazaUserNameLabelProfile";

import { resolvingWorldPlazaOnlineRoomIndexFromSearchParams } from "@/components/world/domains/resolvingWorldPlazaOnlineRoomIndexFromSearchParams";
import {
  DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_KEY_ROOT,
  DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_STALE_TIME_MS,
} from "@/components/world/domains/definingWorldPlazaLastPositionConstants";
import { fetchingWorldPlazaLastPositionFromSupabase } from "@/components/world/repositories/fetchingWorldPlazaLastPositionFromSupabase";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const RenderingWorldPlazaPixiScene = dynamic(
  () =>
    import("@/components/world/components/renderingWorldPlazaPixiScene").then(
      (module) => module.RenderingWorldPlazaPixiScene,
    ),

  {
    ssr: false,

    loading: () => (
      <div
        className="flex items-center justify-center rounded-xl border border-border bg-muted/30"
        style={{ ...computingWorldPlazaEmbeddedHostSizeStyle(), minHeight: 240 }}
      >
        <p className="text-sm text-muted-foreground">Loading plaza...</p>
      </div>
    ),
  },
);

/** Page shell: compact chrome so the plaza host can grow on desktop. */
const RENDERING_WORLD_PLAZA_PAGE_ROOT_CLASS_NAME =
  "flex w-full flex-1 flex-col items-center gap-2 px-2 py-2 md:gap-3 md:px-4 md:py-3" as const;

/** Page title above the plaza host. */
const RENDERING_WORLD_PLAZA_PAGE_TITLE_CLASS_NAME =
  "text-xl font-bold tracking-tight md:text-2xl" as const;

/** Centers the plaza host horizontally within the page. */
const RENDERING_WORLD_PLAZA_PAGE_GAME_SLOT_CLASS_NAME =
  "flex w-full justify-center" as const;

/** Shared loading / session placeholder chrome. */
const RENDERING_WORLD_PLAZA_PAGE_PLACEHOLDER_CLASS_NAME =
  "flex items-center justify-center rounded-xl border border-border bg-muted/30" as const;

/**
 * Client entry for the `/world` online plaza page.

 */

export function RenderingWorldPlazaPageContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const preferredRoomIndex =
    resolvingWorldPlazaOnlineRoomIndexFromSearchParams(searchParams);
  const { data: authUser, isLoading: isAuthLoading } = useAuthUser();

  const { data: userData } = useUserData();

  const onlineDisplayName = resolvingWorldPlazaOnlineRoomDisplayName(
    userData?.username,

    userData?.alias,

    userData?.email,
  );

  const { data: onlineNameLabelProfile = null } = useQuery({
    queryKey: DEFINING_WORLD_PLAZA_USER_NAME_LABEL_PROFILE_QUERY_KEY,
    queryFn: fetchingWorldPlazaUserNameLabelProfile,
    enabled: authUser !== null && authUser !== undefined,
    staleTime: 5 * 60 * 1000,
  });

  useQuery({
    queryKey: [DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_KEY_ROOT, authUser?.id],
    queryFn: () => fetchingWorldPlazaLastPositionFromSupabase(authUser!.id),
    enabled: authUser !== null && authUser !== undefined,
    staleTime: DEFINING_WORLD_PLAZA_LAST_POSITION_QUERY_STALE_TIME_MS,
  });

  return (
    <div className={RENDERING_WORLD_PLAZA_PAGE_ROOT_CLASS_NAME}>
      <h1 className={RENDERING_WORLD_PLAZA_PAGE_TITLE_CLASS_NAME}>World Plaza</h1>

      <div className={RENDERING_WORLD_PLAZA_PAGE_GAME_SLOT_CLASS_NAME}>
        {isAuthLoading ? (
          <div
            className={RENDERING_WORLD_PLAZA_PAGE_PLACEHOLDER_CLASS_NAME}
            style={{
              ...computingWorldPlazaEmbeddedHostSizeStyle(),
              minHeight: 240,
            }}
          >
            <p className="text-sm text-muted-foreground">Checking session...</p>
          </div>
        ) : authUser ? (
          <RenderingWorldPlazaPixiScene
            onlineUserId={authUser.id}
            onlineDisplayName={onlineDisplayName}
            onlineProfileStatusKind={
              onlineNameLabelProfile?.profileStatusKind ?? null
            }
            onlineAvatarUrl={onlineNameLabelProfile?.avatarUrl ?? null}
            preferredRoomIndex={preferredRoomIndex}
          />
        ) : (
          <RenderingWorldPlazaOnlineSignInGate />
        )}
      </div>
    </div>
  );
}
