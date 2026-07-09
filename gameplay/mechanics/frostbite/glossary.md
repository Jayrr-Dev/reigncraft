# Frostbite glossary

| Term | Meaning |
| ---- | ------- |
| **Frostbite stack** | Accumulated count from successful `environmental_cold` damage ticks (capped at 1000). |
| **Cold deficit** | Degrees below comfort low (`comfortLow − local°C`). Each °C adds stacks on every cold damage tick (default 1:1). |
| **Warm surplus** | Degrees above comfort low (`local°C − comfortLow`). Each °C removes 1 stack on every warm tick (same rate as cold gain). |
| **Warm decay** | Stack loss per warm environmental tick while `local°C > comfortLow`. Mirrors cold gain 1:1; only warmth above comfort matters, not current stack count. |
| **Warm decay clock** | `lastDecayAtMs` on frostbite state. Anchored on first warm frame; advances by whole tick intervals; reset when warmth returns to zero or below. |
| **Stage** | Highest frostbite tier whose `minStacks` the player has reached (Chilled → Necrotic). |
| **Frostnip percent damage** | Extra damage on cold ticks: `(base + stacks × 0.01)%` of effective max HP, added on top of ambient cold DoT. |
| **Walk speed (linear)** | Frostbite stack penalty on walking only (`walk_speed` modifier). Sprint stays available until Necrotic immobilize. |
| **Necrotic Frostbite** | Max stacks: frozen (stun + 0 speed), heal blocked, icy avatar tint. |
| **Sleep spell** | Hypothermia+ timed sleep (3–10s) fired every +100 stacks past 500. |
