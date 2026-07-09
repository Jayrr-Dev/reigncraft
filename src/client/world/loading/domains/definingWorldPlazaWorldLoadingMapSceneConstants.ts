/**
 * Declarative layout for the parchment-map world loading screen.
 *
 * All coordinates live in the map SVG viewBox space and are consumed by
 * `renderingWorldPlazaWorldLoadingScreen.tsx`.
 *
 * @module components/world/loading/domains/definingWorldPlazaWorldLoadingMapSceneConstants
 */

/** SVG viewBox for the full-screen map scene (scaled with `slice`). */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_VIEWBOX = {
  width: 1000,
  height: 700,
} as const;

/** Ink and accent colors pulled from the poster palette in index.css. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COLORS = {
  ink: '#2e2a22',
  inkSoft: '#55503f',
  trail: '#a2481f',
  gold: '#d9a441',
  teal: '#2c4a52',
} as const;

/**
 * Expedition trail the loading marker travels along, from the map edge to
 * the X that marks the plaza. Drawn dashed; revealed with progress.
 */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_TRAIL_PATH =
  'M 110 610 C 240 570 220 440 360 430 C 470 422 520 500 610 460 C 720 412 660 300 730 240 C 780 197 830 190 862 152';

/** Where the trail ends; the "X marks the spot" destination. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_DESTINATION = {
  x: 862,
  y: 152,
} as const;

/** Faint topographic contour lines scattered across the parchment. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_CONTOUR_PATHS: readonly string[] =
  [
    'M -20 180 C 120 140 260 220 380 170 C 500 120 620 190 760 150 C 860 122 960 160 1030 130',
    'M -20 250 C 140 210 250 290 400 240 C 540 194 640 260 790 220 C 890 194 980 230 1030 205',
    'M -20 500 C 130 470 240 540 390 505 C 530 472 650 545 800 505 C 900 478 980 520 1030 495',
    'M -20 580 C 150 545 270 615 420 580 C 560 548 680 620 830 580 C 930 553 990 595 1030 572',
  ];

/** Kinds of hand-inked landmark glyphs available on the map. */
export type DefiningWorldPlazaWorldLoadingMapGlyphKind =
  | 'mountain'
  | 'pine'
  | 'waves';

/** Stroked path data for each glyph kind, drawn around a local origin. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_GLYPH_PATHS: Record<
  DefiningWorldPlazaWorldLoadingMapGlyphKind,
  string
> = {
  mountain: 'M 0 26 L 13 2 L 21 16 L 27 6 L 40 26 M 9 10 L 13 15 L 17 10',
  pine: 'M 9 0 L 17 13 L 12 13 L 19 24 L -1 24 L 6 13 L 1 13 Z M 9 24 L 9 30',
  waves:
    'M 0 4 Q 6 -2 12 4 T 24 4 M 4 12 Q 10 6 16 12 T 28 12 M 0 20 Q 6 14 12 20 T 24 20',
};

/** One landmark placed on the map: a glyph cluster plus an optional label. */
export type DefiningWorldPlazaWorldLoadingMapLandmark = {
  readonly kind: DefiningWorldPlazaWorldLoadingMapGlyphKind;
  /** Glyph positions in viewBox coordinates (top-left of the glyph). */
  readonly glyphPositions: readonly { x: number; y: number }[];
  readonly label?: {
    readonly text: string;
    readonly x: number;
    readonly y: number;
  };
};

/** All landmarks decorating the parchment. */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_LANDMARKS: readonly DefiningWorldPlazaWorldLoadingMapLandmark[] =
  [
    {
      kind: 'mountain',
      glyphPositions: [
        { x: 250, y: 120 },
        { x: 300, y: 100 },
        { x: 350, y: 130 },
      ],
      label: { text: 'The Highlands', x: 320, y: 180 },
    },
    {
      kind: 'mountain',
      glyphPositions: [
        { x: 660, y: 560 },
        { x: 710, y: 545 },
      ],
      label: { text: 'Emberpeaks', x: 705, y: 615 },
    },
    {
      kind: 'pine',
      glyphPositions: [
        { x: 130, y: 330 },
        { x: 165, y: 350 },
        { x: 110, y: 375 },
        { x: 155, y: 395 },
      ],
      label: { text: 'Wolfwood', x: 155, y: 445 },
    },
    {
      kind: 'pine',
      glyphPositions: [
        { x: 830, y: 400 },
        { x: 870, y: 420 },
        { x: 895, y: 380 },
      ],
    },
    {
      kind: 'waves',
      glyphPositions: [
        { x: 545, y: 110 },
        { x: 585, y: 125 },
      ],
      label: { text: 'Mirror Lake', x: 585, y: 175 },
    },
  ];

/**
 * Compass rose geometry in its own local viewBox. The compass renders as a
 * separate corner-anchored SVG so the sliced map scaling never clips it.
 */
export const DEFINING_WORLD_PLAZA_WORLD_LOADING_MAP_COMPASS = {
  viewBoxSize: 120,
  centerX: 60,
  centerY: 68,
  radius: 42,
} as const;
