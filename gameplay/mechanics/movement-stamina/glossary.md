# Movement / stamina glossary (ubiquitous language)

Terms used consistently across code, docs, and player-facing copy for the Plaza movement and stamina bounded context.

## Core concepts

| Term                  | Meaning                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Stamina bar**       | 0..1 ratio resource spent on sprint, jump, and roll. HUD width equals `staminaRatio`.        |
| **Hold-to-run**       | Pointer held **150ms** upgrades walk intent to sprint.                                       |
| **Burst ramp**        | After sprint starts, speed hits **75%** of the walk→run gap in **1s**, then full run in **3s** more. No long-term momentum. |
| **Exhaustion fade**   | From **20%** stamina to **0**, sprint speed lerps from burst speed toward walk.                          |
| **Run frame scale**   | Run clip fps × (`currentRunSpeed` / `fullRunSpeed`) so stride matches accel and fade.                   |
| **Running for seconds** | Continuous sprint clock on stamina state. Resets when not running. Feeds burst ramp.       |
| **Stamina ratio**     | Current fill level. **1** = full, **0** = empty.                                             |
| **Depletion lockout** | After hitting **0**, regen waits **2s** before the bar refills.                              |
| **Action spend**      | Jump or roll subtracts a fixed ratio and pauses regen **600ms**.                             |
| **Fatigue tier**      | Escalating penalty after each full empty-to-zero cycle: `fresh` → `collapsed`.               |
| **Use unlock ratio**  | Minimum refill required before sprint, jump, or roll work again at the current fatigue tier. |

## Fatigue tiers

| Tier          | Unlock ratio       | Regen multiplier | Player feel                                         |
| ------------- | ------------------ | ---------------- | --------------------------------------------------- |
| **fresh**     | **0%** (immediate) | **1×**           | Normal locomotion                                   |
| **winded**    | **85%**            | **1×**           | Must recover most of the bar after one empty        |
| **fatigued**  | **60%**            | **1×**           | Noticeable re-use gate                              |
| **spent**     | **40%**            | **1×**           | Hard pause before next burst                        |
| **collapsed** | **15%**            | **0.5×**         | Slow regen; must reach **15%** before run/jump/roll |

Reaching a **full bar** resets fatigue to `fresh`.

## Stamina costs (ratio units)

| Action    | Cost                  | Notes                       |
| --------- | --------------------- | --------------------------- |
| Walk jump | **6.25%** (`0.0625`)  | Standing or walking takeoff |
| Run jump  | **8.75%** (`0.0875`)  | Sprint takeoff              |
| Roll      | **18.75%** (`0.1875`) | **3×** walk jump cost       |

## Auto jump assist

| Term          | Meaning                                                                                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Auto jump** | Settings toggle. While moving toward a river or stream, the avatar requests a **run jump** when a clear far-bank landing exists. Works on every viewport when enabled. Default: **on** for mobile until turned off; **off** for desktop until enabled. |

## Regen timing

| Delay                    | Duration   | Trigger                            |
| ------------------------ | ---------- | ---------------------------------- |
| Depletion regen delay    | **2000ms** | Bar hit **0**                      |
| Action spend regen pause | **600ms**  | After jump or roll spend           |
| Full refill time         | **4.5s**   | Resting at **1×** regen multiplier |
| Full drain time          | **12.8s**  | Continuous sprint                  |

Effective rates: drain **1/12.8** per second, regen **1/4.5** per second.

## Locomotion speeds

| Term                   | Meaning                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Grid speed**         | Tiles per second in isometric grid units. Default walk **2**, run **3**.                                        |
| **Sprint burst**       | While sprinting, speed reaches **75%** of the walk→run gap in **1s**, then full run over **3s** more (`computingWorldPlazaAcceleratedRunSpeed`). |
| **Exhaustion fade**    | Last **20%** of stamina: burst speed lerps toward walk as the bar empties.                                                                      |
| **Run frame scale**    | Run animation fps tracks body speed (`resolvingWorldPlazaRunAnimationSpeedScale`).                                                              |
| **Character override** | Per-skin `walkSpeedGridPerSecond` / `runSpeedGridPerSecond` in character engine ([characters](../characters/)). |
| **Hunger sprint lock** | `hungry` and `starving` tiers block sprint ([hunger](../hunger/)).                                              |
| **Frost slow**         | Walk/run scale toward **0** at extreme cold ([environment](../environment/)).                                   |

