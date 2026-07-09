/**
 * Static layered mountain vista adapted from CodePen jimthornton/YXrNdr.
 *
 * Served as a public SVG URL so the ~590 KB scene stays out of the JS bundle.
 */
export function RenderingPlazaHomeScreenMountainRange(): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="plaza-mountain-scene pointer-events-none absolute inset-x-0 bottom-0"
    >
      <img
        src="/home/plazaHomeScreenMountainScene.svg"
        alt=""
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </div>
  );
}
