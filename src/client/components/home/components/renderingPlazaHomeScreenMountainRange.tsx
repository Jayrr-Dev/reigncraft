import plazaHomeScreenMountainSceneSvg from '@/components/home/assets/plazaHomeScreenMountainScene.svg?raw';

/**
 * Static layered mountain vista adapted from CodePen jimthornton/YXrNdr.
 */
export function RenderingPlazaHomeScreenMountainRange(): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="plaza-mountain-scene pointer-events-none absolute inset-x-0 bottom-0"
      dangerouslySetInnerHTML={{ __html: plazaHomeScreenMountainSceneSvg }}
    />
  );
}
