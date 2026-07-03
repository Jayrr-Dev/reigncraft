/**
 * GIPHY integration constants for world plaza chat.
 *
 * @module components/world/domains/definingWorldPlazaRoomChatGifConstants
 */

/** Server env key for the GIPHY API key. */
export const DEFINING_WORLD_PLAZA_GIPHY_API_KEY_ENV = "GIPHY_API_KEY";

/** Prefix for encoded GIF messages in chat payloads. */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_MESSAGE_PREFIX = "giphy:";

/** TanStack Query key root for GIPHY search. */
export const DEFINING_WORLD_PLAZA_GIPHY_SEARCH_QUERY_KEY = [
  "world-plaza-giphy-search",
] as const;

/** Default search result count per request. */
export const DEFINING_WORLD_PLAZA_GIPHY_SEARCH_DEFAULT_LIMIT = 20;

/** GIPHY content rating for plaza chat (family friendly). */
export const DEFINING_WORLD_PLAZA_GIPHY_CONTENT_RATING = "g";

/** Debounce before firing a GIPHY search (ms). */
export const DEFINING_WORLD_PLAZA_GIPHY_SEARCH_DEBOUNCE_MS = 350;

/** Max GIF preview width in chat bubbles (px, before camera zoom scale). */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_PREVIEW_MAX_WIDTH_PX = 80;

/** Max GIF preview height in chat bubbles (px, before camera zoom scale). */
export const DEFINING_WORLD_PLAZA_ROOM_CHAT_GIF_PREVIEW_MAX_HEIGHT_PX = 60;

/** GIPHY REST API base URL. */
export const DEFINING_WORLD_PLAZA_GIPHY_API_BASE_URL =
  "https://api.giphy.com/v1/gifs";

/** CDN template for fixed-size GIF previews in chat bubbles. */
export const DEFINING_WORLD_PLAZA_GIPHY_PREVIEW_URL_TEMPLATE =
  "https://media.giphy.com/media/{id}/100.gif";
