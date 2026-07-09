# Buffs catalog

All **96** buff and debuff descriptors in `DEFINING_WORLD_PLAZA_ENTITY_BUFF_REGISTRY`.

**Source of truth:** `src/client/world/health/domains/definingWorldPlazaEntityBuffRegistry.ts`

**Apply helper:** `src/client/world/health/domains/applyingWorldPlazaEntityBuff.ts`

**HUD icons:** `src/client/world/health/domains/mappingWorldPlazaEntityBuffHudIcon.ts`

## Summary by category

| Category  | Count | Primary trigger                                     |
| --------- | ----- | --------------------------------------------------- |
| defence   | 21    | Dev/mechanics toggle (`toggleBuffRef`), health hook |
| combat    | 12    | Dev/mechanics toggle                                |
| utility   | 6     | Dev/mechanics toggle, character skill               |
| character | 57    | Eat well-fed, disease grants, frostbite sync, skills, dev toggle |

---

## Defence (21)

| id                     | Polarity | Duration  | Effect summary                                   | Source / trigger                   | File to edit                              |
| ---------------------- | -------- | --------- | ------------------------------------------------ | ---------------------------------- | ----------------------------------------- |
| `iron-armor`           | buff     | toggle    | −20% incoming expected damage (defender EV ×0.8) | Mechanics / dev damage-roll toggle | `definingWorldPlazaEntityBuffRegistry.ts` |
| `heavy-armor`          | buff     | toggle    | −30% incoming expected damage (EV ×0.7)          | Mechanics / dev toggle             | same                                      |
| `tower-shield`         | buff     | toggle    | +1 block tier shift                              | Mechanics / dev toggle             | same                                      |
| `light-boots`          | buff     | toggle    | +1 dodge tier shift                              | Mechanics / dev toggle             | same                                      |
| `stabilizing-armor`    | buff     | toggle    | −30% incoming enemy variance (stability ×0.7)    | Mechanics / dev toggle             | same                                      |
| `risk-armor`           | debuff   | toggle    | +30% incoming variance                           | Mechanics / dev toggle             | same                                      |
| `defense-buff`         | buff     | toggle    | −20% incoming expected damage                    | Mechanics / dev toggle             | same                                      |
| `evasion-buff`         | buff     | toggle    | +1 dodge tier shift                              | Mechanics / dev toggle             | same                                      |
| `guard-buff`           | buff     | toggle    | +1 block tier shift                              | Mechanics / dev toggle             | same                                      |
| `fortify-buff`         | buff     | toggle    | Luck −0.5 + block bias +1 (blocked outcomes)     | Mechanics / dev toggle             | same                                      |
| `half-damage-buff`     | buff     | timed 30s | Incoming damage ×0.5                             | Mechanics / dev toggle             | same                                      |
| `braced-buff`          | buff     | toggle    | Incoming rolls forced Softened tier              | Mechanics / dev toggle             | same                                      |
| `guarded-buff`         | buff     | toggle    | Incoming rolls forced Blocked tier               | Mechanics / dev toggle             | same                                      |
| `ultra-instinct-buff`  | buff     | toggle    | Incoming rolls forced Dodged tier                | Mechanics / dev toggle             | same                                      |
| `absorb-buff`          | buff     | toggle    | Heal 25% of physical damage received             | Mechanics / dev toggle             | same                                      |
| `exposed-debuff`       | debuff   | toggle    | Incoming rolls forced Critical tier              | Mechanics / dev toggle             | same                                      |
| `vulnerable-debuff`    | debuff   | toggle    | Incoming rolls forced Lethal tier                | Mechanics / dev toggle             | same                                      |
| `condemned-debuff`     | debuff   | toggle    | Incoming rolls forced Fatal tier                 | Mechanics / dev toggle             | same                                      |
| `heat-resistance-buff` | buff     | instant   | +25% heat resistance                             | Health hook resist action          | same                                      |
| `cold-resistance-buff` | buff     | instant   | +25% cold resistance                             | Health hook resist action          | same                                      |
| `heat-tolerance-buff`  | buff     | toggle    | Comfort high **+15°C** (heat DoT starts later)   | Mechanics / dev toggle             | same                                      |
| `cold-tolerance-buff`  | buff     | toggle    | Comfort low **−15°C** (cold DoT starts later)    | Mechanics / dev toggle             | same                                      |
| `heat-weakness-debuff` | debuff   | instant   | +25% heat weakness (extra heat DoT)              | Health hook weakness action        | same                                      |
| `cold-weakness-debuff` | debuff   | instant   | +25% cold weakness (extra cold DoT)              | Health hook weakness action        | same                                      |

