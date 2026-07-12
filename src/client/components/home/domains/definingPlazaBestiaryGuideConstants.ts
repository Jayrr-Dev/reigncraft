import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** One wildlife entry in the codex bestiary guide. */
export type DefiningPlazaBestiaryGuideEntry = {
  speciesId: DefiningWildlifeSpeciesId;
  icon: string;
  /** Shown after the player sights the animal nearby. */
  summary: string;
  /** Shown after the player studies a corpse. */
  studiedSummary: string;
  /** Optional Apostle flavor line on the fully studied detail page. */
  apostleFlavor?: string;
};

/** Subtitle shown under the Bestiary panel title. */
export const DEFINING_PLAZA_BESTIARY_PANEL_SUBTITLE =
  'Get close to log a sighting. Study a corpse to learn more.' as const;

/** Label shown for species the player has not sighted yet. */
export const LABELING_PLAZA_BESTIARY_UNDISCOVERED_NAME = '???' as const;

/** Hint shown under undiscovered bestiary cards. */
export const LABELING_PLAZA_BESTIARY_UNDISCOVERED_HINT =
  'Approach wildlife to log your first sighting.' as const;

/** Static codex menu description for the Bestiary section. */
export const LABELING_PLAZA_BESTIARY_CODEX_MENU_DESCRIPTION =
  'Sighted animals and hidden ones' as const;