## Jump and layers

| Term                    | Meaning                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Jump height max**     | Default **4** layers above current standing layer.                                      |
| **Jump distance scale** | Per-character multiplier on horizontal jump reach (Grizzly **0.9**, Fox Peach **1.1**). |
| **Walk step**           | **+1** layer delta per step.                                                            |
| **Wall collision**      | Blocks **≥2** layers above player use wall-style horizontal collision.                  |

## Roll dodge

| Term                 | Meaning                                                    |
| -------------------- | ---------------------------------------------------------- |
| **Roll animation**   | Girl Sample **9** frames at **18** fps = **500ms** total.  |
| **Dodge window**     | Roll progress **15%–75%** (~**75–375ms**).                 |
| **Damage reduction** | **75%–95%** physical damage reduction (peak mid-window).   |
| **Mitigated kinds**  | `physical` only ([combat](../combat/)).                    |
| **Roll travel**      | **2.25** grid units forward.                               |
| **Chain lock**       | Next roll blocked until current roll finishes + **150ms**. |

## HUD signals

| Term                    | Meaning                                           |
| ----------------------- | ------------------------------------------------- |
| **Low stamina warning** | Bar color shifts below **30%** ratio.             |
| **HUD push interval**   | Stamina state pushed to React every **80ms** max. |
| **Frame delta cap**     | **0.05s** max per tick to survive tab stalls.     |

## Code prefixes (project convention)

| Prefix       | Role in this context                                    |
| ------------ | ------------------------------------------------------- |
| `defining*`  | Run stamina, fatigue tier, roll motion, layer constants |
| `computing*` | Roll dodge multiplier, jump reach, frost/hunger speed   |
| `resolving*` | Hunger movement effects, roll dodge options             |
| `checking*`  | Can sprint/jump/roll given fatigue and hunger           |
| `using*`     | Stamina rAF hook wiring                                 |

## Cross-context (wildlife)

Player fatigue tiers do **not** apply to animals. Wildlife uses a simpler exhaust latch plus optional acceleration.

| Term                    | Meaning                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Wildlife exhaust**    | Run-lock (`isExhausted`) until bar reaches `exhaustedRecoveryRatio`. Global default **35%**; fleet prey **75%**. Not a fatigue tier.    |
| **Max stamina ratio**   | Wildlife pool capacity (`maxStaminaRatio`, default **1**). Fleet prey **1.15–1.7**. Apex frame multiplies (**1.3×**) on top.            |
| **Wildlife running for seconds** | Same continuous sprint clock on `DefiningWildlifeStaminaState.runningForSeconds`. Feeds species burst + momentum.              |
| **Wildlife burst ramp** | Short-term accel: lerp walk → base run over species `burstRampSeconds` (deer **0.4s**; player uses separate two-phase ramp). |
| **Momentum**            | Wildlife-only long-term accel: after burst, lerp toward run × (1 + `momentumBonusMultiplier`). Player has no momentum phase.            |

Full fleet prey table: [wildlife mechanics](../wildlife/mechanics.md#run-stamina-species-multipliers).

## Anti-patterns (words to avoid)

| Don't say          | Say instead                                          |
| ------------------ | ---------------------------------------------------- |
| "Stamina points"   | **Stamina ratio** (0..1)                             |
| "Exhausted debuff" | **Fatigue tier** (`winded` through `collapsed`)      |
| "I-frames"         | **Roll dodge window** with physical damage reduction |
| "Sprint stamina"   | **Run stamina** drain while holding run              |
| "Jump stamina"     | **Jump cost ratio** (**6.25%** or **8.75%**)         |
| "Animal fatigue"   | Wildlife **exhaust** / `isExhausted` (no fatigue tiers) |
