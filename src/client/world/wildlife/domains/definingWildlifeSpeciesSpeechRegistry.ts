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
    neutral: ['Moo', 'Mooo...'],
    friendly: ['Mooo~', 'Mmmmmm', 'MoooOOOOoooo'],
    eating: [
      'Mooo~',
      'mmmMMMmm',
      'mnch mnch',
      'crrnch',
      'MoooOOOOoooo',
      'glrp~',
      'mnch-mnch-mnch',
    ],
    flee: ['MoooOOO!', 'Moooo!'],
  }),
  sheep: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Baa', 'Meh'],
    friendly: ['Baaa~', 'Mmmmmm', 'BaaaAAaa'],
    eating: ['Baaa~', 'mnch mnch', 'crrnch', 'nmm-nmm-nmm', 'Baaa baaa'],
    flee: ['BaaaAH!', 'Baaa!'],
  }),
  chicken: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Cluck', 'Bawk'],
    friendly: ['Cluck cluck', 'Bawk bawk', 'Bok bok~'],
    eating: ['Tktkt kt', 'tkt-tkt', 'crrnch', 'mnch mnch', 'bok bok~'],
    flee: ['SKWAAAWK!', 'Bawk!'],
    chase: ['SKWAAAWK!', 'BWAAAK!'],
    attack: ['BWAAAK!', 'SKWAAAK!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['SKWAAAWK!', 'BWAAAK!'],
  }),
  deer: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Snort'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm', 'snff snff'],
    flee: ['Snort!', 'Skree!', 'EeeeEE!'],
  }),
  zebra: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Hrrm?'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch-crrnch', 'mnch-mnch', 'glrp~'],
    flee: ['Snort!', 'Skree!'],
  }),
  boar: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Oink', 'Grunt'],
    friendly: ['Oiiiink~', 'Mmmmmm', 'Grunt grunt~'],
    eating: ['Oink oink', 'mnch mnch', 'smkk smkk', 'glrp glrp', 'snff snff'],
    flee: ['Oink!', 'Skree!'],
    chase: ['Grunt!', 'GRRRR!', 'Snort!'],
    attack: ['CHOMP!', 'GRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['Grunt!', 'GRRRRR!', 'Snort!'],
    eatingAggressive: ['gnaw gnaw', 'GRRRR grrrr', 'slrrrp', 'KRRRKK'],
  }),
  'brown-bear': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Grunt'],
    friendly: ['Mmmm~', 'Ahhh~', 'Hummm~'],
    eating: ['mnch mnch', 'smkk smkk', 'mmmMMMmm', 'slrp slrp', 'glrp~'],
    flee: ['GRRR!', 'Aaaah!'],
    chase: ['GRRRR!', 'RAAWR!', 'Snort!'],
    attack: ['RAAWR!', 'CHOMP!', 'KRRRKK!', 'GRRRRR!'],
    warn: ['GRRRRR!', 'RAAWR!', 'Huff huff!'],
    eatingAggressive: ['KRRRKK', 'GRRRROWL', 'gnaw gnaw', 'KRAAASH', 'slrrrp'],
  }),
  'grey-wolf': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['sniff', 'Snf snf', 'rrr', 'Rrr...', '...', '.....', 'hff', 'snff'],
    chase: ['GRRR!', 'Awooooo!', 'Snort!'],
    attack: ['GRRRRR!', 'KRRRKK!', 'SNAAAP!', 'GNRRR!'],
    warn: ['GRRRRR!', 'Awooooo!'],
    howl: ['Awooooo!', 'AWOOOOO!', 'Awooo...', 'Awoooooo!'],
    eatingAggressive: ['gnaw gnaw', 'GRRRR grrrr', 'KRRRKK', 'slrrrp'],
  }),
  lion: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['RAAWR!', 'GRRRRR!', 'RoooAAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
  }),
  lioness: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['RAAWR!', 'GRRRRR!', 'RoooAAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
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
  }),
  antilope: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Prrt'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm'],
    flee: ['Prrt!', 'Skree!', 'EeeeEE!'],
  }),
  oryx: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Hrmph'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch-crrnch', 'snff snff'],
    flee: ['Snort!', 'Hrmph!'],
    warn: ['Snort!', 'HRMPH!'],
    attack: ['KRRAK!', 'Snort!', 'THUNK!'],
  }),
  giraffe: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hmmmm', 'Snfff'],
    friendly: ['Hummm~', 'Mmmm~'],
    eating: ['mnch mnch', 'slrp~', 'crrnch'],
    flee: ['Snort!', 'Hnnnn!'],
    warn: ['HMMPH!', 'Snort!'],
    attack: ['THWACK!', 'KRRAK!', 'WHUMP!'],
  }),
  ostrich: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Boom', 'Hsss'],
    friendly: ['Boo-boom~', 'Prrt'],
    eating: ['pk pk pk', 'tkt-tkt', 'glrp~'],
    flee: ['SKREEE!', 'Hsss!'],
    chase: ['HSSSS!', 'BOOM-BOOM!'],
    attack: ['THWACK!', 'HSSSS!'],
    warn: ['HSSSS!', 'Boom boom!'],
  }),
  elephant: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Snfff'],
    friendly: ['Prrrrr~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'slrrrp', 'fwmp'],
    flee: ['PRRAAAH!'],
    chase: ['PRRAAAH!', 'HRRRNK!'],
    attack: ['PRRAAAH!', 'THOOM!', 'KRRRSH!'],
    warn: ['HRRRNK!', 'PRRAAAH!', 'Stomp stomp!'],
  }),
  'elephant-female': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Prrrr'],
    friendly: ['Prrrrr~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'slrrrp'],
    flee: ['PRRAAAH!'],
    chase: ['PRRAAAH!', 'HRRRNK!'],
    attack: ['PRRAAAH!', 'THOOM!'],
    warn: ['HRRRNK!', 'PRRAAAH!'],
  }),
  rhino: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Hffff'],
    eating: ['mnch mnch', 'crrnch', 'snff snff'],
    flee: ['SNORT!'],
    chase: ['SNOOORT!', 'HRRRGH!', 'Thud thud thud!'],
    attack: ['KRRRSH!', 'THOOM!', 'HRRRGH!'],
    warn: ['SNORT!', 'HRRRGH!', 'Scrape scrape!'],
  }),
  'rhino-female': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snort', 'Hffff'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['SNORT!'],
    chase: ['SNOOORT!', 'HRRRGH!'],
    attack: ['KRRRSH!', 'THOOM!'],
    warn: ['SNORT!', 'HRRRGH!'],
  }),
  hyena: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hee hee', 'Hrf'],
    eating: ['crrnch', 'gnaw gnaw', 'hee hee~'],
    stalk: ['hee...', 'snf snf', 'rrr...', '...', 'hff'],
    chase: ['HEEHEEHEE!', 'GRRR!', 'YIP!'],
    attack: ['KEHEHEHE!', 'SNAAAP!', 'KRRRKK!', 'GNRRR!'],
    warn: ['HEEHEE!', 'GRRRRR!'],
    eatingAggressive: ['KEHEHE', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
  }),
  bison: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Snort'],
    friendly: ['Mmmm~', 'Hrmmm~'],
    eating: ['mnch mnch', 'crrnch', 'mmmMMMmm'],
    flee: ['HRMPH!', 'Snort!'],
    chase: ['SNOOORT!', 'HRRRGH!'],
    attack: ['THOOM!', 'KRRAK!', 'HRRRGH!'],
    warn: ['SNORT!', 'Skrrt skrrt!', 'HRMPH!'],
  }),
  pig: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Oink', 'Snrt'],
    friendly: ['Oiiiink~', 'Snrf snrf~'],
    eating: ['Oink oink', 'mnch mnch', 'smkk smkk', 'glrp glrp'],
    flee: ['SKREEE!', 'Oink oink oink!'],
  }),
  bull: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Snort'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['MRRRUH!'],
    chase: ['SNOOORT!', 'MRRRUH!', 'Thud thud!'],
    attack: ['KRRAK!', 'THOOM!', 'MRRRUH!'],
    warn: ['SNORT!', 'Skrrt skrrt!', 'HRRRGH!'],
  }),
  stag: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snffft', 'Hrrm'],
    friendly: ['Mmmm~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'snff snff'],
    flee: ['Snort!', 'Skree!'],
    warn: ['SNORT!', 'Hrrrn!'],
    attack: ['KRRAK!', 'Clack!', 'THUNK!'],
  }),
  'brown-horse': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snrt', 'Brrrr'],
    friendly: ['Nheee~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch', 'snff snff'],
    flee: ['NHEEEE!', 'Brrhh!'],
  }),
  'work-horse': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snrt', 'Brrrr'],
    friendly: ['Nheee~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['NHEEEE!'],
  }),
  'arabian-horse': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Snrt', 'Brrrr'],
    friendly: ['Nheee~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['NHEEEE!', 'Brrhh!'],
  }),
  donkey: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hee-haw', 'Snrt'],
    friendly: ['Hee-haw~', 'Brrrr~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['HEE-HAW!', 'HEEEEE!'],
    warn: ['HEE-HAW!', 'Snort!'],
    attack: ['THUNK!', 'HEE-HAW!'],
  }),
  hippo: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Blrb'],
    eating: ['mnch mnch', 'glrp glrp', 'slrrrp'],
    flee: ['HRRUNK!'],
    chase: ['HRRUNK!', 'GRAAAH!', 'Sploosh!'],
    attack: ['CHOMP!', 'KRRRSH!', 'GRAAAH!'],
    warn: ['HRRUNK!', 'Hraaawn!', 'GRRRRR!'],
  }),
  'water-buffalo': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Blrb'],
    friendly: ['Mmmm~', 'Hrmmm~'],
    eating: ['mnch mnch', 'slrp slrp', 'glrp~'],
    flee: ['MRRRUH!'],
    chase: ['SNOOORT!', 'MRRRUH!'],
    attack: ['KRRAK!', 'THOOM!'],
    warn: ['SNORT!', 'HRRRGH!'],
  }),
  turtle: buildingWildlifeSpeciesSpeechLines({
    neutral: ['...', 'Hsss'],
    friendly: ['Hmm~'],
    eating: ['mnch... mnch...', 'glrp~'],
    flee: ['Hsss!', 'shlk!'],
  }),
  tortoise: buildingWildlifeSpeciesSpeechLines({
    neutral: ['...', 'Hffff'],
    friendly: ['Hmm~'],
    eating: ['mnch... mnch...', 'crrnch...'],
    flee: ['Hsss!', 'shlk!'],
  }),
  'polar-bear': buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Snfff'],
    eating: ['mnch mnch', 'smkk smkk', 'slrp slrp'],
    flee: ['GRRR!'],
    chase: ['GRRRR!', 'RAAWR!', 'Huff huff!'],
    attack: ['RAAWR!', 'CHOMP!', 'KRRRKK!', 'GRRRRR!'],
    warn: ['GRRRRR!', 'RAAWR!', 'Huff huff!'],
    eatingAggressive: ['KRRRKK', 'GRRRROWL', 'gnaw gnaw', 'slrrrp'],
  }),
  mammoth: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmmm', 'Fwoooh'],
    friendly: ['Prrrrr~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch', 'fwmp'],
    flee: ['PRRAAAH!'],
    chase: ['PRRAAAH!', 'THOOM THOOM!'],
    attack: ['PRRAAAH!', 'THOOM!', 'KRRRSH!'],
    warn: ['HRRRNK!', 'PRRAAAH!', 'Stomp stomp!'],
  }),
  camel: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Blrbl'],
    friendly: ['Hrmmm~', 'Blrbl~'],
    eating: ['mnch mnch', 'crrnch', 'blrbl blrbl'],
    flee: ['HRNNGH!', 'Blegh!'],
  }),
  ram: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Baa', 'Hrmph'],
    friendly: ['Baaa~', 'Mmmmmm'],
    eating: ['mnch mnch', 'crrnch', 'nmm-nmm-nmm'],
    flee: ['BaaaAH!'],
    chase: ['BAAA!', 'Snort!', 'Clonk clonk!'],
    attack: ['KRRAK!', 'THUNK!', 'BAAA!'],
    warn: ['Snort!', 'BAAA!', 'Skrrt skrrt!'],
  }),
  llama: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Mwah', 'Hmmm'],
    friendly: ['Mwah~', 'Hummm~'],
    eating: ['mnch mnch', 'crrnch'],
    flee: ['MWAAAH!', 'Ptooey!'],
  }),
  alpaca: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Mmm', 'Hmmm'],
    friendly: ['Hummm~', 'Mmm~'],
    eating: ['mnch mnch', 'nmm-nmm-nmm'],
    flee: ['MEEEP!', 'Ptooey!'],
  }),
  yak: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Hrmph', 'Grnt'],
    friendly: ['Hrmmm~', 'Mmmm~'],
    eating: ['mnch mnch', 'crrnch', 'mmmMMMmm'],
    flee: ['HRMPH!'],
    chase: ['SNOOORT!', 'HRRRGH!'],
    attack: ['THOOM!', 'KRRAK!'],
    warn: ['SNORT!', 'HRMPH!'],
  }),
  tiger: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Chuff'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['...', 'hff', 'rrr...', 'snf snf'],
    chase: ['RAAWR!', 'GRRRRR!', 'Raaa!'],
    attack: ['RAAWR!', 'GRRRRR!', 'KRRRKK!', 'SNAAAP!'],
    warn: ['GRRRRR!', 'RoooAAAAWR!', 'Chuff!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK', 'slrrrp'],
  }),
  jaguar: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Huff', 'Rrr'],
    eating: ['crrnch', 'glrp~', 'mnch mnch'],
    stalk: ['...', '.....', 'hff', 'rrr...'],
    chase: ['RAAWR!', 'GRRRRR!'],
    attack: ['RAAWR!', 'KRRRKK!', 'SNAAAP!', 'CHOMP!'],
    warn: ['GRRRRR!', 'HRAAAWR!'],
    eatingAggressive: ['GRRRROWL', 'gnaw gnaw', 'KRRRKK'],
  }),
  monkey: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Ook', 'Ee ee'],
    friendly: ['Ook ook~', 'Ee ee~'],
    eating: ['mnch mnch', 'smkk smkk', 'ook~'],
    flee: ['EEEEEK!', 'OOK OOK OOK!'],
  }),
  chimp: buildingWildlifeSpeciesSpeechLines({
    neutral: ['Ook', 'Hoo hoo'],
    friendly: ['Hoo hoo~', 'Ook ook~'],
    eating: ['mnch mnch', 'smkk smkk', 'hoo~'],
    flee: ['EEEEEK!', 'HOO HOO HOO!'],
    chase: ['OOK OOK!', 'HOOHOOHOO!'],
    attack: ['EEEAAAK!', 'THWACK!', 'KRRRKK!'],
    warn: ['HOO HOO!', 'OOK OOK!', 'Thump thump!'],
    eatingAggressive: ['gnaw gnaw', 'OOK ook', 'smkk smkk'],
  }),
};

/**
 * Returns vocalization lines for a species and context, merged with shared fallbacks.
 */
export function resolvingWildlifeSpeciesSpeechLines(
  speciesId: DefiningWildlifeSpeciesId,
  context: DefiningWildlifeSpeechContextKind
): readonly DefiningWildlifeSpeechLine[] {
  if (context === 'sleep') {
    return DEFINING_WILDLIFE_SLEEP_SPEECH_LINES;
  }

  const speciesLines =
    DEFINING_WILDLIFE_SPECIES_SPEECH_REGISTRY[speciesId]?.[context] ?? [];
  const sharedLines = DEFINING_WILDLIFE_SPEECH_SHARED_LINES[context] ?? [];

  if (speciesLines.length === 0) {
    return sharedLines;
  }

  if (sharedLines.length === 0) {
    return speciesLines;
  }

  return [...speciesLines, ...sharedLines];
}
