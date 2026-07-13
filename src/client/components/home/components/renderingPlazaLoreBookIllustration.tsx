'use client';

/**
 * Parchment-ink SVG scenes for lore book pages.
 *
 * @module components/home/components/renderingPlazaLoreBookIllustration
 */

import type { PlazaLoreBookIllustrationId } from '@/components/home/domains/definingPlazaLoreBookIllustrationConstants';

const LORE_BOOK_ILLUSTRATION_INK = '#3d2a1f';
const LORE_BOOK_ILLUSTRATION_INK_SOFT = '#5c4033';
const LORE_BOOK_ILLUSTRATION_GOLD = '#9a7b3c';
const LORE_BOOK_ILLUSTRATION_CRIMSON = '#7d2c1c';
const LORE_BOOK_ILLUSTRATION_TEAL = '#2c4a52';
const LORE_BOOK_ILLUSTRATION_PURPLE = '#5b3d6e';

type RenderingPlazaLoreBookIllustrationSceneProps = {
  illustrationId: PlazaLoreBookIllustrationId;
};

function RenderingCorpusBandsScene(): React.JSX.Element {
  return (
    <>
      <ellipse
        cx="100"
        cy="58"
        rx="72"
        ry="42"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2"
      />
      <ellipse
        cx="100"
        cy="58"
        rx="48"
        ry="28"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <circle
        cx="100"
        cy="58"
        r="8"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="1.5"
      />
      <path
        d="M28 58 Q100 18 172 58"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.25"
        opacity="0.7"
      />
      <text
        x="100"
        y="108"
        textAnchor="middle"
        fill={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        fontSize="9"
        fontFamily="serif"
      >
        spawn
      </text>
    </>
  );
}

function RenderingBiomeRingsScene(): React.JSX.Element {
  const rings = [
    { r: 14, label: 'plains' },
    { r: 26, label: 'forest' },
    { r: 38, label: 'savanna' },
    { r: 50, label: 'desert' },
    { r: 62, label: 'rim' },
  ] as const;

  return (
    <>
      {rings.map((ring, index) => (
        <circle
          key={ring.label}
          cx="100"
          cy="56"
          r={ring.r}
          fill="none"
          stroke={
            index === rings.length - 1
              ? LORE_BOOK_ILLUSTRATION_CRIMSON
              : LORE_BOOK_ILLUSTRATION_INK
          }
          strokeWidth={index === 0 ? 2 : 1.25}
          opacity={0.55 + index * 0.08}
        />
      ))}
      <circle cx="100" cy="56" r="3.5" fill={LORE_BOOK_ILLUSTRATION_GOLD} />
      <path
        d="M100 56 L148 28"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.25"
        strokeDasharray="3 2"
      />
      <text
        x="156"
        y="26"
        fill={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        fontSize="8"
        fontFamily="serif"
      >
        Firelands
      </text>
    </>
  );
}

function RenderingQuietHandScene(): React.JSX.Element {
  return (
    <>
      <path
        d="M70 88 C68 70 78 52 100 48 C122 52 132 70 130 88"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M78 72 C86 58 96 52 100 50 C104 52 114 58 122 72"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_GOLD}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="100"
        cy="36"
        r="10"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.5"
      />
      <path
        d="M100 28 V44 M92 36 H108"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.25"
      />
      <circle
        cx="58"
        cy="40"
        r="2"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.7"
      />
      <circle
        cx="146"
        cy="34"
        r="1.5"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.6"
      />
      <circle
        cx="160"
        cy="58"
        r="2"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.5"
      />
    </>
  );
}

function RenderingLadderRungsScene(): React.JSX.Element {
  const rungs = [28, 44, 60, 76, 92] as const;

  return (
    <>
      <line
        x1="72"
        y1="20"
        x2="72"
        y2="100"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="128"
        y1="20"
        x2="128"
        y2="100"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {rungs.map((y, index) => (
        <line
          key={y}
          x1="72"
          y1={y}
          x2="128"
          y2={y}
          stroke={
            index === rungs.length - 1
              ? LORE_BOOK_ILLUSTRATION_GOLD
              : LORE_BOOK_ILLUSTRATION_INK_SOFT
          }
          strokeWidth={index === rungs.length - 1 ? 2.5 : 1.75}
        />
      ))}
      <circle
        cx="100"
        cy="92"
        r="5"
        fill={LORE_BOOK_ILLUSTRATION_TEAL}
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="1"
      />
      <path
        d="M100 84 L100 52"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.25"
        strokeDasharray="2 2"
        markerEnd="url(#lore-arrow)"
      />
      <defs>
        <marker
          id="lore-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill={LORE_BOOK_ILLUSTRATION_TEAL} />
        </marker>
      </defs>
    </>
  );
}

function RenderingSpritcoreOrbScene(): React.JSX.Element {
  return (
    <>
      <circle
        cx="100"
        cy="56"
        r="28"
        fill={LORE_BOOK_ILLUSTRATION_PURPLE}
        fillOpacity="0.22"
        stroke={LORE_BOOK_ILLUSTRATION_PURPLE}
        strokeWidth="2"
      />
      <circle
        cx="100"
        cy="56"
        r="16"
        fill={LORE_BOOK_ILLUSTRATION_PURPLE}
        fillOpacity="0.45"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="1.25"
      />
      <circle cx="92" cy="48" r="4" fill="rgba(255,255,255,0.45)" />
      {(
        [
          { x: 48, y: 30, label: 'coin' },
          { x: 152, y: 30, label: 'mana' },
          { x: 48, y: 86, label: 'xp' },
          { x: 152, y: 86, label: 'rank' },
        ] as const
      ).map((node) => (
        <g key={node.label}>
          <line
            x1="100"
            y1="56"
            x2={node.x}
            y2={node.y}
            stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
            strokeWidth="1"
            opacity="0.55"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r="10"
            fill="none"
            stroke={LORE_BOOK_ILLUSTRATION_GOLD}
            strokeWidth="1.25"
          />
          <text
            x={node.x}
            y={node.y + 3}
            textAnchor="middle"
            fill={LORE_BOOK_ILLUSTRATION_INK}
            fontSize="7"
            fontFamily="serif"
          >
            {node.label}
          </text>
        </g>
      ))}
    </>
  );
}

function RenderingApostleCircleScene(): React.JSX.Element {
  const apostles = Array.from({ length: 12 }, (_, index) => {
    const angle = (Math.PI * 2 * index) / 12 - Math.PI / 2;
    return {
      x: 100 + Math.cos(angle) * 38,
      y: 56 + Math.sin(angle) * 34,
    };
  });

  return (
    <>
      <circle
        cx="100"
        cy="56"
        r="12"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        fillOpacity="0.35"
        stroke={LORE_BOOK_ILLUSTRATION_GOLD}
        strokeWidth="2"
      />
      <text
        x="100"
        y="59"
        textAnchor="middle"
        fill={LORE_BOOK_ILLUSTRATION_INK}
        fontSize="8"
        fontFamily="serif"
        fontWeight="700"
      >
        M
      </text>
      {apostles.map((point, index) => (
        <g key={`apostle-${index}`}>
          <line
            x1="100"
            y1="56"
            x2={point.x}
            y2={point.y}
            stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
            strokeWidth="0.75"
            opacity="0.4"
          />
          <circle
            cx={point.x}
            cy={point.y}
            r="5"
            fill="none"
            stroke={LORE_BOOK_ILLUSTRATION_TEAL}
            strokeWidth="1.25"
          />
        </g>
      ))}
    </>
  );
}

function RenderingTwoCreedsScene(): React.JSX.Element {
  return (
    <>
      <rect
        x="28"
        y="28"
        width="58"
        height="58"
        rx="4"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_GOLD}
        strokeWidth="1.75"
      />
      <circle
        cx="57"
        cy="48"
        r="8"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.7"
      />
      <circle
        cx="48"
        cy="62"
        r="5"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.45"
      />
      <circle
        cx="66"
        cy="62"
        r="5"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.45"
      />
      <text
        x="57"
        y="98"
        textAnchor="middle"
        fill={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        fontSize="8"
        fontFamily="serif"
      >
        Worthy
      </text>
      <rect
        x="114"
        y="28"
        width="58"
        height="58"
        rx="4"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.75"
      />
      <path
        d="M130 70 Q143 42 156 70"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_CRIMSON}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        cx="143"
        cy="48"
        r="4"
        fill={LORE_BOOK_ILLUSTRATION_CRIMSON}
        opacity="0.7"
      />
      <circle cx="134" cy="74" r="3.5" fill={LORE_BOOK_ILLUSTRATION_INK_SOFT} />
      <circle cx="143" cy="76" r="3.5" fill={LORE_BOOK_ILLUSTRATION_INK_SOFT} />
      <circle cx="152" cy="74" r="3.5" fill={LORE_BOOK_ILLUSTRATION_INK_SOFT} />
      <text
        x="143"
        y="98"
        textAnchor="middle"
        fill={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        fontSize="8"
        fontFamily="serif"
      >
        Many
      </text>
    </>
  );
}

function RenderingBeastTiersScene(): React.JSX.Element {
  const tiers = [
    { y: 88, w: 36, label: 'common' },
    { y: 70, w: 48, label: 'fierce' },
    { y: 52, w: 60, label: 'elite' },
    { y: 34, w: 72, label: 'mythic' },
  ] as const;

  return (
    <>
      {tiers.map((tier, index) => (
        <g key={tier.label}>
          <rect
            x={100 - tier.w / 2}
            y={tier.y - 8}
            width={tier.w}
            height="14"
            rx="2"
            fill={
              index === tiers.length - 1
                ? LORE_BOOK_ILLUSTRATION_PURPLE
                : 'none'
            }
            fillOpacity={index === tiers.length - 1 ? 0.25 : 0}
            stroke={
              index === tiers.length - 1
                ? LORE_BOOK_ILLUSTRATION_PURPLE
                : LORE_BOOK_ILLUSTRATION_INK
            }
            strokeWidth="1.5"
          />
          <text
            x="100"
            y={tier.y + 2}
            textAnchor="middle"
            fill={LORE_BOOK_ILLUSTRATION_INK}
            fontSize="7"
            fontFamily="serif"
          >
            {tier.label}
          </text>
        </g>
      ))}
    </>
  );
}

function RenderingCuccoScene(): React.JSX.Element {
  return (
    <>
      <ellipse
        cx="100"
        cy="68"
        rx="22"
        ry="16"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2"
      />
      <circle
        cx="118"
        cy="52"
        r="12"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2"
      />
      <circle cx="122" cy="50" r="2" fill={LORE_BOOK_ILLUSTRATION_INK} />
      <path
        d="M128 54 L138 56 L128 60"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="1"
      />
      <path
        d="M108 42 L112 30 L118 40 L124 28 L128 42"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_CRIMSON}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M82 72 L70 78 M84 78 L72 88 M88 82 L78 94"
        stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M148 40 L158 32 M152 48 L164 48 M148 56 L158 64"
        stroke={LORE_BOOK_ILLUSTRATION_CRIMSON}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
    </>
  );
}

function RenderingFirelandsScene(): React.JSX.Element {
  return (
    <>
      <path
        d="M20 92 L48 48 L68 72 L92 28 L118 64 L142 40 L180 92 Z"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M92 28 L98 48 L86 48 Z"
        fill={LORE_BOOK_ILLUSTRATION_CRIMSON}
        opacity="0.75"
      />
      <path
        d="M142 40 L146 54 L136 54 Z"
        fill={LORE_BOOK_ILLUSTRATION_CRIMSON}
        opacity="0.55"
      />
      <rect
        x="58"
        y="70"
        width="18"
        height="14"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        strokeWidth="1.25"
      />
      <rect
        x="120"
        y="66"
        width="14"
        height="18"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        strokeWidth="1.25"
      />
      <circle
        cx="40"
        cy="78"
        r="2"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.6"
      />
      <circle
        cx="160"
        cy="74"
        r="1.5"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.5"
      />
    </>
  );
}

function RenderingDarkDoorsScene(): React.JSX.Element {
  return (
    <>
      <path
        d="M55 95 V40 Q55 22 100 22 Q145 22 145 40 V95"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="2.5"
      />
      <path
        d="M70 95 V48 Q70 34 100 34 Q130 34 130 48 V95"
        fill={LORE_BOOK_ILLUSTRATION_INK}
        fillOpacity="0.12"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="62"
        r="6"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_PURPLE}
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      {[0, 1, 2, 3, 4, 5].map((index) => {
        const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
        return (
          <circle
            key={`obelisk-${index}`}
            cx={100 + Math.cos(angle) * 22}
            cy={62 + Math.sin(angle) * 16}
            r="2.5"
            fill={LORE_BOOK_ILLUSTRATION_INK_SOFT}
          />
        );
      })}
    </>
  );
}

