# Disease and Immunity

- **lore-id:** `disease-and-immunity`
- **Canon status:** Established (all sixteen diseases, immune factor, incubation, per-species meat intensity), Proposed (folk medicine framing)
- **Sources:** `definingWorldPlazaEntityDiseaseRegistry.ts`, `definingWorldPlazaEntityImmuneSystemConstants.ts`, `resolvingPlazaMechanicsImmuneSystemGuide.ts`, `definingWildlifeMeatRegistry.ts`

Corpus has no doctors, so it has folk medicine instead: a body of hard-won knowledge about which meats sicken, how long a sickness sleeps before it shows, and what surviving it buys you. This file is the lore frame for the disease system; the mechanics guide holds the numbers.

## The sicknesses

Each disease is tied to a source animal, and wanderer knowledge is organized the same way ("never eat raw boar" travels better than a parasite name):

| Sickness          | Source animals (examples)           | Wanderer shorthand                                    |
| ----------------- | ----------------------------------- | ----------------------------------------------------- |
| Salmonellosis     | Chicken, ostrich, turtle, tortoise  | "Gut rot. Cook your birds."                           |
| Cucco Rage        | Aggressive chicken                  | See [`species/the-cucco.md`](../species/the-cucco.md) |
| Feline Gut        | Cats, shepherd-dog                  | "House-cat gut. Faster than poultry rot."             |
| Chronic Wasting   | Deer, stag                          | "The slow one. Fire doesn't always kill it."          |
| Trichinellosis    | Boar, pig                           | "Worms in the muscle."                                |
| Mad Cow           | Cow, bison, bull, buffalo, yak      | "The other slow one."                                 |
| Liver Fluke       | Sheep, oryx, camel, ram             | "Flukes. Mutton wants a long cook."                   |
| Tusk Fluke        | Elephant, rhino, mammoth            | "Heavy fluke. Giants carry heavy parasites."          |
| Sleeping Sickness | Zebra, antilope, giraffe            | "The drowse. Waves of it."                            |
| Equine Drowse     | Horse, donkey                       | "Hoof drowse. Same family, different stock."          |
| Wolf Fever        | Grey-wolf, omega-wolf               | "Locks your legs. No jumping, no rolling."            |
| Bear Worm         | Brown-bear, polar-bear              | "Weakness, then the bleeding starts."                 |
| Toxoplasmosis     | Lion, lioness, tiger, jaguar, llama | "Cat sickness."                                       |
| Primate Fever     | Monkey, chimp                       | "Tree meat fever."                                    |
| Scavenger Rot     | Hyena                               | "Bone-yard rot."                                      |
| Vibrio Infection  | Crocodile, hippo                    | "Swamp meat, swamp problems."                         |

## Incubation: the cruel part

Sickness in Corpus sleeps before it wakes. A wanderer can eat bad meat, feel fine for in-game days, and fall ill far from camp. Lore copy should lean on this: the scariest thing about sickness here is not the symptoms, it is the waiting, and the veterans' habit of counting backward ("what did I eat three days ago?") when the badge appears.

## The prion exception

Two sicknesses, Chronic Wasting and Mad Cow, can survive the cookfire (at low odds). This is real prion behavior and the setting's most grounded horror. Wanderer culture treats deer and beef with specific respect: cooked is safer, never safe. The phrase "fire doesn't always kill it" is canonical.

## Immunity: the body keeps score

Surviving sickness strengthens the survivor. The immune factor (0 to 100 in mechanics) is, in fiction, the difference between a fresh wanderer and a scarred one: the veteran gets sick less, suffers shorter, and can carry permanent immunity to sicknesses already beaten.

This gives Corpus its one form of earned seniority. There are no levels or titles, but a wanderer who can eat around a campfire without checking the pot has proven something, and everyone present knows it. Lore copy can treat visible immunity casually eating risky food as a quiet flex.

## Writing rules

- Diseases use real-world-adjacent names on purpose. Keep new diseases in that register: clinical name, folk shorthand, animal source.
- Never introduce a cure item. The setting's answer to sickness is prevention, endurance, and immunity, in that order.
- Cooking is sacred. The campfire is the most important safety technology in Corpus, and copy should treat cooks with respect.
