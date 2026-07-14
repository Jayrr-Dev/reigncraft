import {
  DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER,
  listingWorldPlazaEntityDiseaseDescriptors,
  type DefiningWorldPlazaEntityDiseaseId,
  type DefiningWorldPlazaEntityDiseaseSeverity,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { MappingWorldPlazaEntityBuffHudIconName } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

/** One disease entry in the codex Pathology guide. */
export type DefiningPlazaPathologyGuideEntry = {
  diseaseId: DefiningWorldPlazaEntityDiseaseId;
  displayName: string;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  severity: DefiningWorldPlazaEntityDiseaseSeverity;
  hudIconColorClassName: string;
  hudIconBorderClassName: string;
  /** Shown after the player first contracts the disease. */
  summary: string;
  /** Field notes unlocked after the first Pathology study point. */
  studiedSummary: string;
  /** Short symptom note shown in the Symptoms tier. */
  propertiesSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Subtitle shown under the Pathology panel title. */
export const DEFINING_PLAZA_PATHOLOGY_PANEL_SUBTITLE =
  'Contract a disease to unlock its page. Live with it for Pathology points (1 per in-game hour), or study carrier creatures (1 point per 3 studies).' as const;

/** Label shown for diseases the player has not contracted yet. */
export const LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under locked Pathology cards. */
export const LABELING_PLAZA_PATHOLOGY_UNDISCOVERED_HINT =
  'Survive the illness at least once to open this page.' as const;

/** Static codex menu description for the Pathology section. */
export const LABELING_PLAZA_PATHOLOGY_CODEX_MENU_DESCRIPTION =
  'Contracted diseases and hidden ones' as const;

/** Player-facing severity labels for Pathology cards. */
export const LABELING_PLAZA_PATHOLOGY_SEVERITY: Record<
  DefiningWorldPlazaEntityDiseaseSeverity,
  string
> = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  critical: 'Critical',
};

/** Copy for flower-borne diseases with no wildlife meat carriers. */
export const LABELING_PLAZA_PATHOLOGY_FLOWER_SOURCE =
  'Raw flowers (chewing petals)' as const;

type DefiningPlazaPathologyGuideCopy = {
  summary: string;
  studiedSummary: string;
};

/** Codex sighting line and field notes per disease (independent of HUD description). */
const DEFINING_PLAZA_PATHOLOGY_GUIDE_COPY: Record<
  DefiningWorldPlazaEntityDiseaseId,
  DefiningPlazaPathologyGuideCopy
> = {
  salmonellosis: {
    summary: 'Gut heaves after half-cooked fowl; legs feel poured full of sand.',
    studiedSummary:
      'Specimen: undercooked poultry, pink at the bone. Belly clenches first, then toxic poison drains about a quarter of your strength across half a fever day. Cook until the juices run clear.',
  },
  'chronic-wasting': {
    summary: 'The mind drifts sideways; legs refuse to keep pace.',
    studiedSummary:
      'Cervid meat, barely seared. Thoughts scatter mid-step and the weakness does not lift when the fever breaks. Worst sickness I have watched linger.',
  },
  trichinellosis: {
    summary: 'Joints lock after raw pork; muscles feel threaded with wire.',
    studiedSummary:
      'Larvae in raw swine flesh. Limbs stiffen first; when the worms wake, venomous poison takes nearly half your strength over a full day. No shortcut through the cook fire.',
  },
  'mad-cow': {
    summary: 'Beef meal, then the world tilts and names slip loose.',
    studiedSummary:
      'Tainted ox meat. Confusion comes in layers; late on, fated shock hits for nearly half your strength in one blow after a short countdown.',
  },
  'liver-fluke': {
    summary: 'Ovine offal left the gait short and breath thin.',
    studiedSummary:
      'Flukes from sheep liver, eaten raw or half done. Walk slows first; any sprint drains stamina hard and recovery crawls.',
  },
  'sleeping-sickness': {
    summary: 'Zebra flesh, then heavy sleep and wrong turns in open ground.',
    studiedSummary:
      'Trypanosomes from striped ungulate meat. Drowsiness hits in waves between spells of not knowing which way is forward.',
  },
  'wolf-fever': {
    summary: 'Predator meat cost me my jump and my footing in the same hour.',
    studiedSummary:
      'Carried in wolf and kin flesh. Cannot jump or roll; the ground seems to tilt when you try. Eat cooked or stay off cliffs.',
  },
  'bear-worm': {
    summary: 'Bear meat left the arms weak; blood came later.',
    studiedSummary:
      'Worms from ursine carcass, same family as swine sickness but slower. Weakness stacks first; late bleeding drains over a third of your strength across most of a day.',
  },
  toxoplasmosis: {
    summary: 'Big-cat meat dulled my hands and scrambled my heading.',
    studiedSummary:
      'Parasite from panther and lion flesh. Reflexes drag; direction sense frays. Cook through or do not touch the kill.',
  },
  'vibrio-infection': {
    summary: 'Reptile meat brought fast poison, then a heavier blow later.',
    studiedSummary:
      'Vibrio in cold-blooded flesh. Toxic poison burns about a third of your strength over half a day; later a fated shock takes another quarter after a short wait.',
  },
  'feline-gut': {
    summary: 'Cat or camp dog meat; gut cramps faster than bad fowl ever did.',
    studiedSummary:
      'Campylobacter from domestic cat and camp dog meat. Same rot family as poultry sickness, but the belly turns faster and poison drains about a fifth of your strength over several hours.',
  },
  'primate-fever': {
    summary: 'Primate meat dulled edge and hand before the fever poison rose.',
    studiedSummary:
      'Parasites in tree-dweller flesh, monkey and chimp. Reflexes slip; fever poison then takes about three tenths of your strength across most of a day. Rare prey, common regret.',
  },
  'equine-drowse': {
    summary: 'Horse flesh brought sleep between bouts of not knowing north from south.',
    studiedSummary:
      'From horse and donkey meat. Drowsiness and confusion trade places in waves. Cook long or nap in a dangerous place.',
  },
  'scavenger-rot': {
    summary: 'Hyena kill left the body weak; venomous burn followed.',
    studiedSummary:
      'Hyena carcass, rank even cold. Weakness stacks; venomous poison then drains close to two fifths of your strength over most of a day. Scavenger meat is never worth the gamble.',
  },
  'tusk-fluke': {
    summary: 'Tusked giant meat drained stamina at a run; poison would not shake loose.',
    studiedSummary:
      'Flukes from elephant, rhino, and mammoth flesh. Sprint stamina collapses; toxic poison then takes over a third of your strength across a full day. Heavy cook, long rest.',
  },
  'cucco-rage': {
    summary: 'Raw bird meat: hotter blood, harder hits, then the flock thinks for me.',
    studiedSummary:
      'Aggressive bird flesh eaten raw. Body runs hot and strikes hard first; later the flock seems to steer the hands, and a late toxic burn drains about a quarter of your strength. Strange blessing, stranger curse.',
  },
  'pollen-fever': {
    summary: 'Chewed petals left the throat dusty; fever and a light burn followed.',
    studiedSummary:
      'Airborne dust from raw flower petals. Mild fever slows the gait; toxic burn then drains about fifteen percent of your strength over several hours. Dry petals are worse than wet.',
  },
  'petal-pox': {
    summary: 'Petal rash itched until the skin took hits easier; blood seeped late.',
    studiedSummary:
      'Itchy rash from petal contact, raw or chewed. Skin thins to blows first; late bleeding drains about a quarter of your strength across half a day. Wash hands after picking.',
  },
  rootgut: {
    summary: 'Bitter root oils from raw blooms; belly cramps followed the nausea.',
    studiedSummary:
      'Bitter oils in raw flower roots and stems, not just petals. Nausea first, then toxic cramp that drains about a fifth of your strength over several hours. Boil or avoid the whole plant.',
  },
  moonblight: {
    summary: 'Night bloom toxins: confusion thickens under moon, eases at dawn.',
    studiedSummary:
      'Toxins from night-blooming flowers eaten raw. Confusion and stamina drain swell under moonlight; daylight pulls the edge off. Travel by day if you slip.',
  },
  seedlung: {
    summary: 'Raw flower seeds left each breath shaving stamina; dust burned after.',
    studiedSummary:
      'Seeds in raw flower meals lodge in the lungs. Every breath costs stamina; venomous dust then drains over two fifths of your strength across most of a day. Spit seeds out before you chew.',
  },
};

function buildingPlazaPathologyGuideEntries(): readonly DefiningPlazaPathologyGuideEntry[] {
  return listingWorldPlazaEntityDiseaseDescriptors()
    .slice()
    .sort((left, right) => {
      const severityDelta =
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[right.severity] -
        DEFINING_WORLD_PLAZA_ENTITY_DISEASE_SEVERITY_SORT_ORDER[left.severity];

      if (severityDelta !== 0) {
        return severityDelta;
      }

      return left.label.localeCompare(right.label);
    })
    .map((descriptor) => {
      const copy = DEFINING_PLAZA_PATHOLOGY_GUIDE_COPY[descriptor.id];
      const hasHealthPercentDamage = descriptor.grants.some(
        (grant) =>
          grant.kind === 'poison' ||
          grant.kind === 'bleed' ||
          grant.kind === 'potential_damage'
      );

      return {
        diseaseId: descriptor.id,
        displayName: descriptor.label,
        icon: descriptor.icon,
        severity: descriptor.severity,
        hudIconColorClassName: descriptor.hudIconColorClassName,
        hudIconBorderClassName: descriptor.hudIconBorderClassName,
        summary: copy.summary,
        studiedSummary: copy.studiedSummary,
        propertiesSummary: hasHealthPercentDamage
          ? `${LABELING_PLAZA_PATHOLOGY_SEVERITY[descriptor.severity]} illness. Stages fire after incubation. Poison, bleed, and fated hits drain a share of max health.`
          : `${LABELING_PLAZA_PATHOLOGY_SEVERITY[descriptor.severity]} illness. Stages fire after incubation ends.`,
      };
    });
}

/** Ordered Pathology guide entries (severe first, then name). */
export const DEFINING_PLAZA_PATHOLOGY_GUIDE_ENTRIES: readonly DefiningPlazaPathologyGuideEntry[] =
  buildingPlazaPathologyGuideEntries();
