# Frostbite glossary

| Term | Meaning |
| ---- | ------- |
| **Frostbite stack** | Accumulated count from successful `environmental_cold` damage ticks (capped at 1000). |
| **Cold severity** | Degrees below comfort low; raises stacks gained per cold tick. |
| **Warm decay** | Stack loss per second while local temperature is at or above comfort low; warmer = faster. |
| **Stage** | Highest frostbite tier whose `minStacks` the player has reached (Chilled → Necrotic). |
| **Frostnip percent damage** | Extra damage on cold ticks: `(base + stacks × 0.01)%` of effective max HP, added on top of ambient cold DoT. |
| **Necrotic Frostbite** | Max stacks: frozen (stun + 0 speed), heal blocked, icy avatar tint. |
| **Sleep spell** | Hypothermia+ timed sleep (3–10s) fired every +100 stacks past 500. |
