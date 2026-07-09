/** Starting immune system factor for a new player. */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_INITIAL = 0;

/** Maximum immune system factor (full benefit cap). */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX = 100;

/** At max factor, contraction chance is multiplied by (1 - this value). */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_CONTRACTION_REDUCTION = 0.75;

/** At max factor, disease and symptom durations are multiplied by (1 - this value). */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_DURATION_REDUCTION = 0.5;

/** At max factor, symptom damage and debuff strength are multiplied by (1 - this value). */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_SYMPTOM_REDUCTION = 0.5;

/** Base chance to gain per-disease immunity when an illness ends. */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_BASE_IMMUNITY_CHANCE = 0.1;

/** Additional immunity chance at max immune system factor. */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_MAX_IMMUNITY_CHANCE_BONUS = 0.4;

/** Immune system factor gained when any disease clears. */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_CLEAR = 3;

/** Extra immune system factor when a per-disease immunity is acquired. */
export const DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_BOOST_ON_IMMUNITY = 7;
