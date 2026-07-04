/** Client interval for polling recent plaza chat messages (ms). */
export const PLAZA_DEVVIT_ONLINE_CHAT_POLL_INTERVAL_MS = 400;

export const PLAZA_DEVVIT_ONLINE_CHAT_API_PATH = '/api/plaza/chat' as const;

/** Maximum chat messages retained per room scope in Redis. */
export const PLAZA_DEVVIT_ONLINE_CHAT_REDIS_MAX_MESSAGES = 50;

/** Redis TTL for the ephemeral chat list (seconds). */
export const PLAZA_DEVVIT_ONLINE_CHAT_REDIS_TTL_SECONDS = 30;

/** Prefix for GIF chat payloads (`giphy:<id>`). */
export const PLAZA_DEVVIT_ONLINE_CHAT_GIF_MESSAGE_PREFIX = 'giphy:' as const;

/** Maximum chat message length (Club Penguin style). */
export const PLAZA_DEVVIT_ONLINE_CHAT_MAX_MESSAGE_LENGTH = 80;

export type PlazaDevvitOnlineChatMessage = {
  userId: string;
  displayName: string;
  message: string;
  sentAt: string;
  gridX: number;
  gridY: number;
};

export type PlazaDevvitOnlineTypingUser = {
  userId: string;
  displayName: string;
  gridX: number;
  gridY: number;
  updatedAt: string;
};

export const PLAZA_DEVVIT_ONLINE_TYPING_API_PATH =
  '/api/plaza/chat/typing' as const;

/** How long a typing record stays visible without refresh (ms). */
export const PLAZA_DEVVIT_ONLINE_TYPING_EXPIRY_MS = 4000;

export type PlazaDevvitOnlineChatTypingRequest = {
  isTyping: boolean;
  displayName: string;
  gridX: number;
  gridY: number;
};

export type PlazaDevvitOnlineChatSendRequest = {
  message: string;
  gridX: number;
  gridY: number;
  displayName: string;
};

export type PlazaDevvitOnlineChatSendResponse =
  | {
      type: 'sent';
      message: PlazaDevvitOnlineChatMessage;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaDevvitOnlineChatPollResponse =
  | {
      type: 'messages';
      messages: PlazaDevvitOnlineChatMessage[];
      typingUsers: PlazaDevvitOnlineTypingUser[];
    }
  | {
      type: 'error';
      message: string;
    };

/** Whole-word patterns replaced with asterisks before broadcast. */
const PLAZA_DEVVIT_ONLINE_CHAT_PROFANITY_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|damn|cunt|nigger|faggot|retard)\b/gi,
] as const;

const PLAZA_DEVVIT_ONLINE_CHAT_PROFANITY_REPLACEMENT = '****' as const;

function filteringPlazaDevvitOnlineChatProfanity(message: string): string {
  let filteredMessage = message;

  for (const pattern of PLAZA_DEVVIT_ONLINE_CHAT_PROFANITY_PATTERNS) {
    filteredMessage = filteredMessage.replace(
      pattern,
      PLAZA_DEVVIT_ONLINE_CHAT_PROFANITY_REPLACEMENT,
    );
  }

  return filteredMessage;
}

/**
 * Trims, caps length, filters profanity, and rejects empty chat input.
 */
export function sanitizingPlazaDevvitOnlineChatMessage(
  rawMessage: string,
): string | null {
  const trimmedMessage = rawMessage.trim();

  if (!trimmedMessage) {
    return null;
  }

  if (trimmedMessage.startsWith(PLAZA_DEVVIT_ONLINE_CHAT_GIF_MESSAGE_PREFIX)) {
    return trimmedMessage.slice(0, PLAZA_DEVVIT_ONLINE_CHAT_MAX_MESSAGE_LENGTH);
  }

  const cappedMessage = trimmedMessage.slice(
    0,
    PLAZA_DEVVIT_ONLINE_CHAT_MAX_MESSAGE_LENGTH,
  );
  const filteredMessage = filteringPlazaDevvitOnlineChatProfanity(cappedMessage);

  if (!filteredMessage.trim()) {
    return null;
  }

  return filteredMessage;
}
