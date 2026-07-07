"use client";

import {
  LABELING_WORLD_PLAZA_SIGN_IN_GATE_BODY,
  LABELING_WORLD_PLAZA_SIGN_IN_GATE_TITLE,
  ROUTING_WORLD_PLAZA_PAGE_HREF,
} from "@/components/world/domains/definingWorldPlazaPromoAnnouncementConstants";

/** Sign-in CTA route for registered users. */
const RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_LOGIN_HREF =
  "/auth/login" as const;

/** Sign-up CTA route for new registered accounts. */
const RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_SIGN_UP_HREF =
  "/auth/sign-up" as const;

const RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_PRIMARY_LINK_CLASS_NAME =
  "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90" as const;

const RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_SECONDARY_LINK_CLASS_NAME =
  "inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted" as const;

const RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_INLINE_LINK_CLASS_NAME =
  "font-medium text-foreground underline-offset-4 hover:underline" as const;

/**
 * Prompts signed-out users to log in before joining the online plaza.
 */
export function RenderingWorldPlazaOnlineSignInGate(): React.JSX.Element {
  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-xl border border-border bg-muted/30 px-6 py-8 text-center">
      <h2 className="text-lg font-semibold tracking-tight">
        {LABELING_WORLD_PLAZA_SIGN_IN_GATE_TITLE}
      </h2>
      <p className="text-sm text-muted-foreground">
        {LABELING_WORLD_PLAZA_SIGN_IN_GATE_BODY}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_LOGIN_HREF}
          className={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_PRIMARY_LINK_CLASS_NAME}
        >
          Sign in
        </a>
        <a
          href={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_SIGN_UP_HREF}
          className={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_SECONDARY_LINK_CLASS_NAME}
        >
          Create account
        </a>
      </div>
      <p className="text-xs text-muted-foreground">
        Already registered?{" "}
        <a
          href={ROUTING_WORLD_PLAZA_PAGE_HREF}
          className={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_INLINE_LINK_CLASS_NAME}
        >
          Return to World plaza
        </a>
      </p>
    </div>
  );
}
