/**
 * Static layered mountain vista adapted from CodePen jimthornton/YXrNdr.
 *
 * Imported as a Vite asset URL so the ~590 KB scene stays out of the JS
 * string bundle but still uploads with playtest rebuilds (unlike /home/*
 * public paths when copyPublicDir is skipped).
 */
import plazaHomeScreenMountainSceneUrl from '../../../assets/home/plazaHomeScreenMountainScene.svg?url';

export function RenderingPlazaHomeScreenMountainRange(): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="plaza-mountain-scene pointer-events-none absolute inset-x-0 bottom-0"
    >
      <img
        src={plazaHomeScreenMountainSceneUrl}
        alt=""
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </div>
  );
}
