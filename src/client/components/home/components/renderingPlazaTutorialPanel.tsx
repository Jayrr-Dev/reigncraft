'use client';

import { RenderingPlazaHowToPlayPanel } from '@/components/home/components/renderingPlazaHowToPlayPanel';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import { useEffect } from 'react';

export type RenderingPlazaTutorialPanelProps = {
  onBack: () => void;
};

/**
 * Home-screen wrapper around the reusable how-to-play panel.
 */
export function RenderingPlazaTutorialPanel({
  onBack,
}: RenderingPlazaTutorialPanelProps): React.JSX.Element {
  useEffect(() => {
    playingPlazaBookSfx({ actionId: 'open' });

    return () => {
      playingPlazaBookSfx({ actionId: 'close' });
    };
  }, []);

  return <RenderingPlazaHowToPlayPanel onBack={onBack} />;
}