function RenderingFarShoreScene(): React.JSX.Element {
  return (
    <>
      <path
        d="M16 70 Q40 58 64 70 Q88 82 112 70 Q136 58 160 70 Q176 78 184 70"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="2"
      />
      <path
        d="M16 82 Q48 72 80 82 Q112 92 144 82 Q168 74 184 82"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_TEAL}
        strokeWidth="1.25"
        opacity="0.55"
      />
      <path
        d="M48 58 L56 40 L64 58 Z"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="1.5"
      />
      <line
        x1="56"
        y1="40"
        x2="56"
        y2="30"
        stroke={LORE_BOOK_ILLUSTRATION_INK}
        strokeWidth="1.25"
      />
      <path
        d="M56 30 L68 36 L56 40"
        fill={LORE_BOOK_ILLUSTRATION_GOLD}
        opacity="0.7"
      />
      <path
        d="M140 48 Q160 40 178 36"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        strokeWidth="1.25"
        strokeDasharray="3 3"
      />
      <text
        x="168"
        y="30"
        fill={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        fontSize="8"
        fontFamily="serif"
      >
        ?
      </text>
    </>
  );
}

function RenderingSealedMarksScene(): React.JSX.Element {
  const marks = [
    { x: 40, y: 40 },
    { x: 70, y: 28 },
    { x: 100, y: 36 },
    { x: 130, y: 28 },
    { x: 160, y: 40 },
    { x: 70, y: 72 },
    { x: 130, y: 72 },
  ] as const;

  return (
    <>
      <rect
        x="28"
        y="18"
        width="144"
        height="84"
        rx="3"
        fill="none"
        stroke={LORE_BOOK_ILLUSTRATION_INK_SOFT}
        strokeWidth="1.25"
        strokeDasharray="4 3"
      />
      {marks.map((mark, index) => (
        <g key={`seal-mark-${index}`}>
          <circle
            cx={mark.x}
            cy={mark.y}
            r="10"
            fill={LORE_BOOK_ILLUSTRATION_CRIMSON}
            fillOpacity="0.2"
            stroke={LORE_BOOK_ILLUSTRATION_CRIMSON}
            strokeWidth="1.5"
          />
          <path
            d={`M${mark.x - 4} ${mark.y} L${mark.x + 4} ${mark.y} M${mark.x} ${mark.y - 4} L${mark.x} ${mark.y + 4}`}
            stroke={LORE_BOOK_ILLUSTRATION_CRIMSON}
            strokeWidth="1.25"
          />
        </g>
      ))}
    </>
  );
}

