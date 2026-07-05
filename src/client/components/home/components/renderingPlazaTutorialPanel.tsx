'use client';

import { RenderingPlazaHowToPlayPanel } from '@/components/home/components/renderingPlazaHowToPlayPanel';

export type RenderingPlazaTutorialPanelProps = {
  onBack: () => void;
};

/**
 * Home-screen wrapper around the reusable how-to-play panel.
 */
export function RenderingPlazaTutorialPanel({
  onBack,
}: RenderingPlazaTutorialPanelProps): React.JSX.Element {
  return <RenderingPlazaHowToPlayPanel onBack={onBack} />;
}