---

## Combat (12)

| id                           | Polarity | Duration   | Effect summary                            | Source / trigger                              | File to edit                              |
| ---------------------------- | -------- | ---------- | ----------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `power-buff`                 | buff     | toggle     | +20% expected damage (attacker EV ×1.2)   | Mechanics / dev toggle                        | `definingWorldPlazaEntityBuffRegistry.ts` |
| `rage-buff`                  | buff     | toggle     | +30% damage variance                      | Mechanics / dev toggle                        | same                                      |
| `assassin-buff`              | buff     | toggle     | Luck +0.5 + critical bias +1              | Mechanics / dev toggle                        | same                                      |
| `precision-buff`             | buff     | toggle     | Luck +0.5 (away from low rolls)           | Mechanics / dev toggle                        | same                                      |
| `true-strike-buff`           | buff     | toggle     | Lock damage to expected value             | Mechanics / dev toggle                        | same                                      |
| `lock-in-buff`               | buff     | toggle     | Lock damage to expected value             | Mechanics / dev toggle                        | same                                      |
| `all-or-nothing-buff`        | buff     | toggle     | Chaotic + variance ×1.4                   | Mechanics / dev toggle                        | same                                      |
| `siphoning-buff`             | buff     | toggle     | Heal 25% of physical damage dealt         | Mechanics / dev toggle                        | same                                      |
| `mending-buff`               | buff     | toggle     | Outgoing heals +25%                       | Mechanics / dev toggle                        | same                                      |
| `well-fed-strength-buff`     | buff     | timed 90s  | +15% expected damage (attacker ×1.15)     | Cooked wolf/lion/lioness/omega-wolf meat roll | same + `definingWildlifeMeatRegistry.ts`  |
| `well-fed-omega-skew-buff`   | buff     | timed 90s  | Luck +0.5 + critical bias +1 (right skew) | Cooked omega-wolf meat roll (bundle)          | same + meat registry                      |
| `well-fed-omega-siphon-buff` | buff     | timed 90s  | Heal 25% of physical damage dealt         | Cooked omega-wolf meat roll (bundle)          | same + meat registry                      |
| `well-fed-prime-buff`        | buff     | timed 100s | +10% expected damage (attacker ×1.1)      | Cooked beef roll                              | same + meat registry                      |

---

## Utility (6)

| id                       | Polarity | Duration | Effect summary                            | Source / trigger                      | File to edit                                               |
| ------------------------ | -------- | -------- | ----------------------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `stabilize-buff`         | buff     | toggle   | −50% incoming randomness (stability ×0.5) | Mechanics / dev toggle                | `definingWorldPlazaEntityBuffRegistry.ts`                  |
| `focus-buff`             | buff     | toggle   | Luck +0.5, stability ×0.75                | Mechanics / dev toggle                | same                                                       |
| `controlled-output-buff` | buff     | toggle   | Stability ×0.35, luck +0.35               | Mechanics / dev toggle                | same                                                       |
| `heat-immunity-buff`     | buff     | toggle   | Toggle heat damage immunity               | Grizzly skill `heat-ward`, dev toggle | same + `definingWorldPlazaCharacterEngineSkillRegistry.ts` |
| `cold-immunity-buff`     | buff     | toggle   | Toggle cold damage immunity               | Dev toggle / character immunities     | same                                                       |
| `invincibility-buff`     | buff     | toggle   | Toggle invincibility                      | Dev toggle                            | same                                                       |