const RENDERING_PLAZA_LORE_BOOK_ILLUSTRATION_SCENES: Record<
  PlazaLoreBookIllustrationId,
  () => React.JSX.Element
> = {
  'corpus-bands': RenderingCorpusBandsScene,
  'biome-rings': RenderingBiomeRingsScene,
  'quiet-hand': RenderingQuietHandScene,
  'ladder-rungs': RenderingLadderRungsScene,
  'spritcore-orb': RenderingSpritcoreOrbScene,
  'apostle-circle': RenderingApostleCircleScene,
  'two-creeds': RenderingTwoCreedsScene,
  'beast-tiers': RenderingBeastTiersScene,
  cucco: RenderingCuccoScene,
  firelands: RenderingFirelandsScene,
  'dark-doors': RenderingDarkDoorsScene,
  'far-shore': RenderingFarShoreScene,
  'sealed-marks': RenderingSealedMarksScene,
};

/** Props for {@link RenderingPlazaLoreBookIllustration}. */
export type RenderingPlazaLoreBookIllustrationProps = {
  illustrationId: PlazaLoreBookIllustrationId;
  caption: string;
};

/**
 * Ink-on-parchment illustration plate for a lore book entry.
 */
export function RenderingPlazaLoreBookIllustration({
  illustrationId,
  caption,
}: RenderingPlazaLoreBookIllustrationProps): React.JSX.Element {
  const Scene = RENDERING_PLAZA_LORE_BOOK_ILLUSTRATION_SCENES[illustrationId];

  return (
    <figure className="lore-book-illustration shrink-0">
      <svg
        viewBox="0 0 200 116"
        className="lore-book-illustration__canvas"
        role="img"
        aria-label={caption}
      >
        <Scene />
      </svg>
      <figcaption className="lore-book-illustration__caption">
        {caption}
      </figcaption>
    </figure>
  );
}
