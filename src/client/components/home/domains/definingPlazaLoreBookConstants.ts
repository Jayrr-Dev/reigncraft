/**
 * Content and structure for the in-game lore book (Codex Lore section).
 *
 * Every entry is grounded in the world bible under `lore/` and in shipped
 * systems (biomes, Spritcore spill/commit, wildlife, disease, harvest).
 * Open questions (`lore/meta/open-questions.md`) stay open: those pages ship
 * as fragments or sealed entries, never as answers.
 *
 * Voice: a lore-master's compendium, copied by hand from older accounts.
 *
 * @module components/home/domains/definingPlazaLoreBookConstants
 */

/** How an entry reads on the page. */
export type PlazaLoreBookEntryKind =
  /** A settled account in the scribe's hand. */
  | 'account'
  /** A damaged page: surviving passages separated by torn gaps. */
  | 'fragment'
  /** A sealed page. Title reads as unknown; only the seal note is legible. */
  | 'sealed';

/** An attributed quotation set apart from body text. */
export type PlazaLoreBookQuote = {
  text: string;
  attribution: string;
};

/** One readable page of the lore book. */
export type PlazaLoreBookEntry = {
  id: string;
  kind: PlazaLoreBookEntryKind;
  title: string;
  /** Small scribe note under the title. */
  subtitle: string;
  icon: string;
  paragraphs: readonly string[];
  quote?: PlazaLoreBookQuote;
  /** Handwritten aside in the page margin. */
  marginNote?: string;
  /** Shown on sealed pages in place of body text. */
  sealNote?: string;
};

/** A chapter grouping entries under one bookmark. */
export type PlazaLoreBookChapter = {
  id: string;
  title: string;
  icon: string;
  /** One-line description shown in the table of contents. */
  blurb: string;
  entries: readonly PlazaLoreBookEntry[];
};

/** Cover accent theme for a volume in the shelf and reader. */
export type PlazaLoreBookThemeId =
  | 'lands'
  | 'founder'
  | 'climb'
  | 'road'
  | 'crown'
  | 'edges';

/**
 * One bound volume in the Wanderer's Corpus series. Chapters are referenced by
 * id and resolved against {@link DEFINING_PLAZA_LORE_BOOK_CHAPTERS}.
 */
export type PlazaLoreBookDefinition = {
  id: string;
  /** Roman volume mark shown on the shelf (e.g. "Book I"). */
  volumeLabel: string;
  title: string;
  subtitle: string;
  /** One-line blurb on the shelf card. */
  blurb: string;
  icon: string;
  themeId: PlazaLoreBookThemeId;
  chapterIds: readonly string[];
};

/** Series title on the shelf header. */
export const DEFINING_PLAZA_LORE_BOOK_TITLE = 'A Wanderer\u2019s Corpus';

/** Series subtitle on the shelf header. */
export const DEFINING_PLAZA_LORE_BOOK_SUBTITLE =
  'Being a compendium of older accounts, set down by many hands. Not all the pages endured the copying.';

/** Accessible label for the lore book dialog. */
export const LABELING_PLAZA_LORE_BOOK_DIALOG = 'Lore book';

/** Accessible label for the volume shelf. */
export const LABELING_PLAZA_LORE_BOOK_SHELF = 'Lore book shelf';

/** Accessible label for the chapter bookmark list. */
export const LABELING_PLAZA_LORE_BOOK_CHAPTER_LIST = 'Lore book chapters';

/** Title placeholder for sealed entries. */
export const DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE = '? ? ?';

/** Back-control label when returning from a volume to the shelf. */
export const DEFINING_PLAZA_LORE_BOOK_SHELF_BACK_LABEL = 'All books';

