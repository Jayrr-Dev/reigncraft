/**
 * Declarative registry of world boot loading steps.
 *
 * Each step lazy-imports its own modules so Pixi and the sprite loaders stay
 * out of the initial game bundle. Steps run sequentially in registry order;
 * the first step configures Pixi asset resolution and must stay first.
 *
 * @module components/world/loading/domains/definingWorldPlazaWorldLoadingStepRegistry
 */

/** Reports intra-step completion as a 0..1 ratio. */
export type DefiningWorldPlazaWorldLoadingProgressReporter = (
  completedRatio: number
) => void;

/** One sequential world boot loading step. */
export type DefiningWorldPlazaWorldLoadingStep = {
  readonly stepId: string;
  /** Relative share of the overall progress bar. */
  readonly weight: number;
  readonly load: (
    reportProgress: DefiningWorldPlazaWorldLoadingProgressReporter
  ) => Promise<void>;
};

/** Ordered world boot steps consumed by the loading store. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_STEP_REGISTRY: readonly DefiningWorldPlazaWorldLoadingStep[] =
  [
    {
      stepId: 'game-code',
      weight: 2,
      load: async () => {
        const [{ configuringWorldPlazaPixiAssetsForDevvit }] =
          await Promise.all([
            import('@/components/world/domains/configuringWorldPlazaPixiAssetsForDevvit'),
          ]);

        configuringWorldPlazaPixiAssetsForDevvit();

        await import('@/components/world/components/renderingWorldPlazaPixiScene');
      },
    },
    {
      stepId: 'terrain-textures',
      weight: 2,
      load: async () => {
        const { preloadingWorldPlazaTerrainTextureAssetManifest } =
          await import('@/components/world/engine/registeringWorldPlazaTextureAssetManifest');

        await preloadingWorldPlazaTerrainTextureAssetManifest();
      },
    },
    {
      stepId: 'avatar-sprites',
      weight: 3,
      load: async (reportProgress) => {
        // Boot warms only the selected skin's core locomotion strips.
        // Other skins and GirlSample combat strips load lazily on first need.
        const { preloadingWorldPlazaBootAvatarTextures } =
          await import('@/components/world/domains/preloadingWorldPlazaBootAvatarTextures');

        await preloadingWorldPlazaBootAvatarTextures(reportProgress);
      },
    },
    {
      stepId: 'wildlife-sprites',
      weight: 3,
      load: async (reportProgress) => {
        // Boot warms only the spawn-biome roster with bounded concurrency;
        // preloading all ~50 species in parallel OOM-kills mobile tabs.
        // Remaining species lazy-load on first sighting.
        const { preloadingWildlifeBootSpeciesTextures } =
          await import('@/components/world/wildlife/domains/preloadingWildlifeBootSpeciesTextures');

        await preloadingWildlifeBootSpeciesTextures(reportProgress);
      },
    },
    {
      stepId: 'fire-sprites',
      weight: 1,
      load: async () => {
        const { preloadingWorldPlazaFireSpriteTextures } =
          await import('@/components/world/fire/domains/loadingWorldPlazaFireSpriteTextures');

        await preloadingWorldPlazaFireSpriteTextures();
      },
    },
    {
      stepId: 'audio',
      weight: 3,
      load: async (reportProgress) => {
        // Blocks the loading bar through spawn-biome music first, then
        // footsteps, ambience, avatar feedback, and boot-biome wildlife vocals.
        const { preloadingWorldPlazaWorldBootStarAudio } =
          await import('@/components/world/domains/preloadingWorldPlazaWorldBootStarAudio');

        await preloadingWorldPlazaWorldBootStarAudio(reportProgress);
      },
    },
  ];
