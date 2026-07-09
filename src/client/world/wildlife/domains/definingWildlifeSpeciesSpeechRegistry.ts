/**
 * Per-species vocalization lines grouped by behavior speech context.
 *
 * Species lines are merged with shared pools in resolvingWildlifeSpeciesSpeechLines.
 * Text color is fixed per context tone (white / light blue / red).
 * All lines are animal vocalizations only (no human words).
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSpeechRegistry
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import { DEFINING_WILDLIFE_SPEECH_SHARED_LINES } from '@/components/world/wildlife/domains/definingWildlifeSpeechSharedLines';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpeciesSpeechLines = Record<
  DefiningWildlifeSpeechContextKind,
  readonly DefiningWildlifeSpeechLine[]
>;

const DEFINING_WILDLIFE_EMPTY_SPEECH_LINES: DefiningWildlifeSpeciesSpeechLines =
  {
    neutral: [],
    friendly: [],
    eating: [],
    flee: [],
    chase: [],
    attack: [],
    warn: [],
    eatingAggressive: [],
    sleep: [],
    wake: [],
    stalk: [],
    howl: [],
  };

function buildingWildlifeSpeciesSpeechLines(
  partial: Partial<DefiningWildlifeSpeciesSpeechLines>
): DefiningWildlifeSpeciesSpeechLines {
  return {
    ...DEFINING_WILDLIFE_EMPTY_SPEECH_LINES,
    ...partial,
  };
}

/** Shared Zzz lines shown above sleeping animals. */
export const DEFINING_WILDLIFE_SLEEP_SPEECH_LINES: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'Zzz...',
      style: { bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    {
      text: 'Zzzzz',
      style: { bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    { text: 'zzZ', style: { fontSizePx: 10, bubbleAnimation: 'pulse' } },
  ];

const DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY: Record<
  DefiningWildlifeSpeciesId,
  DefiningWildlifeSpeciesSpeechLines
> = {
  cow: buildingWildlifeSpeciesSpeechLines({
    neutral: [
      'Moo',
      'Mooo...',
      {
        text: 'MMMMoooooooooo',
        style: {
          fontSizePx: 13,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
      {
        text: 'MoooOOOOOooooo',
        style: {
          fontSizePx: 12,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    friendly: [
      'Mooo~',
      'Mmmmmm',
      'MoooOOOOoooo',
      {
        text: 'MmmmmmOOOOOoooo~',
        style: {
          fontSizePx: 12,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    eating: [
      'Mooo~',
      'mmmMMMmm',
      'mnch mnch',
      'crrnch',
      'MoooOOOOoooo',
      'glrp~',
      'mnch-mnch-mnch',
    ],
    flee: [
      'MoooOOO!',
      'Moooo!',
      {
        text: 'MoooOOOOOO!',
        style: {
          font: 'display',
          fontSizePx: 13,
          bubbleAnimation: 'shake',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    chase: ['MoooOOO!', 'Snort!', 'Stomp!'],
    attack: ['MoooOOO!', 'Snort!', 'Stomp!'],
    warn: [
      'Snort!',
      'Grunting!',
      'Stomp!',
      'MoooOOO!',
      {
        text: 'MMMMooooOOOO!',
        style: {
          font: 'display',
          fontSizePx: 13,
          bubbleAnimation: 'shake',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    wake: ['Moo?!', 'MoooOO?!'],
  }),
  sheep: buildingWildlifeSpeciesSpeechLines({
    neutral: [
      'Baa',
      'Meh',
      {
        text: 'BaaaaAAAAAaaaa',
        style: {
          fontSizePx: 12,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    friendly: [
      'Baaa~',
      'Mmmmmm',
      'BaaaAAaa',
      {
        text: 'BaaaAAAAAaaa~',
        style: {
          fontSizePx: 12,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    eating: ['Baaa~', 'mnch mnch', 'crrnch', 'nmm-nmm-nmm', 'Baaa baaa'],
    flee: [
      'BaaaAH!',
      'Baaa!',
      {
        text: 'BaaaAAAAAH!',
        style: {
          font: 'display',
          fontSizePx: 13,
          bubbleAnimation: 'shake',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    chase: ['BaaaAH!', 'Snort!'],
    attack: ['BaaaAH!', 'Snort!'],
    warn: ['Snort!', 'Grunting!', 'BaaaAH!'],
    wake: ['Baa?!', 'Meh?!'],
  }),
  chicken: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Cluck', 'Bawk'],
    friendly: ['Cluck cluck', 'Bawk bawk', 'Bok bok~'],
    eating: ['Tktkt kt', 'tkt-tkt', 'crrnch', 'mnch mnch', 'bok bok~'],
    flee: ['SKWAAAWK!', 'Bawk!'],
    chase: ['SKWAAAWK!', 'BWAAAK!'],
    attack: ['BWAAAK!', 'SKWAAAK!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['SKWAAAWK!', 'BWAAAK!', 'Stomp!'],
    wake: ['Bawk?!', 'Cluck?!'],
  }),
  'shepherd-dog': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Bark', 'Woof', 'Arf', 'Huff'],
    friendly: ['Bark!', 'Bark bark!', 'Woof woof!', 'Arf arf~', 'Ruff!'],
    eating: ['Chomp', 'mnch mnch', 'Nom'],
    flee: ['Yipe!', 'Whine!', 'Arf!'],
    chase: ['Bark!', 'Woof!'],
    attack: ['GRRR!', 'Bark!', 'Snap!'],
    warn: ['Grr...', 'Bark!', 'Woof!'],
    wake: ['Bark?!', 'Arf?!', 'Woof?!'],
  }),
  'cat-black': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Meow', 'Mrrp', 'Mew', 'Prr'],
    friendly: ['Meow!', 'Meow meow~', 'Mrrrow~', 'Purr', 'Mew mew'],
    eating: ['Nom', 'mnch', 'Prr'],
    flee: ['Hiss!', 'Yowl!', 'Mrrrow!'],
    chase: ['Mrr!', 'Hiss!'],
    attack: ['HISS!', 'YOWL!', 'Spit!'],
    warn: ['Hiss...', 'Mrr!', 'Spit!'],
    wake: ['Meow?!', 'Mew?!', 'Mrrp?!'],
  }),
  'cat-white': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Meow', 'Mew', 'Mrrp', 'Prrt'],
    friendly: ['Meow!', 'Meow~', 'Purrrr', 'Mrrp mrrp'],
    eating: ['Nom nom', 'mnch', 'Prr'],
    flee: ['Yowl!', 'Hiss!', 'Mew!'],
    chase: ['Mrr!', 'Hiss!'],
    attack: ['HISS!', 'YOWL!', 'Spit!'],
    warn: ['Hiss...', 'Mew!', 'Spit!'],
    wake: ['Mew meow?!', 'Meow?!', 'Prrt?!'],
  }),
  'cat-large': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Meow', 'Mrow', 'Mrrp', 'Prr'],
    friendly: ['Meow!', 'Mrow~', 'Purr', 'Mrrp'],
    eating: ['Chomp', 'mnch mnch', 'Nom'],
    flee: ['YOWL!', 'Hiss!', 'Mrow!'],
    chase: ['Mrr!', 'Hiss!'],
    attack: ['HISS!', 'YOWL!', 'SNAP!'],
    warn: ['Hiss...', 'Mrow!', 'Spit!'],
    wake: ['Mrow?!', 'Meow?!', 'Mrrp?!'],
  }),
  deer: buildingWildlifeSpeciesSpeechLines({
    neutral: [
      'Snffft',
      'Snort',
      {
        text: 'Snoooooooort...',
        style: {
          fontSizePx: 11,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm', 'snff snff'],
    flee: [
      'Snort!',
      'Skree!',
      'EeeeEE!',
      {
        text: 'EeeeeEEEEEeeee!',
        style: {
          font: 'display',
          fontSizePx: 13,
          bubbleAnimation: 'shake',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    chase: ['Snort!', 'Grunting!', 'Stomp!'],
    attack: ['Snort!', 'Stomp!', 'KRRAK!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!'],
    wake: ['Snffft?!', 'Skree?!'],
  }),
  zebra: buildingWildlifeSpeciesSpeechLines({
    neutral: [
      'Snffft',
      'Hrrm?',
      {
        text: 'Nheeeeeeeee~',
        style: {
          fontSizePx: 12,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch-crrnch', 'mnch-mnch', 'glrp~'],
    flee: ['Snort!', 'Skree!'],
    chase: ['Snort!', 'Grunting!', 'Stomp!'],
    attack: ['Snort!', 'Stomp!', 'KRRAK!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!'],
    wake: ['Whinny?!', 'Hrrm?!'],
  }),
  boar: buildingWildlifeSpeciesSpeechLines({
    neutral: [
      'Oink',
      'Grunt',
      {
        text: 'Gruuuuuunt...',
        style: {
          fontSizePx: 11,
          bubbleAnimation: 'pulse',
          animatedChar: 'last',
        },
      },
    ],
    friendly: ['Oiiiink~', 'Mmmmmm', 'Grunt grunt~'],
    eating: ['Oink oink', 'mnch mnch', 'smkk smkk', 'glrp glrp', 'snff snff'],
    flee: ['Oink!', 'Skree!'],
    chase: ['Grunt!', 'GRRRR!', 'Snort!'],
    attack: ['CHOMP!', 'GRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: [
      'Snort!',
      'Grunting!',
      'Stomp!',
      'Grunt!',
      'GRRRRR!',
      {
        text: 'SNOOOOOORT!',
        style: {
          font: 'display',
          fontSizePx: 13,
          bubbleAnimation: 'shake',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    eatingAggressive: ['gnaw gnaw', 'GRRRR grrrr', 'slrrrp', 'KRRRKK'],
    wake: ['Grunt?!', 'Snort-oink?!'],
  }),
  'brown-bear': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Grunt'],
    friendly: ['Mmmm~', 'Ahhh~', 'Hummm~'],
    eating: ['mnch mnch', 'smkk smkk', 'mmmMMMmm', 'slrp slrp', 'glrp~'],
    flee: ['GRRR!', 'Aaaah!'],
    chase: ['GRRRR!', 'RAAWR!', 'Snort!'],
    attack: ['RAAWR!', 'CHOMP!', 'KRRRKK!', 'GRRRRR!'],
    warn: ['Grunting!', 'Snort!', 'Stomp!', 'GRRRRR!', 'RAAWR!'],
    eatingAggressive: ['KRRRKK', 'GRRRROWL', 'gnaw gnaw', 'KRAAASH', 'slrrrp'],
    wake: ['Huff?!', 'GRR?!'],
  }),
  'grey-wolf': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['sniff', 'Snf snf', 'rrr', 'Rrr...', '...', '.....', 'hff', 'snff'],
    chase: ['GRRR!', 'Awooooo!', 'Snort!'],
    attack: ['GRRRRR!', 'KRRRKK!', 'SNAAAP!', 'GNRRR!'],
    warn: ['GRRRRR!', 'Awooooo!'],
    howl: [
      'Awooooo!',
      'AWOOOOO!',
      'Awooo...',
      'Awoooooo!',
      {
        text: 'Awooooooooo!',
        style: {
          fontSizePx: 13,
          bubbleAnimation: 'pulse',
          animatedChar: 'lastPunctuation',
        },
      },
      {
        text: 'AWOOOOOOOOO!',
        style: {
          font: 'display',
          fontSizePx: 14,
          bubbleAnimation: 'pulse',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    eatingAggressive: ['gnaw gnaw', 'GRRRR grrrr', 'KRRRKK', 'slrrrp'],
    wake: ['Yip?!', 'Huff?!'],
  }),
  'omega-wolf': buildingWildlifeSpeciesSpeechLines({
    neutral: ['...', '.....'],
    friendly: ['hmmm~'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: [
      '...',
      '......',
      'hff',
      'snff',
      '.....',
      {
        text: '........',
        style: { fontSizePx: 10, bubbleAnimation: 'pulse' },
      },
    ],
    chase: ['GRRRRRR!', 'KRRRRKK!', 'AWOOOOOO!'],
    attack: ['GNAARRR!', 'KRRRRKK!', 'SNAAAP!', 'GRRRRRR!', 'GNRRR!'],
    warn: ['GRRRRRR!', 'AWOOOOOO!'],
    howl: [
      'AWOOOOOO!',
      'Awoooooooo...',
      {
        text: 'AWOOOOOOOO!',
        style: {
          font: 'display',
          fontSizePx: 15,
          bubbleAnimation: 'pulse',
          animatedChar: 'lastPunctuation',
        },
      },
      {
        text: 'Awoooooooooo~',
        style: {
          fontSizePx: 13,
          bubbleAnimation: 'pulse',
          animatedChar: 'lastPunctuation',
        },
      },
    ],
    eatingAggressive: ['gnaw gnaw', 'GRRRRRR', 'KRRRRKK', 'slrrrp'],
    wake: ['GRAARRR!?', 'GNRRRR!?'],
  }),
  lion: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['RAAWR!', 'GRRRRR!', 'RoooAAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
    wake: ['Rrrr?!', 'Huff?!'],
  }),
  lioness: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['RAAWR!', 'GRRRRR!', 'RoooAAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
    wake: ['Raaa?!', 'Chuff-chuff?!'],
  }),
  crocodile: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hsss'],
    eating: ['CHOMP', 'glrp~', 'crrnch'],
    chase: ['HsssSSS!', 'SNAAAP!', 'KRRRKK!'],
    attack: ['SNAAAP!', 'KRRRKK!', 'GRRRRR!', 'CHOMP!'],
    warn: ['HsssSSS!', 'GRRRRR!', 'HsssSSSsss!'],
    eatingAggressive: [
      'SNAAAP',
      'KRRRKK',
      'thrash thrash',
      'gnaw gnaw',
      'GRRRR grrrr',
    ],
    wake: ['Snap?!', 'HsssSSS?!'],
  }),
  antilope: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Prrt'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm'],
    flee: ['Prrt!', 'Skree!', 'EeeeEE!'],
    chase: ['Snort!', 'Prrt!', 'Stomp!'],
    attack: ['Snort!', 'Stomp!', 'KRRAK!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'Prrt!'],
    wake: ['Prrt?!', 'Bleat?!'],
  }),
  oryx: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Hrmph'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch-crrnch', 'snff snff'],
    flee: ['Snort!', 'Hrmph!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'HRMPH!'],
    attack: ['KRRAK!', 'Snort!', 'THUNK!'],
    wake: ['HRMPH?!', 'Horn-snort?!'],
  }),
  giraffe: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hmmmm', 'Snfff'],
    friendly: ['Hummm~', 'Mmmm~'],
    eating: ['mnch mnch', 'slrp~', 'crrnch'],
    flee: ['Snort!', 'Hnnnn!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'HMMPH!'],
    attack: ['THWACK!', 'KRRAK!', 'WHUMP!'],
    wake: ['Hnnn?!', 'Hmmmm?!'],
  }),
  ostrich: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Boom', 'Hsss'],
    friendly: ['Boo-boom~', 'Prrt'],
    eating: ['pk pk pk', 'tkt-tkt', 'glrp~'],
    flee: ['SKREEE!', 'Hsss!'],
    chase: ['HSSSS!', 'BOOM-BOOM!'],
    attack: ['THWACK!', 'HSSSS!'],
    warn: ['Stomp!', 'Snort!', 'HSSSS!', 'Boom boom!'],
    wake: ['Boom?!', 'Skree?!'],
  }),
  elephant: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Snfff'],
    friendly: ['Prrrrr~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'slrrrp', 'fwmp'],
    flee: ['PRRAAAH!'],
    chase: ['PRRAAAH!', 'HRRRNK!'],
    attack: ['PRRAAAH!', 'THOOM!', 'KRRRSH!'],
    warn: ['Stomp!', 'Snort!', 'Grunting!', 'HRRRNK!', 'PRRAAAH!'],
    wake: ['Toot?!', 'Hrrnk?!'],
  }),
  'elephant-female': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Prrrr'],
    friendly: ['Prrrrr~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'slrrrp'],
    flee: ['PRRAAAH!'],
    chase: ['PRRAAAH!', 'HRRRNK!'],
    attack: ['PRRAAAH!', 'THOOM!'],
    warn: ['Stomp!', 'Snort!', 'Grunting!', 'HRRRNK!', 'PRRAAAH!'],
    wake: ['Prrrt?!', 'Hrmmm?!'],
  }),
  rhino: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Hffff'],
    eating: ['mnch mnch', 'crrnch', 'snff snff'],
    flee: ['SNORT!'],
    chase: ['SNOOORT!', 'HRRRGH!', 'Thud thud thud!'],
    attack: ['KRRRSH!', 'THOOM!', 'HRRRGH!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'HRRRGH!'],
    wake: ['SNOOORT?!', 'Scrape?!'],
  }),
  'rhino-female': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Hffff'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['SNORT!'],
    chase: ['SNOOORT!', 'HRRRGH!'],
    attack: ['KRRRSH!', 'THOOM!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'HRRRGH!'],
    wake: ['Hffff?!', 'Hrrrgh?!'],
  }),
  hyena: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hee hee', 'Hrf'],
    eating: ['crrnch', 'gnaw gnaw', 'hee hee~'],
    stalk: ['hee...', 'snf snf', 'rrr...', '...', 'hff'],
    chase: ['HEEHEEHEE!', 'GRRR!', 'YIP!'],
    attack: ['KEHEHEHE!', 'SNAAAP!', 'KRRRKK!', 'GNRRR!'],
    warn: ['HEEHEE!', 'GRRRRR!'],
    eatingAggressive: ['KEHEHE', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
    wake: ['Heehee?!', 'Yip-yip?!'],
  }),
  bison: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Snort'],
    friendly: ['Mmmm~', 'Hrmmm~'],
    eating: ['mnch mnch', 'crrnch', 'mmmMMMmm'],
    flee: ['HRMPH!', 'Snort!'],
    chase: ['SNOOORT!', 'HRRRGH!'],
    attack: ['THOOM!', 'KRRAK!', 'HRRRGH!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'HRMPH!'],
    wake: ['Low?!', 'Skrrt?!'],
  }),
  pig: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Oink', 'Snrt'],
    friendly: ['Oiiiink~', 'Snrf snrf~'],
    eating: ['Oink oink', 'mnch mnch', 'smkk smkk', 'glrp glrp'],
    flee: ['SKREEE!', 'Oink oink oink!'],
    chase: ['Oink!', 'Snort!', 'Grunting!'],
    attack: ['Oink!', 'Snort!', 'Stomp!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'Oink!'],
    wake: ['Oink?!', 'Snrf?!'],
  }),
  bull: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Snort'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['MRRRUH!'],
    chase: ['SNOOORT!', 'MRRRUH!', 'Thud thud!'],
    attack: ['KRRAK!', 'THOOM!', 'MRRRUH!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'HRRRGH!'],
    wake: ['Mrruh?!', 'Thud?!'],
  }),
  stag: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Hrrm'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'snff snff'],
    flee: ['Snort!', 'Skree!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'Hrrrn!'],
    attack: ['KRRAK!', 'Clack!', 'THUNK!'],
    wake: ['Bugle?!', 'Clack?!'],
  }),
  'brown-horse': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snrt', 'Brrrr'],
    friendly: ['Nheee~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch', 'snff snff'],
    flee: ['NHEEEE!', 'Brrhh!'],
    chase: ['NHEEEE!', 'Snort!', 'Stomp!'],
    attack: ['NHEEEE!', 'Snort!', 'Stomp!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'NHEEEE!'],
    wake: ['Nhee?!', 'Brrrr?!'],
  }),
  'work-horse': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snrt', 'Brrrr'],
    friendly: ['Nheee~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['NHEEEE!'],
    chase: ['NHEEEE!', 'Snort!', 'Stomp!'],
    attack: ['NHEEEE!', 'Snort!', 'Stomp!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!'],
    wake: ['Snrt?!', 'Nheee?!'],
  }),
  'arabian-horse': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snrt', 'Brrrr'],
    friendly: ['Nheee~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['NHEEEE!', 'Brrhh!'],
    chase: ['NHEEEE!', 'Snort!', 'Stomp!'],
    attack: ['NHEEEE!', 'Snort!', 'Stomp!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'NHEEEE!'],
    wake: ['Brrhh?!', 'Nhee?!'],
  }),
  donkey: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hee-haw', 'Snrt'],
    friendly: ['Hee-haw~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['HEE-HAW!', 'HEEEEE!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'HEE-HAW!'],
    attack: ['THUNK!', 'HEE-HAW!'],
    wake: ['Hee-haw?!', 'Heeee?!'],
  }),
  hippo: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Blrb'],
    eating: ['mnch mnch', 'glrp glrp', 'slrrrp'],
    flee: ['HRRUNK!'],
    chase: ['HRRUNK!', 'GRAAAH!', 'Sploosh!'],
    attack: ['CHOMP!', 'KRRRSH!', 'GRAAAH!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'HRRUNK!', 'Hraaawn!'],
    wake: ['Hrrunk?!', 'Sploosh?!'],
  }),
  'water-buffalo': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Blrb'],
    friendly: ['Mmmm~', 'Hrmmm~'],
    eating: ['mnch mnch', 'slrp slrp', 'glrp~'],
    flee: ['MRRRUH!'],
    chase: ['SNOOORT!', 'MRRRUH!'],
    attack: ['KRRAK!', 'THOOM!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'HRRRGH!'],
    wake: ['Blrb-blrb?!', 'Walloh?!'],
  }),
  turtle: buildingWildlifeSpeciesSpeechLines({
    neutral: ['...', 'Hsss'],
    friendly: ['Hmm~'],
    eating: ['mnch... mnch...', 'glrp~'],
    flee: ['Hsss!', 'shlk!'],
    wake: ['Shlk?!', '...?!'],
  }),
  tortoise: buildingWildlifeSpeciesSpeechLines({
    neutral: ['...', 'Hffff'],
    friendly: ['Hmm~'],
    eating: ['mnch... mnch...', 'crrnch...'],
    flee: ['Hsss!', 'shlk!'],
    wake: ['Shell-hsss?!', 'Crrnch?!'],
  }),
  'polar-bear': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Snfff'],
    eating: ['mnch mnch', 'smkk smkk', 'slrp slrp'],
    flee: ['GRRR!'],
    chase: ['GRRRR!', 'RAAWR!', 'Huff huff!'],
    attack: ['RAAWR!', 'CHOMP!', 'KRRRKK!', 'GRRRRR!'],
    warn: ['GRRRRR!', 'RAAWR!', 'Huff huff!'],
    eatingAggressive: ['KRRRKK', 'GRRRROWL', 'gnaw gnaw', 'slrrrp'],
    wake: ['Snfff?!', 'Ice-huff?!'],
  }),
  mammoth: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Fwoooh'],
    friendly: ['Prrrrr~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'fwmp'],
    flee: ['PRRAAAH!'],
    chase: ['PRRAAAH!', 'THOOM THOOM!'],
    attack: ['PRRAAAH!', 'THOOM!', 'KRRRSH!'],
    warn: ['Stomp!', 'Snort!', 'Grunting!', 'HRRRNK!', 'PRRAAAH!'],
    wake: ['Fwoooh?!', 'Tooo?!'],
  }),
  camel: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Blrbl'],
    friendly: ['Hrmmm~', 'Blrbl~'],
    eating: ['mnch mnch', 'crrnch', 'blrbl blrbl'],
    flee: ['HRNNGH!', 'Blegh!'],
    chase: ['HRNNGH!', 'Snort!', 'Stomp!'],
    attack: ['HRNNGH!', 'Snort!', 'Stomp!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'HRNNGH!'],
    wake: ['Blrbl?!', 'Blegh?!'],
  }),
  ram: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Baa', 'Hrmph'],
    friendly: ['Baaa~', 'Mmmmmm'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm'],
    flee: ['BaaaAH!'],
    chase: ['BAAA!', 'Snort!', 'Clonk clonk!'],
    attack: ['KRRAK!', 'THUNK!', 'BAAA!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'BAAA!'],
    wake: ['Clonk?!', 'BaaaAH?!'],
  }),
  llama: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Mwah', 'Hmmm'],
    friendly: ['Mwah~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['MWAAAH!', 'Ptooey!'],
    chase: ['MWAAAH!', 'Snort!'],
    attack: ['MWAAAH!', 'Snort!', 'Stomp!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'MWAAAH!'],
    wake: ['Mwah?!', 'Ptoo?!'],
  }),
  alpaca: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Mmm', 'Hmmm'],
    friendly: ['Hummm~', 'Mmm~'],
    eating: ['mnch mnch', 'nmm-nmm-nmm'],
    flee: ['MEEEP!', 'Ptooey!'],
    chase: ['MEEEP!', 'Snort!'],
    attack: ['MEEEP!', 'Snort!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'MEEEP!'],
    wake: ['Meep?!', 'Hmm?!'],
  }),
  yak: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Grnt'],
    friendly: ['Hrmmm~', 'Mmmm~'],
    eating: ['mnch mnch', 'crrnch', 'mmmMMMmm'],
    flee: ['HRMPH!'],
    chase: ['SNOOORT!', 'HRRRGH!'],
    attack: ['THOOM!', 'KRRAK!'],
    warn: ['Snort!', 'Grunting!', 'Stomp!', 'SNORT!', 'HRMPH!'],
    wake: ['Grnt?!', 'Yak-hrmph?!'],
  }),
  tiger: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Chuff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['...', 'hff', 'rrr...', 'snf snf'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['GRRRRR!', 'RoooAAAAWR!', 'Chuff!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
    wake: ['Prusten?!', 'Chuff-chuff?!'],
  }),
  jaguar: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Rrr'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['...', '.....', 'hff', 'rrr...'],
    chase: ['RAAWR!', 'GRRRRR!'],
    attack: ['RAAWR!', 'KRRRKK!', 'SNAAAP!', 'CHOMP!'],
    warn: ['GRRRRR!', 'HRAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK'],
    wake: ['Hraaawr?!', 'Rrr-rrr?!'],
  }),
  monkey: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Ook', 'Ee ee'],
    friendly: ['Ook ook~', 'Ee ee~'],
    eating: ['mnch mnch', 'smkk smkk', 'ook~'],
    flee: ['EEEEEK!', 'OOK OOK OOK!'],
    chase: ['OOK OOK!', 'Ee ee!'],
    attack: ['EEEEEK!', 'THWACK!', 'OOK!'],
    warn: ['Stomp!', 'Grunting!', 'Snort!', 'OOK OOK!'],
    wake: ['Ook?!', 'Ee?!'],
  }),
  chimp: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Ook', 'Hoo hoo'],
    friendly: ['Hoo hoo~', 'Ook ook~'],
    eating: ['mnch mnch', 'smkk smkk', 'hoo~'],
    flee: ['EEEEEK!', 'HOO HOO HOO!'],
    chase: ['OOK OOK!', 'HOOHOOHOO!'],
    attack: ['EEEAAAK!', 'THWACK!', 'KRRRKK!'],
    warn: ['Stomp!', 'Grunting!', 'Snort!', 'HOO HOO!', 'OOK OOK!'],
    eatingAggressive: ['gnaw gnaw', 'OOK ook', 'smkk smkk'],
    wake: ['Hoo-hoo?!', 'Thump?!'],
  }),
};