---

## Character (57)

### Movement and stamina

| id                        | Polarity | Duration   | Effect summary                                 | Source / trigger                 | File to edit                              |
| ------------------------- | -------- | ---------- | ---------------------------------------------- | -------------------------------- | ----------------------------------------- |
| `swift-stride-buff`       | buff     | timed 60s  | +20% movement speed                            | Skill `swift-stride`, dev toggle | `definingWorldPlazaEntityBuffRegistry.ts` |
| `racing-pulse-buff`       | buff     | timed 30s  | +50% movement speed                            | Dev toggle                       | same                                      |
| `sprint-surge-buff`       | buff     | timed 10s  | +100% movement speed                           | Dev toggle                       | same                                      |
| `long-leap-buff`          | buff     | toggle     | +50% jump distance                             | Dev toggle                       | same                                      |
| `skybound-buff`           | buff     | toggle     | +50% jump arc and layer reach (up to 6 layers) | Dev toggle                       | same                                      |
| `enduring-spirit-buff`    | buff     | toggle     | 50% slower stamina drain                       | Dev toggle                       | same                                      |
| `second-wind-buff`        | buff     | timed 60s  | +50% stamina regen                             | Dev toggle                       | same                                      |
| `featherweight-buff`      | buff     | toggle     | 50% cheaper jump stamina                       | Dev toggle                       | same                                      |
| `lead-boots-debuff`       | debuff   | toggle     | −20% movement speed                            | Dev toggle                       | same                                      |
| `sluggish-debuff`         | debuff   | timed 30s  | −50% movement speed                            | Dev toggle                       | same                                      |
| `heavy-legs-debuff`       | debuff   | toggle     | −30% jump distance                             | Dev toggle                       | same                                      |
| `low-hop-debuff`          | debuff   | toggle     | −30% jump height (arc)                         | Dev toggle                       | same                                      |
| `exhausted-debuff`        | debuff   | toggle     | 50% faster stamina drain                       | Dev toggle                       | same                                      |
| `winded-debuff`           | debuff   | toggle     | 50% slower stamina regen                       | Dev toggle                       | same                                      |
| `heavy-landing-debuff`    | debuff   | toggle     | 50% more jump stamina cost                     | Dev toggle                       | same                                      |
| `well-fed-fleet-buff`     | buff     | timed 90s  | +20% movement speed                            | Cooked deer roll                 | same + `definingWildlifeMeatRegistry.ts`  |
| `well-fed-endurance-buff` | buff     | timed 120s | +35% stamina regen                             | Cooked zebra roll                | same + meat registry                      |
| `well-fed-comfort-buff`   | buff     | timed 60s  | +20% stamina regen                             | Cooked chicken roll              | same + meat registry                      |

### Max health and healing

| id                        | Polarity | Duration   | Effect summary                  | Source / trigger      | File to edit                              |
| ------------------------- | -------- | ---------- | ------------------------------- | --------------------- | ----------------------------------------- |
| `temp-max-health-buff`    | buff     | timed 30s  | +50 EV rolled temp max HP       | Dev toggle            | `definingWorldPlazaEntityBuffRegistry.ts` |
| `double-max-health-buff`  | buff     | instant    | Double effective max HP scale   | Dev toggle            | same                                      |
| `halve-max-health-buff`   | debuff   | instant    | Halve effective max HP scale    | Dev toggle            | same                                      |
| `blessing-buff`           | buff     | toggle     | Incoming heals +25%             | Dev toggle            | same                                      |
| `well-fed-hearty-buff`    | buff     | timed 120s | +80 EV rolled temp max HP       | Cooked bear roll      | same + meat registry                      |
| `well-fed-toughened-buff` | buff     | timed 90s  | Incoming damage ×0.85           | Cooked boar roll      | same + meat registry                      |
| `well-fed-vigor-buff`     | buff     | timed 90s  | Incoming heals +20% (ratio 1.2) | Cooked mutton roll    | same + meat registry                      |
| `well-fed-reptile-buff`   | buff     | timed 90s  | Incoming damage ×0.9            | Cooked crocodile roll | same + meat registry                      |