/** Ordered bestiary guide entries grouped by trophic role in lore. */
export const DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES: readonly DefiningPlazaBestiaryGuideEntry[] =
  [
    {
      speciesId: 'cow',
      icon: 'mdi:grass',
      summary: 'Placid plains grazer. Wanderers call them farm stock.',
      studiedSummary:
        'Cows were here before the first claim went up. They fill the plains larder and give wolves something to argue about.',
      apostleFlavor:
        'Willus Quill counts every hoof on Corpus soil, even the ones nobody branded.',
    },
    {
      speciesId: 'sheep',
      icon: 'mdi:grass',
      summary: "Plains grazer and the wolf packs' favorite prey.",
      studiedSummary:
        'Sheep are harmless until the forest edge gets dark. Every plains claimant learns what a hungry pack sounds like.',
    },
    {
      speciesId: 'chicken',
      icon: 'mdi:feather',
      summary: 'Usually harmless ground bird of the plains.',
      studiedSummary:
        'Chickens scratch the open ground in small flocks. Usually harmless. Usually.',
    },
    {
      speciesId: 'shepherd-dog',
      icon: 'mdi:paw',
      summary: 'Friendly herding dog. May trail you, or bolt if spooked.',
      studiedSummary:
        'Shepherd dogs skew tame. Approach rolls follow vs flee from aggression tier. Hitting one needs an Attack? confirm and makes them less friendly.',
    },
    {
      speciesId: 'cat-black',
      icon: 'mdi:paw',
      summary: 'Night-roaming black cat. Docile until you swing.',
      studiedSummary:
        'Black cats keep to dusk and dark. Friendliness is their aggression roll; Attack? before you hurt one.',
    },
    {
      speciesId: 'cat-white',
      icon: 'mdi:paw',
      summary: 'Pale crepuscular cat that may follow for a while.',
      studiedSummary:
        'White cats favor flower forests and dawn light. Same docile rules as their darker cousins.',
    },
    {
      speciesId: 'cat-large',
      icon: 'mdi:paw',
      summary: 'A bigger house cat with the same soft temperament.',
      studiedSummary:
        'Large cats still ask for Attack? before a hit. Aggression demotes one step per player strike.',
    },
    {
      speciesId: 'fairy',
      icon: 'ph:sparkle',
      summary: 'Night spark that trails wanderers, then slips away at dawn.',
      studiedSummary:
        'Fairies float as a gold mote with a warm night light. They follow close after dark, ignore other beasts, and shrug off wounds that end anything else. Strike one and it leaves. Sunrise sends them packing either way. No corpse to study, so sightings are most of what wanderers ever learn.',
    },
    {
      speciesId: 'deer',
      icon: 'mdi:pine-tree',
      summary: 'Skittish browser that bolts at the first wrong step.',
      studiedSummary:
        'Deer are crepuscular browsers. Bolting is their whole strategy, and venison is what happens when bolting fails.',
    },
    {
      speciesId: 'stag',
      icon: 'mdi:pine-tree',
      summary: 'A deer with more neck and more pride.',
      studiedSummary:
        'The stag is the same animal as the deer, grown into antlers and attitude. Flower forests favor them.',
    },
    {
      speciesId: 'pig',
      icon: 'mdi:food-drumstick',
      summary: 'Plains rooter, rounder and less opinionated than a boar.',
      studiedSummary:
        'Pigs eat anything, bother nobody, and feed everybody. The jungle keeps a wilder cousin.',
    },
    {
      speciesId: 'zebra',
      icon: 'mdi:run-fast',
      summary: 'Savanna grazer, heat-proof and hard to corner.',
      studiedSummary:
        'Zebras shrug off scorch that kills wanderers. For a long time they were the only grazers that thrived in the worst heat.',
    },
    {
      speciesId: 'antilope',
      icon: 'mdi:run-fast',
      summary: 'Savanna sprinter. Speed is the whole plan.',
      studiedSummary:
        'Antilopes live by distance. Hyenas live by closing it. The savanna runs both lessons at once.',
    },
    {
      speciesId: 'oryx',
      icon: 'mdi:shield',
      summary: 'Desert runner with horns. Do not corner it.',
      studiedSummary:
        "The oryx keeps the antilope's speed and adds horns. Desert wanderers respect both.",
    },
    {
      speciesId: 'ostrich',
      icon: 'mdi:feather',
      summary: 'Flightless bird that outruns most people.',
      studiedSummary:
        'Ostriches decided flight was for cowards. They are skittish, fast, and kick harder than the joke suggests.',
    },
    {
      speciesId: 'camel',
      icon: 'mdi:weather-sunny',
      summary: 'Desert walker, heat-proof and patient.',
      studiedSummary:
        'Camels cross dunes like they wrote the map. Wanderers have been known to follow one out of sheer respect.',
      apostleFlavor:
        'Amboser calls every lit camp a tribute. Camels just keep walking through the dark.',
    },
    {
      speciesId: 'turtle',
      icon: 'mdi:water',
      summary: 'Slow armored resident of swamp and beach.',
      studiedSummary:
        'Turtles are passive and shell-hard. Hits against them skew toward blocked more often than bare flesh would.',
    },
    {
      speciesId: 'tortoise',
      icon: 'mdi:terrain',
      summary: 'Beach and desert tortoise, even slower than a turtle.',
      studiedSummary:
        'Tortoises outlast panic. They do not flee so much as decline the conversation.',
    },
    {
      speciesId: 'brown-horse',
      icon: 'mdi:run-fast',
      summary: 'Feral plains horse. Skittish to a fault.',
      studiedSummary:
        'Brown horses drift the plains in loose herds. Nobody has stayed on one long enough to change that.',
    },
    {
      speciesId: 'work-horse',
      icon: 'mdi:run-fast',
      summary: 'Heavier feral horse built for hauling, not friendship.',
      studiedSummary:
        'Work horses run thicker through the plains than their brown cousins. Same skittish temper, more shoulder.',
    },
    {
      speciesId: 'arabian-horse',
      icon: 'mdi:run-fast',
      summary: 'Heat-hardy feral horse of plains and desert edges.',
      studiedSummary:
        'Arabian horses keep the herd instinct and add desert stamina. They bolt farther and come back less often.',
    },
    {
      speciesId: 'donkey',
      icon: 'mdi:run-fast',
      summary: 'Stubborn plains runner with a memorable kick.',
      studiedSummary:
        'Donkeys are slower than horses and kick like they remember the last life. Feral herds treat them as equals.',
    },
    {
      speciesId: 'ram',
      icon: 'mdi:shield',
      summary: 'Rocky highland grazer that meets rudeness at full speed.',
      studiedSummary:
        'Rams hold the rocky flats. They look placid until you learn what a full-speed charge does to pride.',
    },
    {
      speciesId: 'llama',
      icon: 'mdi:grass',
      summary: 'Placid woolly grazer of the rocky flats.',
      studiedSummary:
        'Llamas share the high ground with alpacas and yaks. They spit when offended and otherwise keep the peace.',
    },
    {
      speciesId: 'alpaca',
      icon: 'mdi:grass',
      summary: 'Smaller rocky-flats grazer, placid until crowded.',
      studiedSummary:
        "Alpacas are the rocky biome's quiet delegation. Less fight than a ram, more spit than a sheep.",
    },
    {
      speciesId: 'yak',
      icon: 'mdi:snowflake',
      summary: 'Cold-hardy heavy grazer of rocky slopes and snow.',
      studiedSummary:
        'Yaks shoulder wind that would stop a cow. Rocky flats and snowy edges both keep herds.',
    },
    {
      speciesId: 'monkey',
      icon: 'mdi:paw',
      summary: 'Jungle canopy dweller that flees anything larger than fruit.',
      studiedSummary:
        'Monkeys travel in loud troops. They announce your position for free, which is why the jungle feels watched.',
    },
    {
      speciesId: 'chimp',
      icon: 'mdi:paw',
      summary: 'Jungle primate. Passive until pushed.',
      studiedSummary:
        "Chimps are the jungle's exception in the prey tier: passive until pushed, and much stronger than their size suggests.",
    },
    {
      speciesId: 'boar',
      icon: 'mdi:food-drumstick',
      summary: 'Territorial omnivore that warns before it charges.',
      studiedSummary:
        'Boars give a fair warning by Corpus standards. Ignore it and what happens next is on you.',
    },
    {
      speciesId: 'bison',
      icon: 'mdi:shield',
      summary: "Heavy plains grazer with a boar's temper and more mass.",
      studiedSummary:
        "Bison took the boar's warning system and added weight. Plains walls learn the difference quickly.",
    },
    {
      speciesId: 'bull',
      icon: 'mdi:shield',
      summary: 'Heavy plains grazer that charges without much debate.',
      studiedSummary:
        'Bulls are retaliators with momentum. The plains have taught more than one wanderer what full speed does to wood.',
    },
    {
      speciesId: 'water-buffalo',
      icon: 'mdi:water',
      summary: 'Swamp heavy grazer, placid in mud until it is not.',
      studiedSummary:
        'Water buffalo share the swamp with crocodiles and somehow keep an arrangement. Do not test the arrangement.',
    },
    {
      speciesId: 'grey-wolf',
      icon: 'mdi:paw',
      summary: 'Nocturnal pack stalker of forest and beyond.',
      studiedSummary:
        'Wolves aggro as a pack, and a howl carries: wolves you cannot see may answer it and come running. When they break and flee, Adrenaline Rush fills their stamina so the sprint is fresh. Their name tags run from Pup to Alpha, and the forest at night is theirs.',
      apostleFlavor:
        'Vander owns the roads. The wolves own everything between them.',
    },
    {
      speciesId: 'omega-wolf',
      icon: 'mdi:paw',
      summary:
        'Night-only elite pack leader. Darker, heavier, and never sleeping.',
      studiedSummary:
        'The Omega is always alpha. It hunts only after dark, leading four grey wolves that share its aggro. Its bites hemorrhage and it heals from damage it deals. Like grey wolves, Adrenaline Rush restores its stamina when it flees. Kill it before it kills the pack.',
      apostleFlavor:
        'Tomas calls it a corrupted strain. Most people just call it the one that did not stop when the others ran.',
    },
    {
      speciesId: 'hyena',
      icon: 'mdi:paw',
      summary: 'Savanna night hunter that negotiates with teeth.',
      studiedSummary:
        'Hyenas stalk like wolves but laugh while they do it. The laugh is not a laugh. Do not laugh back.',
    },
    {
      speciesId: 'brown-bear',
      icon: 'mdi:paw',
      summary: 'Cathemeral omnivore that ignores you until you give it reason.',
      studiedSummary:
        'Brown bears are cold-proof retaliators. A bear ignores you until you give it a reason, then remembers.',
    },
    {
      speciesId: 'polar-bear',
      icon: 'mdi:snowflake',
      summary: 'Frost-country predator. Less patience than its brown cousin.',
      studiedSummary:
        'Polar bears skipped the brown bear\'s "ignores you" phase. Deer up north stay nervous for good reason.',
    },
    {
      speciesId: 'lion',
      icon: 'mdi:paw',
      summary: 'Crepuscular pride hunter of the savanna.',
      studiedSummary:
        'Lions hunt at dawn and dusk in coordinated groups. Pull one and you pull the pride.',
      apostleFlavor:
        'Japa Morgus would call a pride a contract. The lions call it Tuesday.',
    },
    {
      speciesId: 'lioness',
      icon: 'mdi:paw',
      summary: 'Pride hunter, lighter and faster than the male.',
      studiedSummary:
        'Lionesses do most of the hunting work. Pride aggro means there is no such thing as fighting one alone.',
    },
    {
      speciesId: 'tiger',
      icon: 'mdi:paw',
      summary: 'Jungle predator that stalks what it can see coming.',
      studiedSummary:
        'Tigers stalk through heat and canopy. The jungle offers the danger you might see coming.',
    },
    {
      speciesId: 'jaguar',
      icon: 'mdi:paw',
      summary: 'Jungle ambusher. The danger you will not see.',
      studiedSummary:
        'Jaguars ambush from cover. The jungle pairs them with tigers so nothing feels safe.',
    },
    {
      speciesId: 'crocodile',
      icon: 'mdi:water',
      summary: 'Swamp ambusher. Deadly in water, slow on land.',
      studiedSummary:
        'Crocodiles are patient. Survival means knowing which side of the waterline you are on.',
      apostleFlavor:
        'Vander says refuse his roads and enjoy the swamp. The crocodiles agree.',
    },
    {
      speciesId: 'giraffe',
      icon: 'mdi:tree-outline',
      summary: 'Tall savanna browser, calm until you earn the kick.',
      studiedSummary:
        'Giraffes are heat-proof retaliators in theory. In practice you have to work hard to earn the kick.',
    },
    {
      speciesId: 'elephant',
      icon: 'mdi:earth',
      summary: 'Savanna megafauna with a wide territory and long memory.',
      studiedSummary:
        'Elephants warn before they stomp. Veterans treat a sighting like weather: route around it.',
      apostleFlavor:
        'Dominus builds towers. Elephants were raising the skyline first.',
    },
    {
      speciesId: 'elephant-female',
      icon: 'mdi:earth',
      summary: 'Matriarch elephant leading savanna herds.',
      studiedSummary:
        'Matriarchs hold the herd together and the temper that comes with it. Pride hunters give them distance.',
    },
    {
      speciesId: 'rhino',
      icon: 'mdi:shield',
      summary: 'Heavy savanna grazer that charges first and explains later.',
      studiedSummary:
        'Rhinos charge. Their territory is wide, their patience thin, and their memory longer than yours.',
    },
    {
      speciesId: 'rhino-female',
      icon: 'mdi:shield',
      summary: 'Rhino cow, slightly lighter but no more forgiving.',
      studiedSummary:
        "Rhino cows share the bull's charge and the badlands habit of ending arguments with mass.",
    },
    {
      speciesId: 'hippo',
      icon: 'mdi:water',
      summary: 'Swamp grazer holding the record for mistaken safety.',
      studiedSummary:
        "Hippos look like grazers. They are retaliators with territory and the swamp's worst surprise record.",
    },
    {
      speciesId: 'mammoth',
      icon: 'mdi:snowflake',
      summary: 'Snowy plains monument. Route around, do not fight.',
      studiedSummary:
        'Mammoths are cold-proof, patient, and enormous. Old hands treat a sighting like weather.',
      apostleFlavor:
        'Rockless Fellus wants every mountain tidy. The mammoth was already mining ice.',
    },
  ] as const;