/** Ordered chapters and entries of the lore book. */
export const DEFINING_PLAZA_LORE_BOOK_CHAPTERS: readonly PlazaLoreBookChapter[] =
  [
    {
      id: 'the-world',
      title: 'The World',
      icon: 'mdi:earth',
      blurb: 'Concerning Corpus, its lands, and its perilous airs',
      entries: [
        {
          id: 'corpus',
          kind: 'account',
          title: 'Corpus',
          subtitle: 'Of the world and its naming',
          icon: 'mdi:earth',
          paragraphs: [
            'The world is named Corpus, and the name is Manus\u2019s own, for he made the world and named it after his making. In the old tongue it signifies a body: one body of many parts, and every part labouring. So he speaks of it in his Addresses, and no wanderer who has dwelt here a season fails to mark which parts are meant.',
            'One land it is, unbroken, and it holds every country a wanderer may walk. All distances are reckoned from the place of waking, for peril is reckoned so likewise: gentle is the ground where you first drew breath, and ever less gentle the farther your road runs. The wise hold this to be no chance, but design. The ladder sets every climber upon an easy rung.',
            'Day and night keep faithful measure, and the beasts keep it with them. At dusk the deer go abroad; the dark belongs to the wolves; at dawn the lions walk their bounds. Heat and cold are true powers in this world, and deadly at either end. Little else in Corpus moves by any schedule; learn therefore the things that do.',
          ],
          quote: {
            text: 'the generosity of the Founder of Corpus',
            attribution:
              'Graven upon a road that no one remembers the building of',
          },
        },
        {
          id: 'the-bands',
          kind: 'account',
          title: 'The Bands',
          subtitle:
            'Of the fourteen countries, ordered by the length of the road',
          icon: 'ph:mountains',
          paragraphs: [
            'The lands lie in bands, and ever outward they run from the middle country. Nearest are the common grounds: the plains, the forest, and the snowy plains, where most of us first learned the cooking of meat, and where the first claims of the present age were staked. Beyond them lie the uncommon bands, the beach and the savanna and the bare rocky flats.',
            'Farther still is the rare ground: jungle and desert, swamp and badlands, and at the rim of all things the open ocean. Rarer than these is the flower forest, a meadow-country so seldom found that old superstition still guards it. And at the utmost edge of any traveller\u2019s tale stand the two legendary discs: the Firelands, where the earth burns without ceasing, and Frostsink, a bowl of ice about a Cryocore, where the cold reaches toward the stillness at the bottom of all cold.',
            'The perils of these lands bear names, and the names are to be heeded. Scorch is the heat of the air, and it is honest, for it declares its killing even as it kills. Frost slows the body toward a full stop, and if you linger it sets frostbite in the flesh. Burn is the touch of lava, with which there is no parley. Of the swamp the lesson is otherwise: the death you may see plainly in the badlands walks unseen there.',
          ],
          marginNote:
            'The beach is held neutral ground by old custom. None yet has warred over sand.',
        },
        {
          id: 'heat-and-cold',
          kind: 'account',
          title: 'Heat and Cold',
          subtitle: 'That comfort has both a floor and a ceiling',
          icon: 'mdi:thermometer',
          paragraphs: [
            'Corpus takes no counsel of your liking in the matter of weather. Abide too long in heat and Scorch drains the life from you moment by moment; abide too long in cold and Frost does likewise, and your stride shortens toward a standstill besides. A campfire warms the ground about it. Ice and frozen water draw the warmth away.',
            'Long cold lays frostbite upon the body in degrees: first a chill, then cold in the bone, then shivering, and worse follows after. Warm ground undoes it, degree by degree, as it came. Hardiness against heat or cold buys a traveller time upon the road. Some folk are born proof against the cold altogether, and theirs is another life entirely.',
            'With night comes a cooling over all the land, be it never so slight. Order your crossings with that in mind, or you will wake slower than you lay down.',
          ],
          marginNote:
            'If the air itself gives hurt, depart. Pride never yet warmed anyone.',
        },
      ],
    },
    {
      id: 'the-founder',
      title: 'The Founder',
      icon: 'game-icons:holy-symbol',
      blurb: 'Of Manus, his Addresses, and his gifts',
      entries: [
        {
          id: 'manus',
          kind: 'account',
          title: 'Manus',
          subtitle: 'The one god, who will say so himself',
          icon: 'game-icons:holy-symbol',
          paragraphs: [
            'One god there is in Corpus, and Manus is his name, and this is known to all. Not believed: known, as the rising of the sun is known. None dispute that he is. They dispute whether he is right, and to that dispute he has long since published his answer, more than once, and in his own voice.',
            'He made the world as a contest. Not as a garden was it made, nor as a punishment, but as a proving: to find one worthy to surpass him and to take his seat. This he has never hidden. To be surpassed, he says, is the whole purpose of the venture.',
            'One question he asks of every soul upon every rung: can you rise? And his law is but four words, learned by every child of Corpus ere ever they learn the cooking of meat: lose, return, grow, try again.',
          ],
          quote: {
            text: 'I did not build you a paradise. Paradise makes nothing. I built you a chance.',
            attribution:
              'From an Address of Manus, recited from memory in every land',
          },
        },
        {
          id: 'the-quiet-hand',
          kind: 'account',
          title: 'The Quiet Hand',
          subtitle: 'The hand that shaped all things and touches none',
          icon: 'ph:hand-eye',
          paragraphs: [
            'Manus punishes no one. Not once has he done so, nor ever, in his own person. If you starve upon poor land, if a wolf you wounded three lives past finds you at last: this is not Manus reaching down. It is the work running as it was wrought, while its maker looks on, and looks on kindly. The Quiet Hand, folk name him, and it is no slander. The Mereons say it in their prayers.',
            'And he gives. Of this the records are many and sure. Wells of healing have been found beside fields where battle ran long. Granaries have stood full after famine. Whole roads have been laid in a single night, and signed. The gifts are true gifts, and true folk are helped by them; yet each comes with his name upon it, and a lesson bound to it. The well heals you, that you may climb again. The granary feeds the village, that the village may bring forth climbers.',
            'Never yet has Manus given a gift that made the ladder needless. Say so to a Mereon, and he will answer patiently that herein precisely lies its wisdom.',
          ],
          quote: {
            text: 'Everything I have, I am trying to give away. It is simply very heavy.',
            attribution: 'From an Address of Manus',
          },
        },
        {
          id: 'the-succession',
          kind: 'fragment',
          title: 'The Succession',
          subtitle: 'Wherefore he desires an heir',
          icon: 'ph:sparkle',
          paragraphs: [
            'He says that the venture fulfils itself when one arises. He says it warmly, and by all seeming he means it; and that is the whole of what any soul truly knows.',
            'Ask a Mereon what Manus desires an heir for, and you will be answered for an hour. Ask one of the Uncored, and you will be answered more shortly, and given a pamphlet. Search the Addresses, and you will find the question served as he serves every question that pleases him: praised, and thanked, and left standing where it stood.',
            'This copyist has read the collected Addresses twice through, and will set down only this: he wished to be asked.',
          ],
        },
      ],
    },
    {
      id: 'the-ladder',
      title: 'The Ladder',
      icon: 'game-icons:ladder',
      blurb: 'Of death, and of returning, and of what climbs back',
      entries: [
        {
          id: 'the-arrangement',
          kind: 'account',
          title: 'The Arrangement',
          subtitle: 'That all things come back',
          icon: 'game-icons:ladder',
          paragraphs: [
            'All that dies, Manus brings back: monsters and kings, wanderers, and the wolf you slew for its meat. Death here is a returning, not a departing. Nothing is suffered to leave the ladder; for the ladder avails only if the weak may climb on until, in some life, they are weak no longer.',
            'The proof of it you have seen with your own eyes. When you die, the world names the manner of your death, and never the place of your going; for you went nowhere. Manus set you back upon your rung. For the same cause the herds are replenished and the packs come again: a beast is no lesser soul in his sight, but only a slower climber.',
            'Wanderers jest of dying as sailors jest of storms, and the jests are old and good; yet keep the weight that lies beneath them. Some souls die and return, and die and return, and abide at the bottom for ever, and the ladder grieves not. It is just as the falling of stone is just: one law for all, and no care for the ending.',
          ],
          quote: {
            text: 'They have not finished.',
            attribution:
              'An Address of Manus, being asked of those who never rise',
          },
        },
        {
          id: 'your-kills-remember',
          kind: 'account',
          title: 'Your Kills Remember',
          subtitle: 'Of grudges that outlast their bodies',
          icon: 'game-icons:wolf-howl',
          paragraphs: [
            'The foe you strike down will come again. Tales are told at every fire of the wolf slain five times over, and mightier at each returning; and the tales will not die. Whether every pack remembers the face of its slayer, the wise still dispute. That the packs return at all, none disputes.',
            'Hence also it is that claims endure. There is no watch to summon in Corpus, and no court of appeal; but the claimant will come back. A plot may be taken, truly. To hold it against an owner who returns for ever is another labour altogether.',
            'The old counsel is short: slay what you must, and be courteous to what you merely might.',
          ],
        },
      ],
    },
    {
      id: 'spritcore',
      title: 'Spritcore',
      icon: 'game-icons:crystal-ball',
      blurb: 'The tally of the climb, made portable',
      entries: [
        {
          id: 'the-core',
          kind: 'account',
          title: 'Spritcore',
          subtitle: 'Proof of survival, counted in orbs',
          icon: 'game-icons:crystal-ball',
          paragraphs: [
            'Spritcore is soul\u2019s energy made fast: small orbs of purple hue, warm in the hand, and humming faintly, as of a voice heard through a wall. All that walks the ladder bears a core, and all that dies yields it up. A Spritcore is proof that you endured, made small enough to carry.',
            'Three uses the wanderer finds in cores, and finds them early. They are wealth, for none gainsays a coin that is earned in blood. They are growth, for a wanderer may Commit them into the self: more life, heavier blows, swifter strokes, harder hide, longer stride. And they are rank; for the church counts them, and the merchants count them, and so does every soul besides, whatever they profess.',
            'Beneath these three lies a reckoning that is simple, and that few care to look upon: for you to grow stronger, some other thing must become spoil. Upon that sentence the whole climb of Corpus is founded.',
          ],
          quote: {
            text: 'Nothing in Corpus is wasted. Every ending is somebody\u2019s beginning.',
            attribution: 'From an Address of Manus',
          },
          marginNote: 'What the corpse thought of it, no record tells.',
        },
        {
          id: 'the-spill',
          kind: 'account',
          title: 'The Spill',
          subtitle: 'What death takes ere it returns you',
          icon: 'game-icons:drop',
          paragraphs: [
            'Dying does not empty the purse; it takes a toll of it. Some portion of the cores you bore is scattered where the body fell, for any hand to gather; and a lesser portion of what you had already Committed into yourself is stripped away with it. Lighter you come back. That is the design.',
            'Of the toll\u2019s exact measure the veterans dispute as cooks dispute over salt, and the lesson needs no measure at all: carry what you can bear to lose, and put no trust in a heavy purse as if it were mail.',
            'Some say that wealth itself has a scent, and that great beasts follow it. This copyist has met great beasts with empty pockets and small ones with full, and leaves the tale where it lies.',
          ],
          marginNote: 'Gather your own spill if you may. Another surely will.',
        },
        {
          id: 'soulbreak',
          kind: 'account',
          title: 'Soulbreak',
          subtitle: 'The one wound the old hands fear',
          icon: 'mdi:heart-flash',
          paragraphs: [
            'Most hurts fall upon the body. Soulbreak falls upon the core itself: a stroke that passes through the flesh unhindered and lands upon the very thing by which Manus keeps his tally. No armour wrought of matter may turn it, for at matter it was never aimed.',
            'Those who have borne one and lived speak of it always in the same words: cold, and silent, and wrong, as a note sounded on a string within them that no hand should reach.',
            'It is the one injury that the old hands fear beyond dying; for dying passes, and the core was not meant to be touched.',
          ],
        },
      ],
    },
    {
      id: 'the-craft',
      title: 'The Craft',
      icon: 'game-icons:wood-axe',
      blurb: 'Of hunger, tools, claims, and the keeping of life',
      entries: [
        {
          id: 'the-fire',
          kind: 'account',
          title: 'The Fire',
          subtitle: 'Of hunger, cookery, and the law of the campfire',
          icon: 'game-icons:campfire',
          paragraphs: [
            'Hunger is a measure that never sleeps. Walking spends it; running spends it faster; and if you starve long enough, your very life begins to pay the debt. Berries purchase a little time upon the road. Cooked meat purchases a meal. Raw meat purchases a tale you may live to tell.',
            'Of all tools in Corpus the campfire is chief. Cook what you take from the wild ere you eat it. Fire does not make every cut wholesome, for certain slow sicknesses have been known to outlast the cooking; yet it turns most suppers from a wager into food. A lit fire warms moreover the ground about it, which is no small matter when Frost is at your legs.',
            'A well-fed body recovers its wind the sooner. A starving one loses first the sprint, and then the leap, and the climb grows shorter on every side.',
          ],
          marginNote:
            'Honour cooks. They have kept more wanderers living than ever the sword did.',
        },
        {
          id: 'wood-and-stone',
          kind: 'account',
          title: 'Wood and Stone',
          subtitle: 'Of Chop, Mine, and Pick',
          icon: 'game-icons:stone-pile',
          paragraphs: [
            'Take up an axe, and every tree offers Chop. Take up a pickaxe, and every boulder offers Mine. For the small stones of the ground no tool is asked: Pick sets one in your bag, if the bag has room. Tall trunks and the great boulders demand longer labour; swing on until only a stump or a bare patch remains.',
            'Ore in the vein answers the same pick, and by ore are better tools bought; by stone and timber, walls. There is no glory in any of it. There is only the means by which a claim ceases to be a wish.',
            'The sound of a true stroke is half the craft, and a true eye is the other half. Stand where the tree means to fall, not where your pride would have you stand.',
          ],
        },
        {
          id: 'wild-gather',
          kind: 'account',
          title: 'Wild Gather',
          subtitle: 'Of berries, petals, and the wisdom of ceasing',
          icon: 'mdi:flower',
          paragraphs: [
            'Corpus feeds the heedless no less than the careful, for a while. Berries and fruit stay hunger without any fire. The coffee cherry wakes the weary; the tea leaf quiets them. Both grow where shrubs grow, and neither is a supper.',
            'The bright petal may be picked; the dull one is not worth the reaching. Raw flowers may bestow some small virtue, and may bestow no less readily a sickness with a fair name. Eat too many petals in a day, and Petal Sickness will teach you the measure in person.',
            'The Herbarium is the account-book of the careful. Study what you gather; for the land repeats itself, and your notes should do likewise.',
          ],
        },
        {
          id: 'the-claim',
          kind: 'account',
          title: 'The Claim',
          subtitle: 'Of ground you purpose to keep',
          icon: 'mdi:land-plots',
          paragraphs: [
            'A claim is ground marked for your own, in a world where all who desire it back are raised up again to seek it. Begin with a campfire. Build outward when you can defend what stands. Neighbours will come. Some will be courteous.',
            'Willus Quill holds all the land in trust for Manus, upon parchment, and upon terms; and what wanderers claim, they claim within his ledger. The Apostle does not come down to argue the line of a fence. Other wanderers do.',
            'Because death does not endure, no claim is won once for all. It is held, and lost, and taken again, and held anew. Provide therefore for the return journey, and count your own among them.',
          ],
          marginNote:
            'Empty land is empty only until someone kindles a fire upon it.',
        },
      ],
    },
    {
      id: 'beasts-and-birds',
      title: 'Beasts and Birds',
      icon: 'mdi:paw',
      blurb: 'Of what dwells here, how it hunts, and what it leaves in the pot',
      entries: [
        {
          id: 'old-climbers',
          kind: 'account',
          title: 'Old Climbers',
          subtitle: 'Wherefore the old hands read the name before the teeth',
          icon: 'mdi:paw',
          paragraphs: [
            'Every beast in Corpus is a person of its kind, and the world itself seems to herald them. A single glance declares stature and temper, as one dog is known from another at sight. Trust the glance. No cheaper tool of survival will you ever own.',
            'It is the uppermost orders that ask for gravity. A beast that bears the mark of Demon or of Mythical has grown far beyond the compass of one life, having had more lives than one: slain, and returned, and grown, and come again, through more turnings than any have counted.',
            'A Mythical bear is no freak of the wild. It is a very old and very patient triumph; and it is the reason the veterans read the name before they read anything else.',
          ],
        },
        {
          id: 'reading-temper',
          kind: 'account',
          title: 'Reading Temper',
          subtitle: 'What the beast promised before ever it moved',
          icon: 'game-icons:wolf-howl',
          paragraphs: [
            'Temper is a covenant, and the beasts keep it. The meek and the skittish flee when hurt. The retaliators give warning upon their own ground, and then give battle: the boar, the bear, the rhino, and their heavy-set kin. Predators hunt. Ambushers wait in the water. Pack hunters shadow their prey, and encircle it, and rush in; the stalker follows alone, until weakness opens a door.',
            'Night changes the muster. The dark belongs to wolf and hyena; and certain great ones walk only while the sun is down, nor will they wait upon the finishing of your camp.',
            'Strike at a hunter\u2019s favoured prey, and the hunter may turn upon you. Steal a meal from under a feeding jaw, and it will turn the more surely. There is an order of eating in Corpus, and you stand within it.',
          ],
          marginNote: 'If it gave you warning, believe the warning.',
        },
        {
          id: 'the-cucco',
          kind: 'account',
          title: 'The Cucco',
          subtitle: 'Concerning wrathful fowl, with due respect',
          icon: 'game-icons:chicken',
          paragraphs: [
            'The most part of the chickens of Corpus are ordinary birds. Some are not. These fall upon travellers at sight, and fight with a fury out of all proportion to their body; and in the speech of wanderers they have earned a name apart: the Cucco.',
            'The customs concerning them are long settled. One does not prove whether a chicken is a Cucco; one presumes it, and gives it a wide road. To slay one is lawful, and survivable, and held nonetheless to be a tempting of fate. To call a man a Cucco is to say: small, wrathful, and not worth the battle he will most assuredly give.',
            'Eat of the flesh raw, and the bird\u2019s fury enters with it. At the first it seems a gift, being speed and strength, and by that very seeming it wins its recruits; then the flock holds the reins. Cooked with due care, the same fury settles into a strength a body may use. The cooks of the road take a quiet pride herein: the wrathfullest beast in Corpus, brought down to a good supper.',
          ],
          quote: {
            text: 'A Cucco is not angry at you. A Cucco is angry at everything, and you happen to be closest.',
            attribution: 'As the tale is told at any fire',
          },
        },
        {
          id: 'the-pot-keeps-score',
          kind: 'account',
          title: 'The Pot Keeps Score',
          subtitle: 'Of sickness, of waiting, and of immunity earned',
          icon: 'fluent-emoji:pot-of-food',
          paragraphs: [
            'There are no healers in Corpus; therefore there is knowledge, and the knowledge is ordered by beast. Eat no boar raw, for the worm dwells in the muscle. Cook your fowl. Mutton asks a long fire. Swamp meat brings swamp troubles. The Pathology ledger fills itself, as each lesson is paid for.',
            'The cruelty of it lies in the waiting; for sickness in this land sleeps before it wakes. A wanderer may eat ill meat, and fare well for hours, and fall sick far from any camp. So the old hands, when the mark appears, count backward: what did I eat yesterday? And certain slow sicknesses have been known to pass through the cookfire alive. Fire does not slay them all. Cooked is safer. Safe it never is.',
            'Yet what survival buys is real and abides. A body that has cast out a sickness falls sick the seldomer, suffers the shorter, and may bear its immunity to the end of its days. There are no titles in Corpus; but a wanderer who eats at a strange fire without first looking in the pot has proven a thing, and all present know it.',
          ],
          marginNote:
            'Of all tools in Corpus the campfire is chief. Honour cooks.',
        },
        {
          id: 'the-study',
          kind: 'account',
          title: 'The Study',
          subtitle: 'Of looking long enough to learn the name',
          icon: 'mdi:magnify',
          paragraphs: [
            'Sight costs nothing; Study costs time. Stand over the fallen beast long enough, and the Bestiary writes a fairer page. Study a petal from the bag, and the Herbarium does likewise; ore and hewn stumps answer to the Lapidary. The longer a kind is studied, the more of its truth the guides consent to show.',
            'This is no rite of worship. It is the keeping of notes with blood beneath the fingernails; and those who scorn it meet the same teeth twice, and marvel each time.',
            'It is said that at the uttermost end of the study of a beast, its very form may be put on. This copyist has heard the claim made in earnest. The truth of it belongs to whoever finishes the count.',
          ],
        },
      ],
    },
    {
      id: 'the-twelve',
      title: 'The Twelve',
      icon: 'mdi:crown',
      blurb: 'Of the Apostles, who own what you need',
      entries: [
        {
          id: 'the-stewards',
          kind: 'account',
          title: 'The Stewards',
          subtitle: 'Loyal, worshipful, and no gods',
          icon: 'mdi:crown',
          paragraphs: [
            'Twelve Apostles did Manus appoint to govern Corpus in his stead: stewards chosen by his own hand, loyal wholly, and worshipful without reserve. Gods they are not. One god has Corpus; and the Apostles would be the first to say so, at length, while you were shown the door.',
            'What they are is owners. Each governs one of the twelve things by which folk live, and over folk themselves they do not rule; they rule the things folk cannot do without, which has ever proved the stronger lever. A wanderer may evade a king. None evades timber.',
            'Whosoever would challenge Manus must first overcome all twelve; and this the Apostles hold for a duty, not an affront, being themselves the last rungs of the ladder, whose office it is to prove the challenger. To defeat one wins nothing but leave to climb on; the granaries pass to no victor. None has yet overcome all twelve. None has come near enough for the question of what follows to be more than the talk of clerics.',
          ],
        },
        {
          id: 'the-names',
          kind: 'account',
          title: 'The Names and the Holdings',
          subtitle: 'As they are commonly recited',
          icon: 'game-icons:scroll-unfurled',
          paragraphs: [
            'Willus Quill holds the land, every parcel thereof, in trust for Manus, upon parchment and upon terms. Rockless Fellus holds what the land contains: ore and oil and timber, tithed to the core. Carnegus turns mountains into girders, and names it the holiest work there is. Dominus owns the buildings, and his name stands upon them, writ large.',
            'Stanous Black makes the tools; and of all the twelve he comes nearest to being loved, for his tools do their work. Herford owns the engines, and speaks of rhythm as priests speak of grace. Vander owns the roads, the rails, and the havens; refuse them, and the swamp is yours to enjoy. Amboser keeps light and heat and current, and calls energy the breath of the ladder.',
            'Leon Astronavis moves all that moves, and says openly that the ocean\u2019s rim and the sky are but routes not yet sailed. Zeche Tore owns the patterns: the secrets of craft, the formulas, the knowing itself. Quacker Berg governs word and signal and record; his services he gives freely, whereat the other eleven laughed, until the day he knew everything. And Japa Morgus is the Apostle from whom the other Apostles borrow; and that tells you the true order of their ranks.',
          ],
          marginNote:
            'The recitations differ concerning two of the twelve. The scribe sets down the common version, and takes no part.',
        },
      ],
    },
    {
      id: 'the-two-faiths',
      title: 'The Argument',
      icon: 'mdi:scale-balance',
      blurb: 'Of the Worthy, the Many, and the ladder between them',
      entries: [
        {
          id: 'the-worthy',
          kind: 'account',
          title: 'The Worthy',
          subtitle: 'Of Mereonism, the greater faith',
          icon: 'game-icons:two-coins',
          paragraphs: [
            'Their creed in a single breath: power must be earned; the worthy rise; and unequal endings are the proof of unequal merit. Mereonism teaches that Manus built the justest of all possible worlds, wherein nothing is given and nothing is lost beyond recall; and that to complain of your rung is to confess something of your climbing.',
            'Their founding book is a thick gathering of sermons and ledger-parables named The Weal of Wanderers, set down by the preacher Adom the Sifter, who taught that the ladder needs no shepherd, for it herds itself. Mereons quote him as merchants quote prices: from memory, and in the midst of the bargain.',
            'The doctrine gives the same deed a different name according to the pews. The church names the taking of cores merit; the merchants name it investment; the great name it ownership; wanderers name it levelling up. The cunning of the faith, and the mark by which you may know it, is that of the strong it asks nothing, save that they go on winning.',
          ],
          quote: {
            text: 'No wanderer hauls cores for love of the village; and yet the village eats.',
            attribution: 'Adom the Sifter, The Weal of Wanderers',
          },
        },
        {
          id: 'the-many',
          kind: 'account',
          title: 'The Many',
          subtitle: 'Of the Uncored, who reckon otherwise',
          icon: 'game-icons:campfire',
          paragraphs: [
            'Their creed in a single breath: no soul should be measured by the count of the cores it owns. The Uncored hold that every core is some creature\u2019s spent life; and their customary saying concerning the great and the good is not set down in courteous company, though all have heard it.',
            'They hold their goods in common, and by conviction. In the camps of the Uncored the cores are pooled in an open chest, and whoever sits at the fire is fed, and costs are borne according to need. The Equal Flame keep fires at which any may cook and which none may claim. The Red Choir are famed for work-songs of too many verses, having, as the Mereons complain, but a single subject.',
            'Their word for the gatherers of cores, wanderers not excepted, is Corekeeper, and it bites because it is true. Of their fires be warned fairly: the supper is free, and in time someone will ask, with all courtesy, what it is you carry. Saints they are not; and to the question of how any soul is to grow strong enough to stand against the Apostles, their answer is thus far silence. Yet none has left an Uncored fire hungry; and in Corpus that sentence does more work than most scripture.',
          ],
          quote: {
            text: 'You who carry nothing: what can they take?',
            attribution: 'The closing line of an old Uncored pamphlet',
          },
        },
      ],
    },
    {
      id: 'legendary-ground',
      title: 'Legendary Ground',
      icon: 'solar:fire-bold',
      blurb: 'Of the Firelands, of Frostsink, and of the edges of the map',
      entries: [
        {
          id: 'the-forgewrights',
          kind: 'account',
          title: 'The Forgewrights',
          subtitle: 'A name given by whoever first plundered their anvils',
          icon: 'game-icons:anvil',
          paragraphs: [
            'Long ere any wanderer now living first woke, a people dwelt in the land that is now the Firelands. The Forgewrights we call them; but the name is ours, not theirs. Their own name for themselves has not come down to us.',
            'What has come down is stone and iron, and it reads as ambition reads. Forge-camps that worked metal by the land\u2019s own heat, arming at a pace no village requires. Anvils made for hands of human measure. Bastions whose walls face outward upon every side; whence it is plain that they knew not from what quarter the answer would come, or that it came from all quarters at once. Against wolves, none so fortifies.',
            'The ruins bespeak a people of climbers: a whole civilisation ordered about the ascent, that reached higher than any has reached since. The chronicle is smug concerning their end and silent concerning all else. No writing of theirs has ever been found whole; and the ruins hold no bodies, whereat none wonders who knows whither the dead of this world go.',
          ],
        },
        {
          id: 'the-scorching',
          kind: 'fragment',
          title: 'The Scorching',
          subtitle: 'Of their end, so far as it is written',
          icon: 'solar:fire-bold',
          paragraphs: [
            'Something ended them, and left the Firelands in its wake: earth burnt black, vents of ember, ground that holds its dreadful heat as other ground holds the dew. The mountains of fire burn yet. Whatever was done there was done thoroughly.',
            'What hand dealt the blow, no record tells. Some hold that it was an answer from on high, rendered unto a people who had climbed too well; others, that their own devices escaped them in the one hour they could least afford it. The chronicle offers only its accustomed comfort: the ladder holds; ask the ash.',
            'Yet one thing the reckoning itself demands, whatever burned: nothing leaves the ladder. Whoever they were, they died, and returned upon some rung or other, and are climbing again, or are not, scattered and nameless as all the rest. The ruins are no tomb. They are the tally of a very great attempt.',
          ],
        },
        {
          id: 'the-dark-doors',
          kind: 'fragment',
          title: 'The Dark Doors',
          subtitle: 'Of portals and circles that do nothing, as yet',
          icon: 'game-icons:portal',
          paragraphs: [
            'Among the ruins stand gates, wrought beyond any doubt of purpose, and every one of them dark. No wanderer has ever wakened one. The rumour divides as rumour will: the hopeful say the Forgewrights passed out through them ahead of the end; the fearful say that through them came the answer to their ambition. Both keep their distance from the doors, which tells you what both believe.',
            'Stranger still are the circles of obelisks: standing stones in careful rings, doing nothing that any eye can mark, in a land where a people once worked the energy of souls at a scale no battlefield affords. What the circles wrought, if ever they wrought anything, is not recorded.',
            'Those who have camped within one report nothing amiss. Then, commonly, they add that they would not do it again.',
          ],
        },
        {
          id: 'the-frostsink',
          kind: 'fragment',
          title: 'Frostsink',
          subtitle: 'The other legendary disc',
          icon: 'mdi:snowflake',
          paragraphs: [
            'Far from the place of waking, beyond the common snows, lie bowls of ice that none mistakes for weather. A disc is Frostsink: ring within ring of ever colder ground, crevasses that do not close at your back, and at the height of it a Cryocore, which seems to drink the very motion from the air.',
            'No ruin of the Forgewrights marks these places, and no Address names them. Those who have reached one bring back the same brief report: the cold is the purpose; the centre is worse; and the road home is longer than the road in.',
            'Whether Frostsink is a gift, or a warning, or a remnant of something older than the Claim Age, is nowhere written. This page is left torn of set purpose.',
          ],
          marginNote: 'Bear fire and good company, and know your way out.',
        },
      ],
    },
    {
      id: 'torn-pages',
      title: 'Torn Pages',
      icon: 'game-icons:secret-book',
      blurb: 'What the copyist could not finish',
      entries: [
        {
          id: 'the-far-shore',
          kind: 'fragment',
          title: 'The Far Shore',
          subtitle: 'Of what the ocean is hiding',
          icon: 'game-icons:spiral-shell',
          paragraphs: [
            'The ocean is the rim of the known world, and of another shore no one has brought report. Sit a moment with that sentence: not that none has found one. That none has brought report of one.',
            'The Apostle of Transportation calls the rim routes not yet sailed; which is a claim, and no map. The sailors go not far enough out to gainsay him; and those who swore they would go have not come back to the same fires.',
          ],
          marginNote:
            'The copyist left the rest of this page blank. Of set purpose, I deem.',
        },
        {
          id: 'the-summit',
          kind: 'fragment',
          title: 'The Summit',
          subtitle: 'How many rungs there be, and what stands at the top',
          icon: 'mdi:stairs-up',
          paragraphs: [
            'The true shape of the ladder is nowhere drawn: not in scripture, not in the Addresses, not in any book this scribe has searched. The only summit ever published is this: twelve Apostles, and then Manus. What lies between your rung and theirs, and how far beneath you the whole descends, of that no tale tells.',
            'It may be that none knows. It may be that someone does, and judges the number ill for the spirits of climbers, in the one direction or in the other.',
          ],
        },
        {
          id: 'the-sealed-page',
          kind: 'sealed',
          title: '? ? ?',
          subtitle: 'The page the binding refused',
          icon: 'game-icons:black-book',
          paragraphs: [],
          sealNote:
            'Seven marks were pressed into the original, so hard that they scored the boards beneath. The writing between them did not survive the copying; and the one copyist who claimed to have read it declined, firmly, to attempt it twice.',
        },
      ],
    },
  ];