### Food sickness

| id                     | Polarity | Duration  | Effect summary                                                     | Source / trigger                                             | File to edit                                           |
| ---------------------- | -------- | --------- | ------------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| `food-sickness-debuff` | debuff   | timed 60s | Sprint locked when active; pairs with hunger ×0.5 via eat `isSick` | Registry + action lock check; hunger penalty in eat resolver | same + `resolvingWorldPlazaInventoryFoodEatEffects.ts` |

### Disease symptoms (`hideFromHud: true`)

Granted by [disease](../disease/) stage scheduler via `applyingWorldPlazaEntityDiseaseStageGrant.ts`. Instance ids: `disease-grant:*`.

| id                            | Polarity | Duration   | Effect summary                                             | Typical disease link                         | File to edit                                               |
| ----------------------------- | -------- | ---------- | ---------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `disease-nausea-slow-debuff`  | debuff   | timed 60s  | −30% move speed                                            | salmonellosis, liver-fluke, toxoplasmosis, … | `definingWorldPlazaEntityBuffRegistry.ts` + disease grants |
| `disease-muscle-lock-debuff`  | debuff   | timed 60s  | −15% speed; sprint+jump lock                               | trichinellosis, bear-worm                    | same                                                       |
| `disease-joint-lock-debuff`   | debuff   | timed 60s  | −20% speed; jump+roll lock                                 | wolf-fever                                   | same                                                       |
| `disease-roll-lock-debuff`    | debuff   | timed 60s  | Roll lock only                                             | various                                      | same                                                       |
| `disease-weakness-debuff`     | debuff   | timed 120s | Incoming damage ×1.3                                       | fever illnesses                              | same                                                       |
| `disease-stamina-sick-debuff` | debuff   | timed 120s | Sprint stamina drain ×2; regen ×0.5 (`companionModifiers`) | liver-fluke (+4h after onset)                | same                                                       |

### Incapacitation

| id                 | Polarity | Duration  | Effect summary                                           | Source / trigger                                    | File to edit                                       |
| ------------------ | -------- | --------- | -------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------- |
| `confusion-debuff` | debuff   | timed 15s | Movement confusion intensity 50                          | Disease grants (e.g. sleeping sickness), dev toggle | `definingWorldPlazaEntityBuffRegistry.ts`          |
| `sleep-debuff`     | debuff   | timed 8s  | Incapacitate; slow fall + Zzz; physical hit wakes + 30 bonus | Disease grants, dev toggle                          | same + `definingWorldPlazaEntitySleepConstants.ts` |
| `deep-sleep-debuff`| debuff   | timed 12s | Incapacitate; damage cannot wake until timer ends        | Dev toggle; disease grants via `canWakeFromDamage: false` | same + sleep constants                      |
| `stun-debuff`      | debuff   | timed 4s  | Incapacitate                                             | Combat/dev toggle                                   | same + `definingWorldPlazaEntityStunConstants.ts`  |

### Frostbite symptoms (`hideFromHud: true`)

Synced by [frostbite](../frostbite/) stage pipeline (`applyingWorldPlazaEntityFrostbiteStageEffects.ts`). Instance ids: `frostbite-stage:{buffId}`. Linear walk slow uses scoped `frostbite-stage:linear-speed` (`walk_speed` kind), not these tier rows.

