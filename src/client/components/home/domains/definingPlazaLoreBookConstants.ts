/**
 * Content and structure for the in-game lore book (Codex Lore section).
 *
 * Every entry is grounded in the world bible under `lore/` and in shipped
 * systems (biomes, Spritcore spill/commit, wildlife, disease, harvest).
 * Open questions (`lore/meta/open-questions.md`) stay open: those pages ship
 * as fragments or sealed entries, never as answers.
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

/** Book title shown on the cover header. */
export const DEFINING_PLAZA_LORE_BOOK_TITLE = 'A Wanderer\u2019s Corpus';

/** Book subtitle in the cover header. */
export const DEFINING_PLAZA_LORE_BOOK_SUBTITLE =
  'Collected accounts, copied by hand. Some pages did not survive the copying.';

/** Accessible label for the lore book dialog. */
export const LABELING_PLAZA_LORE_BOOK_DIALOG = 'Lore book';

/** Accessible label for the chapter bookmark list. */
export const LABELING_PLAZA_LORE_BOOK_CHAPTER_LIST = 'Lore book chapters';

/** Title placeholder for sealed entries. */
export const DEFINING_PLAZA_LORE_BOOK_SEALED_TITLE = '? ? ?';

/** Ordered chapters and entries of the lore book. */
export const DEFINING_PLAZA_LORE_BOOK_CHAPTERS: readonly PlazaLoreBookChapter[] =
  [
    {
      id: 'the-world',
      title: 'The World',
      icon: 'mdi:earth',
      blurb: 'Corpus, the bands, and the weather that kills',
      entries: [
        {
          id: 'corpus',
          kind: 'account',
          title: 'Corpus',
          subtitle: 'The name on everything',
          icon: 'mdi:earth',
          paragraphs: [
            'The world is named Corpus. It is Manus\u2019s name for his own creation, and it means body: one body, many parts, each part working. That is how he talks about it in his Addresses, and nobody who has spent a season here misses the implication about which parts we are.',
            'One continuous land holds every biome a wanderer can walk. Every wanderer measures distance from spawn, because danger does too: the ground near where you woke is gentle, and it stops being gentle the farther you walk. Old hands read this as deliberate. The ladder starts everyone on an easy rung.',
            'Day and night keep honest time, and the animals keep it with them. Deer move at dusk, wolves own the dark, lions patrol at dawn. Temperature is real at both ends. Almost nothing else in Corpus runs on a schedule, so learn the ones that do.',
          ],
          quote: {
            text: 'the generosity of the Founder of Corpus',
            attribution: 'Inscription found on a road nobody remembers building',
          },
        },
        {
          id: 'the-bands',
          kind: 'account',
          title: 'The Bands',
          subtitle: 'Fourteen biomes, sorted by how hard they are to reach',
          icon: 'ph:mountains',
          paragraphs: [
            'The biomes tile outward by rarity. Common ground sits near the familiar middle: plains, forest, and snowy plains, where most of us learned to cook and most of the first claims went up. Uncommon bands follow: beach, savanna, and bare rocky flats.',
            'Rare ground is a longer walk: jungle, desert, swamp, badlands, and the open ocean at the rim. Mythic meadow (the flower forest) is scarce enough that superstition still protects it. At the far edge of anyone\u2019s travels sit the two legendary discs: the Firelands, scorched ground running a constant heat, and Frostsink, an ice bowl around a Cryocore where the cold tries for absolute zero.',
            'The hazards have names, and the names matter. Scorch is ambient heat, and it is honest: it tells you it is killing you the whole time. Frost slows the body toward a full stop, then builds frostbite if you linger. Burn is lava, and lava does not negotiate. The swamp teaches the other lesson: the danger you can see in the badlands, you do not see here.',
          ],
          marginNote:
            'The beach is neutral ground by custom. Nobody fights over sand.',
        },
        {
          id: 'heat-and-cold',
          kind: 'account',
          title: 'Heat and Cold',
          subtitle: 'Comfort has a floor and a ceiling',
          icon: 'mdi:thermometer',
          paragraphs: [
            'Corpus does not care about your opinion of the weather. Stay too hot and Scorch drains you by the second. Stay too cold and Frost does the same, while your walk and run slow toward a stop. Campfires warm the tiles around them. Ice and frozen water pull the other way.',
            'Prolonged cold stacks frostbite: chilly, then cold, then shivering, then worse. Warm ground peels those stacks back. Heat and cold resistance buy you time. Immunity (some skins are born with it) buys you a different life entirely.',
            'Night cools the whole map a little. Plan your crossings with that in mind, or wake up slower than you went to sleep.',
          ],
          marginNote: 'If the air hurts, leave. Pride is not a resistance buff.',
        },
      ],
    },
    {
      id: 'the-founder',
      title: 'The Founder',
      icon: 'game-icons:holy-symbol',
      blurb: 'Manus, his Addresses, and his gifts',
      entries: [
        {
          id: 'manus',
          kind: 'account',
          title: 'Manus',
          subtitle: 'The one god, who will confirm it himself',
          icon: 'game-icons:holy-symbol',
          paragraphs: [
            'There is exactly one god in Corpus, his name is Manus, and everyone knows it. Not believes. Knows, the way you know the sun comes up. Nobody debates whether he exists. They debate whether he is right, and he has already published his answer, several times, in his own voice.',
            'He made the world as a contest. Not a garden, not a punishment: a contest, to find a being worthy of surpassing him and taking his place. He has never hidden this. Being surpassed, he says, is the whole venture.',
            'His one question, asked of every soul on every rung: can you rise? His law is four words, and every child of Corpus learns them before they learn to cook meat: lose, return, grow, try again.',
          ],
          quote: {
            text: 'I did not build you a paradise. Paradise makes nothing. I built you a chance.',
            attribution: 'From an Address of Manus, quoted from memory everywhere',
          },
        },
        {
          id: 'the-quiet-hand',
          kind: 'account',
          title: 'The Quiet Hand',
          subtitle: 'The hand that shapes everything and touches nothing',
          icon: 'ph:hand-eye',
          paragraphs: [
            'Manus never punishes anyone. Not once, not ever, not personally. Starve on poor land, die to a wolf you wounded three lives ago: none of that is Manus reaching down. It is the machine running exactly as designed, while its builder watches, warmly. His common epithet is the Quiet Hand, and it is not an insult. Mereons use it in prayer.',
            'And he gives. This is documented, not rumor. Healing wells appear near battlefields that ran long. Granaries are found full after famines. Whole roads have been laid overnight, signed. The gifts are real, they help real people, and every one arrives with his name on it and a lesson attached. The well heals you so you can climb again. The granary feeds the village so the village can produce climbers.',
            'Manus has never once given a gift that made the ladder unnecessary. Point this out to a Mereon and they will explain, patiently, that this is precisely the wisdom of it.',
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
          subtitle: 'What he wants a successor for',
          icon: 'ph:sparkle',
          paragraphs: [
            'He says the venture completes itself when someone rises. He says it warmly, and he appears to mean it, and that is the whole of what anyone actually knows.',
            'Ask a Mereon what Manus wants a successor for and you will get an hour. Ask an Uncored and you will get a shorter answer and a pamphlet. Ask the Addresses and you will find the question handled the way he handles every question he likes: praised, thanked, and left standing.',
            'This copyist has read every collected Address twice and will record only this: he wanted to be asked.',
          ],
        },
      ],
    },
    {
      id: 'the-ladder',
      title: 'The Ladder',
      icon: 'game-icons:ladder',
      blurb: 'Death, return, and what climbs back',
      entries: [
        {
          id: 'the-arrangement',
          kind: 'account',
          title: 'The Arrangement',
          subtitle: 'Everything comes back',
          icon: 'game-icons:ladder',
          paragraphs: [
            'Everything that dies, Manus brings back. Monsters, kings, wanderers, the wolf you killed for its meat. Death is a reset, not an exit. Nothing is allowed to leave the ladder, because the ladder only works if the weak can keep climbing until, some life, they are not weak anymore.',
            'You have seen the proof yourself. When you die, the world names how it happened and never where you went, because you did not go anywhere. Manus put you back on your rung. The herds refill and the packs return for the same reason: an animal is not a lesser soul to him. It is a slower climber.',
            'Wanderers joke about dying the way sailors joke about storms. Keep the jokes. Keep the weight under them too. Some souls die and return and die and return and stay at the bottom, forever, and the ladder does not care. It is fair the way gravity is fair: same rules for everyone, no interest in outcomes.',
          ],
          quote: {
            text: 'They have not finished.',
            attribution:
              'An Address of Manus, asked about the ones who never rise',
          },
        },
        {
          id: 'your-kills-remember',
          kind: 'account',
          title: 'Your Kills Remember',
          subtitle: 'On grudges that outlast bodies',
          icon: 'game-icons:wolf-howl',
          paragraphs: [
            'An enemy you put down comes back. Wanderers tell stories about the wolf they have killed five times, stronger each return, and the stories refuse to die. Whether every pack truly remembers your face is argued around fires. That the packs return at all is not.',
            'This is also why claims tend to hold. There is no guard to call and no court to appeal to, but the claimant will come back. You can take a plot. Keeping it against an owner who returns forever is another matter entirely.',
            'The practical advice is old and short: kill what you must, and be polite to what you merely could.',
          ],
        },
      ],
    },
    {
      id: 'spritcore',
      title: 'Spritcore',
      icon: 'game-icons:crystal-ball',
      blurb: 'The score, made portable',
      entries: [
        {
          id: 'the-core',
          kind: 'account',
          title: 'Spritcore',
          subtitle: 'Proof you survived, counted in orbs',
          icon: 'game-icons:crystal-ball',
          paragraphs: [
            'Spritcore is condensed soul energy: small purple orbs, warm to the touch, faintly humming. Everything on the ladder carries a core, and everything drops it when it dies. A Spritcore is proof that you survived, made portable.',
            'Wanderers use cores three ways you will notice on day one. They are money, because nobody argues with a currency you bleed for. They are growth, because you can Commit them into yourself: more health, harder hits, faster swings, thicker hide, longer stride. And they are rank, because the church counts them, merchants count them, and so does everyone else, whatever they claim.',
            'The arithmetic underneath is simple and nobody likes looking straight at it: for you to get stronger, something else has to become loot. The whole climb of Corpus stands on that sentence.',
          ],
          quote: {
            text: 'Nothing in Corpus is wasted. Every ending is somebody\u2019s beginning.',
            attribution: 'From an Address of Manus',
          },
          marginNote: 'The corpse\u2019s view was not recorded.',
        },
        {
          id: 'the-spill',
          kind: 'account',
          title: 'The Spill',
          subtitle: 'What death takes before it returns you',
          icon: 'game-icons:drop',
          paragraphs: [
            'Dying does not empty your pouch. It skims it. A portion of the cores you were carrying scatters at the corpse as ground loot, and a smaller portion of what you already Committed into yourself peels off with it. You come back lighter. That is the point.',
            'Veterans argue about the exact fractions the way cooks argue about salt. The lesson does not need the fractions: haul what you can afford to lose, and do not treat a fat stack as armor.',
            'Some say wealth itself draws stronger predators. This copyist has met strong predators on empty pockets and weak ones on full ones, and will not settle the rumor here.',
          ],
          marginNote: 'Pick up your own spill if you can. Someone else will.',
        },
        {
          id: 'soulbreak',
          kind: 'account',
          title: 'Soulbreak',
          subtitle: 'The one wound veterans fear',
          icon: 'mdi:heart-flash',
          paragraphs: [
            'Most damage wounds the body. Soulbreak wounds the core directly: a strike that skips the meat and lands on the thing Manus keeps score with. No armor made of matter can catch it, because it was never aimed at matter.',
            'Wanderers who survive one describe it the same way: cold, silent, and wrong, like a note played on a string inside them.',
            'It is the one injury that scares veterans more than dying. Dying is temporary. The core is not supposed to be touchable.',
          ],
        },
      ],
    },
    {
      id: 'the-craft',
      title: 'The Craft',
      icon: 'game-icons:wood-axe',
      blurb: 'Hunger, tools, claims, and staying alive',
      entries: [
        {
          id: 'the-fire',
          kind: 'account',
          title: 'The Fire',
          subtitle: 'Hunger, cooking, and the campfire rule',
          icon: 'game-icons:campfire',
          paragraphs: [
            'Hunger is a clock. Walk drains it. Run drains it faster. Starve long enough and your health starts answering for you. Berries buy a little time. Cooked meat buys a meal. Raw meat buys a story you will tell later if you survive it.',
            'The campfire is the most important tool in Corpus. Cook wildlife cuts before you eat them. Fire does not make every cut safe (a few slow sicknesses can ride a bad cook), but it turns most dinners from gambles into food. A lit fire also warms the ground around it, which matters when Frost is chewing your legs.',
            'When you are well fed, the body recovers stamina faster. When you are starving, sprint and jump leave you, and the climb gets shorter in every direction.',
          ],
          marginNote: 'Respect cooks. They keep more wanderers alive than swords do.',
        },
        {
          id: 'wood-and-stone',
          kind: 'account',
          title: 'Wood and Stone',
          subtitle: 'Chop, Mine, Pick',
          icon: 'game-icons:stone-pile',
          paragraphs: [
            'Equip an axe and a tree becomes Chop. Equip a pickaxe and a boulder becomes Mine. Floor pebbles need no tool: Pick puts one stone in the bag if you have room. Tall trunks and mega-boulders take longer. Keep swinging until a stump or empty patch remains.',
            'Ore veins answer the same pick, and they are how wanderers fund better tools. Stone and wood are how they fund walls. None of this is glamorous. All of it is how claims stop being wishes.',
            'The sound of a good swing is half the craft. Bad aim is the other half. Stand where the tree wants to fall, not where your pride wants to stand.',
          },
        },
        {
          id: 'wild-gather',
          kind: 'account',
          title: 'Wild Gather',
          subtitle: 'Berries, petals, and knowing when to stop',
          icon: 'mdi:flower',
          paragraphs: [
            'Corpus feeds the careless as well as the careful. Berries and fruit buy hunger back without a fire. Coffee cherries wake you. Tea leaves calm you. Both grow where shrubs do, and neither replaces a real meal.',
            'Bright petals are pickable. Dull ones are not worth the reach. Raw flowers can gift a small effect, and they can also gift a sickness with a pretty name. Eat too many petals in a day and Petal Sickness teaches the limit personally.',
            'The Herbarium is how careful wanderers keep score of plants. Study what you pick. The land repeats itself; your notes should too.',
          ],
        },
        {
          id: 'the-claim',
          kind: 'account',
          title: 'The Claim',
          subtitle: 'Ground you mean to keep',
          icon: 'mdi:land-plots',
          paragraphs: [
            'A claim is a plot you mark as yours in a world that resurrects everyone who wants it back. Start with a campfire. Build outward when you can defend what you built. Neighbors will appear. Some will be polite.',
            'Willus Quill holds the land in trust for Manus, on paper, with terms. What wanderers claim, they claim inside that ledger. The Apostle does not come down to argue fence lines. Other wanderers do.',
            'Because death is temporary, a claim is never won once. It is held, lost, retaken, and held again. Plan for the return trip, including your own.',
          ],
          marginNote: 'Empty land is only empty until someone lights a fire on it.',
        },
      ],
    },
    {
      id: 'beasts-and-birds',
      title: 'Beasts and Birds',
      icon: 'mdi:paw',
      blurb: 'What lives here, how it hunts, and what it leaves in the pot',
      entries: [
        {
          id: 'old-climbers',
          kind: 'account',
          title: 'Old Climbers',
          subtitle: 'Why veterans read name tags first',
          icon: 'mdi:paw',
          paragraphs: [
            'Every animal in Corpus is an individual, and the world itself seems to announce them. A glance tells you size and temper, the way you can tell a big dog from a small one. Trust the glance. It is the cheapest survival tool you own.',
            'The extreme upper tiers are the ones to take seriously. An animal marked Demon or Mythical has grown far past what one lifetime allows, because it has had more than one: killed, returned, grew, tried again, across more lives than anyone has counted.',
            'A Mythical bear is not a freak of nature. It is a very old, very patient success story, and the reason veterans check name tags before checking anything else.',
          ],
        },
        {
          id: 'reading-temper',
          kind: 'account',
          title: 'Reading Temper',
          subtitle: 'What the animal promised before it moved',
          icon: 'game-icons:wolf-howl',
          paragraphs: [
            'Temperament is a contract. Passive and skittish animals run when hurt. Retaliators warn on their ground, then fight: boars, bears, rhinos, and the other heavy opinions. Predators hunt. Ambushers wait in water. Pack hunters shadow, surround, and rush. Stalkers trail alone until weakness opens a window.',
            'Night changes the roster. Wolves and hyenas own the dark. Some elites only walk while the sun is down, and they do not politely wait for you to finish camping.',
            'Hitting a predator\u2019s favorite prey can turn the hunter on you. Stealing a meal mid-chew does the same, louder. Corpus has a food chain. You are on it.',
          ],
          marginNote: 'If it warned you, believe it.',
        },
        {
          id: 'the-cucco',
          kind: 'account',
          title: 'The Cucco',
          subtitle: 'On aggressive chickens, with respect',
          icon: 'game-icons:chicken',
          paragraphs: [
            'Most chickens in Corpus are ordinary birds. Some are not. The aggressive ones attack on sight, fight with a fury completely out of proportion to their size, and have earned a separate name in wanderer speech: the Cucco.',
            'The customs are settled. You do not test whether a chicken is a Cucco; you assume, and you walk wide. Killing one is legal, survivable, and still considered tempting fate. Calling a person a Cucco means small, furious, and not worth the fight they will absolutely give you.',
            'Eat the raw meat and the bird\u2019s fury rides it into you. It feels like a gift at first, speed and strength, which is exactly how it recruits; then the flock takes the wheel. Cooked properly, the same fury settles into something useful. Wanderer cooks are quietly proud of this: the angriest animal in Corpus, reduced to a good dinner.',
          ],
          quote: {
            text: 'A Cucco is not angry at you. A Cucco is angry at everything, and you happen to be closest.',
            attribution: 'The standard telling, around any fire',
          },
        },
        {
          id: 'the-pot-keeps-score',
          kind: 'account',
          title: 'The Pot Keeps Score',
          subtitle: 'Sickness, waiting, and earned immunity',
          icon: 'fluent-emoji:pot-of-food',
          paragraphs: [
            'Corpus has no doctors, so it has knowledge instead, and the knowledge is organized by animal. Never eat raw boar; the worms live in the muscle. Cook your birds. Mutton wants a long cook. Swamp meat, swamp problems. The Pathology ledger fills itself as you learn the hard way.',
            'The cruel part is the waiting. Sickness here sleeps before it wakes. You can eat bad meat, feel fine for hours, and fall ill far from camp, which is why veterans count backward when the badge appears: what did I eat yesterday? A few slow sicknesses can survive the cookfire at bad odds. Fire does not always kill it. Cooked is safer. Never safe.',
            'What survival buys you is real. A body that has beaten a sickness gets sick less, suffers shorter, and can carry the immunity for good. There are no titles in Corpus, but a wanderer who eats around a strange campfire without checking the pot has proven something, and everyone present knows it.',
          ],
          marginNote: 'The campfire is the most important tool in Corpus. Respect cooks.',
        },
        {
          id: 'the-study',
          kind: 'account',
          title: 'The Study',
          subtitle: 'Looking long enough to learn the name',
          icon: 'mdi:magnify',
          paragraphs: [
            'Sight is cheap. Study costs time. Stand over a carcass long enough and the Bestiary writes a cleaner page. Study a petal in the bag and the Herbarium does the same. Ore and stumps answer the Lapidary. The more you study a kind, the more of its truth the guides will show you.',
            'This is not prayer. It is note-taking with blood under the fingernails. Wanderers who skip it keep rediscovering the same teeth.',
            'At the far end of animal study, some say a form can be worn. This copyist has seen the claim made. The details belong to whoever finishes the count.',
          ],
        },
      ],
    },
    {
      id: 'the-twelve',
      title: 'The Twelve',
      icon: 'mdi:crown',
      blurb: 'The Apostles, who own what you need',
      entries: [
        {
          id: 'the-stewards',
          kind: 'account',
          title: 'The Stewards',
          subtitle: 'Loyal, worshipful, and not gods',
          icon: 'mdi:crown',
          paragraphs: [
            'Manus appointed twelve Apostles to run Corpus for him: hand-picked stewards, completely loyal, worshipful without reservation. They are not gods. Corpus has one god, and the Apostles would be the first to say so, at length, while having you escorted out.',
            'What they are is owners. Each governs one of the twelve things people need to live, and they do not rule people directly. They rule the stuff people cannot do without, which turns out to be the better lever. A wanderer can dodge a king. Nobody dodges lumber.',
            'To challenge Manus, a mortal must best all twelve first. The Apostles take this seriously as a duty, not an insult: they are the ladder\u2019s final rungs, and screening challengers is part of the job. Beating one grants nothing but the right to keep climbing. You do not inherit the granaries. Nobody has bested all twelve. Nobody has come close enough for the question of what happens next to be anything but theology.',
          ],
        },
        {
          id: 'the-names',
          kind: 'account',
          title: 'The Names and the Holdings',
          subtitle: 'As commonly recited',
          icon: 'game-icons:scroll-unfurled',
          paragraphs: [
            'Willus Quill holds the land, every parcel of it, in trust for Manus, on paper, with terms. Rockless Fellus holds what the land contains: ore, oil, timber, tithed to the core. Carnegus turns mountains into girders and calls it the holiest act available. Dominus owns the buildings, and his name is on them, large.',
            'Stanous Black makes the tools, and among the twelve he is the closest thing to beloved, because his tools work. Herford owns the machines and talks about rhythm the way priests talk about grace. Vander owns the roads, the rails, and the ports; refuse them and enjoy the swamp. Amboser keeps light, heat, and current, and calls energy the breath of the ladder.',
            'Leon Astronavis moves everything that moves, and openly says the ocean rim and the sky are just unshipped routes. Zeche Tore owns the patterns: craft secrets, formulas, the know-how itself. Quacker Berg governs word, signal, and record; he gives his services away free, which the other eleven found hilarious right up until he knew everything. And Japa Morgus is the Apostle the other Apostles borrow from, which tells you the ranking that actually matters.',
          ],
          marginNote:
            'Recitations vary on two of the twelve. The scribe records the common version and takes no side.',
        },
      ],
    },
    {
      id: 'the-two-faiths',
      title: 'The Argument',
      icon: 'mdi:scale-balance',
      blurb: 'The Worthy, the Many, and the ladder between',
      entries: [
        {
          id: 'the-worthy',
          kind: 'account',
          title: 'The Worthy',
          subtitle: 'Mereonism, the dominant faith',
          icon: 'game-icons:two-coins',
          paragraphs: [
            'The creed in one breath: power must be earned, the worthy rise, and unequal outcomes are proof of unequal merit. Mereonism holds that Manus built the fairest possible world, one where nothing is given and nothing is permanently lost, and that complaining about your rung is a confession about your climbing.',
            'The founding text is a thick collection of sermons and ledger-parables called The Weal of Wanderers, set down by the preacher Adom the Sifter, who taught that the ladder needs no shepherd because it herds itself. Mereons quote him the way merchants quote prices, from memory and mid-transaction.',
            'Doctrine names the same act differently depending on the pews. The church calls core-taking merit. Merchants call it investment. Nobles call it ownership. Wanderers call it leveling up. The faith\u2019s genius, and its tell, is that it asks nothing of the strong except to keep winning.',
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
          subtitle: 'The Uncored, who count differently',
          icon: 'game-icons:campfire',
          paragraphs: [
            'Their creed in one breath: no soul should be measured by how many cores it owns. The Uncored hold that every core is someone\u2019s spent life, and their standard line about the great and the good is not printed in polite company, though everyone has heard it.',
            'They are collective by conviction. Uncored camps pool cores in an open chest, feed whoever sits at the fire, and split costs by need. The Equal Flame keep communal fires anyone may cook at and no one may claim. The Red Choir are known for work songs with too many verses and, according to Mereonist complaints, exactly one subject.',
            'Their word for accumulators, wanderers included, is Corekeeper, and it lands because it is accurate. Fair warning about their fires: dinner is free, and someone will eventually, politely, ask what you are carrying. They are not saints, and their answer to how anyone grows strong enough to challenge the Apostles is, so far, silence. But no one leaves an Uncored fire hungry, and in Corpus that sentence does more work than most scripture.',
          ],
          quote: {
            text: 'You who carry nothing: what can they take?',
            attribution: 'Closing line of an old Uncored pamphlet',
          },
        },
      ],
    },
    {
      id: 'legendary-ground',
      title: 'Legendary Ground',
      icon: 'solar:fire-bold',
      blurb: 'Firelands, Frostsink, and the edges of the map',
      entries: [
        {
          id: 'the-forgewrights',
          kind: 'account',
          title: 'The Forgewrights',
          subtitle: 'A name invented by whoever first looted their anvils',
          icon: 'game-icons:anvil',
          paragraphs: [
            'Long before any current wanderer woke, a people lived in what is now the Firelands. We call them the Forgewrights, and the name is ours, not theirs. Their own name for themselves did not survive.',
            'What survives is stone and iron, and it reads like ambition. Forge camps that worked metal with the land\u2019s own heat, arming at a pace no village needs. Anvils scaled for human-sized hands. Bastions with walls facing outward in every direction, which means they did not know where the answer would come from, or it came from everywhere. You do not fortify like that against wolves.',
            'The ruins suggest they were climbers: a whole civilization organized around the ascent, reaching higher than anyone has since. The chronicle is smug about how it ended and vague about everything else. No intact writing of theirs has ever been found, and the ruins hold no bodies, which surprises nobody who knows where the dead go here.',
          ],
        },
        {
          id: 'the-scorching',
          kind: 'fragment',
          title: 'The Scorching',
          subtitle: 'The end, as far as it is written',
          icon: 'solar:fire-bold',
          paragraphs: [
            'Something ended them and left the Firelands behind: scorched earth, ember vents, ground that holds hard heat the way other ground holds dew. The volcanoes are still active. Whatever happened was thorough.',
            'What dealt the blow, no record says. Some wanderers hold it was an answer from above, delivered to a people who had climbed too well. Others say their own apparatus got away from them at the worst possible moment. The chronicle offers only its usual comfort: the ladder holds; ask the ash.',
            'One thing the arithmetic insists on, whatever burned: nothing leaves the ladder. Whoever they were, they died, returned somewhere on some rung, and are climbing again, or not, scattered and nameless like everyone else. The ruins are not a tomb. They are a scoreboard from a very good attempt.',
          ],
        },
        {
          id: 'the-dark-doors',
          kind: 'fragment',
          title: 'The Dark Doors',
          subtitle: 'Portals and circles that do nothing, so far',
          icon: 'game-icons:portal',
          paragraphs: [
            'Among the ruins stand gate structures, unmistakably deliberate, all of them dark. No wanderer has ever activated one. The rumor splits the usual way: the optimists say the Forgewrights left through them ahead of the end. The pessimists say the answer to their ambition arrived through them. Both camps keep their distance, which tells you what both camps actually believe.',
            'The obelisk circles are stranger. Standing stones in careful rings, doing nothing observable, in a land where a people once worked soul energy at a scale no battlefield provides. What the circles did, if they did anything, is not recorded.',
            'Wanderers who camp inside one report nothing unusual. Then they usually mention they would not do it again.',
          ],
        },
        {
          id: 'the-frostsink',
          kind: 'fragment',
          title: 'Frostsink',
          subtitle: 'The other legendary disc',
          icon: 'mdi:snowflake',
          paragraphs: [
            'Far from spawn, past the ordinary snow, sit ice bowls nobody mistakes for weather. Frostsink is a disc: rings of colder and colder ground, crevasses that do not close behind you, and a Cryocore at the peak that seems to drink motion out of the air.',
            'No Forgewright ruin marks these places. No Address names them. Wanderers who reach one write the same short report: the cold is the point, the center is worse, and the walk home is longer than the walk in.',
            'Whether Frostsink is a gift, a warning, or a leftover from something older than the Claim Age is not written. This page stays torn on purpose.',
          ],
          marginNote: 'Bring heat. Bring friends. Bring an exit.',
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
          subtitle: 'On what the ocean is hiding',
          icon: 'game-icons:spiral-shell',
          paragraphs: [
            'The ocean is the rim of the known world. Nobody has reported another shore. Sit with that sentence a moment: not nobody has found one. Nobody has reported one.',
            'The Apostle of Transportation calls the rim unshipped routes, which is a claim, not a map. Sailors do not go far enough to argue with him, and the ones who said they would have not come back to the same fires.',
          ],
          marginNote: 'The copyist left the rest of this page blank. On purpose, I think.',
        },
        {
          id: 'the-summit',
          kind: 'fragment',
          title: 'The Summit',
          subtitle: 'How many rungs, and what is at the top',
          icon: 'mdi:stairs-up',
          paragraphs: [
            'The ladder\u2019s exact shape is never diagrammed, not in scripture, not in the Addresses, not anywhere this scribe has searched. The only published summit is this: twelve Apostles, then Manus. What sits between your rung and theirs, and how far down the whole thing goes, is not written.',
            'Perhaps nobody knows. Perhaps somebody does, and considers the number bad for morale in one direction or the other.',
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
            'Seven marks were pressed into the original, hard enough to score the boards beneath. The text between them did not survive the copying, and the one copyist who claimed to have read it declined, firmly, to try again.',
        },
      ],
    },
  ];
