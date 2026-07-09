# Frostbite glossary

| Term | Meaning |
| ---- | ------- |
| **Frostbite stack** | Accumulated count from successful `environmental_cold` damage ticks (capped at 1000). |
| **Cold deficit** | Degrees below comfort low. Each °C adds stacks on every cold damage tick (default 1:1). |
| **Warm decay** | Stack loss per warm environmental tick while above comfort low; mirrors cold gain with inverted 0–1000 linear stack factor (warmer + higher stacks = faster). |
| **Stage** | Highest frostbite tier whose `minStacks` the player has reached (Chilled → Necrotic). |
| **Frostnip percent damage** | Extra damage on cold ticks: `(base + stacks × 0.01)%` of effective max HP, added on top of ambient cold DoT. |
| **Walk speed (linear)** | Frostbite stack penalty on walking only (`walk_speed` modifier). Sprint stays available until Necrotic immobilize. |
| **Necrotic Frostbite** | Max stacks: frozen (stun + 0 speed), heal blocked, icy avatar tint. |
| **Sleep spell** | Hypothermia+ timed sleep (3–10s) fired every +100 stacks past 500. |