/**
 * Bound volumes of the series. Each book reuses the same reader UI with its
 * own title, subtitle, cover theme, and chapter subset.
 */
export const DEFINING_PLAZA_LORE_BOOKS: readonly PlazaLoreBookDefinition[] = [
  {
    id: 'book-i-lands',
    volumeLabel: 'Book I',
    title: 'Of Lands and Airs',
    subtitle:
      'Concerning Corpus, its bands, and the weather that kills without apology.',
    blurb: 'The world, the fourteen countries, heat and cold',
    icon: 'mdi:earth',
    themeId: 'lands',
    chapterIds: ['the-world'],
  },
  {
    id: 'book-ii-founder',
    volumeLabel: 'Book II',
    title: 'Of the Quiet Hand',
    subtitle:
      'Of Manus, who built the contest, and the gifts that never make the ladder needless.',
    blurb: 'The Founder, his Addresses, and the succession he will not explain',
    icon: 'game-icons:holy-symbol',
    themeId: 'founder',
    chapterIds: ['the-founder'],
  },
  {
    id: 'book-iii-climb',
    volumeLabel: 'Book III',
    title: 'Of Climb and Core',
    subtitle:
      'That all things return, and that survival is counted in purple orbs.',
    blurb: 'The ladder, Spritcore, the Spill, and Soulbreak',
    icon: 'game-icons:ladder',
    themeId: 'climb',
    chapterIds: ['the-ladder', 'spritcore'],
  },
  {
    id: 'book-iv-road',
    volumeLabel: 'Book IV',
    title: 'Of Fire and Flesh',
    subtitle:
      'Hunger, tools, claims, and the beasts whose temper is a covenant.',
    blurb: 'Craft of the road, wildlife, the Cucco, and the pot',
    icon: 'game-icons:campfire',
    themeId: 'road',
    chapterIds: ['the-craft', 'beasts-and-birds'],
  },
  {
    id: 'book-v-crown',
    volumeLabel: 'Book V',
    title: 'Of Crown and Creed',
    subtitle:
      'Twelve stewards who own what you need, and the argument that will not end.',
    blurb: 'The Apostles, Mereonism, and the Uncored',
    icon: 'mdi:crown',
    themeId: 'crown',
    chapterIds: ['the-twelve', 'the-two-faiths'],
  },
  {
    id: 'book-vi-edges',
    volumeLabel: 'Book VI',
    title: 'Of Ash, Ice, and Torn Leaves',
    subtitle:
      'Edges of the map, ruins that remember ambition, and pages the binding refused.',
    blurb: 'Firelands, Frostsink, and the sealed remainder',
    icon: 'solar:fire-bold',
    themeId: 'edges',
    chapterIds: ['legendary-ground', 'torn-pages'],
  },
] as const;