| id                                   | Polarity | Duration | Effect summary                                      | Active from stage | Notes |
| ------------------------------------ | -------- | -------- | --------------------------------------------------- | ----------------- | ----- |
| `frostbite-chilled-debuff`           | debuff   | toggle   | Legacy tier speed descriptor (unused for speed)     | Chilled (50+)     | Stage label only in HUD |
| `frostbite-numb-debuff`              | debuff   | toggle   | Max stamina ×0.80                                   | Numb (100+)       | Tier speed row skipped; linear walk slow applies |
| `frostbite-frostnip-debuff`          | debuff   | toggle   | Legacy tier speed (unused)                          | Frostnip (200+)   | Damage debuff separate row |
| `frostbite-frostnip-damage-debuff`   | debuff   | toggle   | Outgoing damage ×0.85                               | Frostnip (200+)   | Attacker roll modifier |
| `frostbite-hypothermia-debuff`       | debuff   | toggle   | Stamina max ×0.50; jump distance/arc ×0.50          | Hypothermia (500+) | Tier speed skipped |
| `frostbite-hypothermia-damage-debuff`| debuff   | toggle   | Outgoing damage ×0.75                               | Hypothermia (500+) | |
| `frostbite-frostbite-debuff`         | debuff   | toggle   | Jump lock                                           | Frostbite (750+)  | `actionLocks: ['jump']`; walk slow from linear stacks |
| `frostbite-frostbite-damage-debuff`  | debuff   | toggle   | Outgoing damage ×0.50                               | Frostbite (750+)  | |
| `frostbite-necrotic-debuff`          | debuff   | toggle   | Heal blocked                                        | Necrotic (1000)   | `heal_block` effect kind |
| `frostbite-necrotic-immobilize-debuff` | debuff | toggle   | Speed ×0; sprint/jump/roll lock; stun immobilize  | Necrotic (1000)   | `actionLocks: ['jump','roll','sprint']` |

Player-facing frostbite signal is the **status HUD snowflake row** (stack count), not buff badge rows. Linear modifiers: `computingWorldPlazaFrostbiteSpeedMovementMultiplier.ts` (`walk_speed`), `computingWorldPlazaFrostbiteStaminaRegenMovementMultiplier.ts`.

---

## Well-fed buff ↔ species map

| Buff id                                                   | Species (cooked meat)                | Chance                      |
| --------------------------------------------------------- | ------------------------------------ | --------------------------- |
| `well-fed-comfort-buff`                                   | chicken                              | 35%                         |
| `well-fed-fleet-buff`                                     | deer                                 | 40%                         |
| `well-fed-toughened-buff`                                 | boar                                 | 38%                         |
| `well-fed-prime-buff`                                     | cow (beef)                           | 42%                         |
| `well-fed-vigor-buff`                                     | sheep (mutton)                       | 36%                         |
| `well-fed-endurance-buff`                                 | zebra                                | 40%                         |
| `well-fed-strength-buff`                                  | grey-wolf, lion, lioness, omega-wolf | 35% / 40% / 38% / 50%       |
| `well-fed-omega-skew-buff` + `well-fed-omega-siphon-buff` | omega-wolf (with strength)           | 50% (all three on one roll) |
| `well-fed-hearty-buff`                                    | brown-bear                           | 45%                         |
| `well-fed-reptile-buff`                                   | crocodile                            | 37%                         |

**Meat catalog:** `definingWildlifeMeatRegistry.ts`. **Eat roll:** `resolvingWorldPlazaInventoryFoodEatEffects.ts`.

---

## Checklist: new buff

1. [ ] Add descriptor to `definingWorldPlazaEntityBuffRegistry.ts`
2. [ ] Wire trigger (eat, disease grant, skill, or document dev-only)
3. [ ] Add HUD icon in `mappingWorldPlazaEntityBuffHudIcon.ts`
4. [ ] Register Iconify glyph if new
5. [ ] Add row to this catalog
6. [ ] Cross-link [inventory-food](../inventory-food/) or [disease](../disease/) when player-facing source is food or illness

## Tests and tooling

- Damage roll presets auto-sync from registry: `definingWorldPlazaEntityHealthDamageRollPresets.test.ts`, `rollingWorldPlazaDamageEngine.test.ts`
- Action locks: `checkingWorldPlazaEntityActionLocked.test.ts`
- Mechanics guide reads registry live: `resolvingPlazaMechanicsBuffBadgeGuideEntries.ts`