/**
 * Species-authored lines only (no shared stretchers). Used for forced emits
 * like wake and docile approach bark/meow.
 */
export function resolvingWildlifeSpeciesSpeechLinesOnly(
  speciesId: DefiningWildlifeSpeciesId,
  context: DefiningWildlifeSpeechContextKind
): readonly DefiningWildlifeSpeechLine[] {
  if (context === 'sleep') {
    return DEFINING_WILDLIFE_SLEEP_SPEECH_LINES;
  }

  return DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY[speciesId]?.[context] ?? [];
}

/**
 * Returns vocalization lines for a species and context, merged with shared fallbacks.
 */
export function resolvingWildlifeSpeciesSpeechLines(
  speciesId: DefiningWildlifeSpeciesId,
  context: DefiningWildlifeSpeechContextKind
): readonly DefiningWildlifeSpeechLine[] {
  const speciesLines = resolvingWildlifeSpeciesSpeechLinesOnly(
    speciesId,
    context
  );

  // Wake lines stay species-unique; do not dilute with shared fallbacks.
  if (context === 'wake' || context === 'sleep') {
    return speciesLines;
  }

  const sharedLines = DEFINING_WILDLIFE_SPEECH_SHARED_LINES[context] ?? [];

  if (speciesLines.length === 0) {
    return sharedLines;
  }

  if (sharedLines.length === 0) {
    return speciesLines;
  }

  return [...speciesLines, ...sharedLines];
}
