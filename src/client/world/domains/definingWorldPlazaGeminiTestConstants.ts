/**
 * Gemini connectivity test payload for the plaza Features debug panel.
 *
 * @module components/world/domains/definingWorldPlazaGeminiTestConstants
 */

/** User message sent when testing Gemini from the Features panel. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_MESSAGE =
  'Reply with exactly: OK' as const;

/** System instruction for the Features panel Gemini connectivity test. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_SYSTEM_PROMPT =
  'You are a connectivity test. Follow the user message exactly.' as const;

/** Maximum characters shown from a successful Gemini test reply. */
export const DEFINING_WORLD_PLAZA_GEMINI_TEST_RESULT_MAX_LENGTH = 120;
