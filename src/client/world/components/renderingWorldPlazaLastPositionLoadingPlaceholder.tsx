import { computingWorldPlazaEmbeddedHostSizeStyle } from "@/components/world/domains/computingWorldPlazaEmbeddedHostSizeStyle";

/** Placeholder chrome shown while the saved plaza position loads. */
const RENDERING_WORLD_PLAZA_LAST_POSITION_LOADING_PLACEHOLDER_CLASS_NAME =
  "flex items-center justify-center rounded-xl border border-border bg-muted/30" as const;

/** Accessible loading copy for resume-on-login. */
const RENDERING_WORLD_PLAZA_LAST_POSITION_LOADING_MESSAGE =
  "Finding your last spot..." as const;

/**
 * Blocks the plaza canvas until the authenticated user's saved position is ready.
 */
export function RenderingWorldPlazaLastPositionLoadingPlaceholder(): React.JSX.Element {
  return (
    <div
      className={RENDERING_WORLD_PLAZA_LAST_POSITION_LOADING_PLACEHOLDER_CLASS_NAME}
      style={{ ...computingWorldPlazaEmbeddedHostSizeStyle(), minHeight: 240 }}
      aria-busy="true"
      aria-live="polite"
    >
      <p className="text-sm text-muted-foreground">
        {RENDERING_WORLD_PLAZA_LAST_POSITION_LOADING_MESSAGE}
      </p>
    </div>
  );
}
