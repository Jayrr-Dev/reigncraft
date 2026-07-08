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
        const { DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_DEFINITIONS } =
          await import('@/components/world/domains/definingWorldPlazaAvatarCharacterDefinition');
        const characterDefinitions = Object.values(
          DEFINING_WORLD_PLAZA_AVATAR_CHARACTER_DEFINITIONS
        );
        let loadedCount = 0;

        await Promise.all(
          characterDefinitions.map(async (characterDefinition) => {
            await characterDefinition.loadTextures();
            loadedCount += 1;
            reportProgress(loadedCount / characterDefinitions.length);
          })
        );
      },
    },
    {
      stepId: 'wildlife-sprites',
      weight: 3,
      load: async (reportProgress) => {
        const [
          { listingWildlifeSpeciesIds, resolvingWildlifeSpeciesDefinition },
          { loadingWildlifeSpeciesTextures },
        ] = await Promise.all([
          import('@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry'),
          import('@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures'),
        ]);
        const speciesIds = listingWildlifeSpeciesIds();
        let loadedCount = 0;

        await Promise.all(
          speciesIds.map(async (speciesId) => {
            const speciesDefinition =
              resolvingWildlifeSpeciesDefinition(speciesId);

            if (speciesDefinition) {
              await loadingWildlifeSpeciesTextures(speciesDefinition);
            }

            loadedCount += 1;
            reportProgress(loadedCount / speciesIds.length);
          })
        );
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
  ];
