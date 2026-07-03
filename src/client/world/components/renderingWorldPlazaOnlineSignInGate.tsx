"use client";

import Link from "next/link";
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
        <Link
          href={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_LOGIN_HREF}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Sign in
        </Link>
        <Link
          href={RENDERING_WORLD_PLAZA_ONLINE_SIGN_IN_GATE_SIGN_UP_HREF}
          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Create account
        </Link>
      </div>
      <p className="text-xs text-muted-foreground">
        Already registered?{" "}
        <Link
          href={ROUTING_WORLD_PLAZA_PAGE_HREF}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Return to World plaza
        </Link>
      </p>
    </div>
  );
}
