import { context } from '@devvit/web/client';

export function useAuthUser() {
  const username = context.username ?? null;
  return {
    data: username ? { id: `reddit:${username}`, email: null } : null,
    isLoading: false,
  };
}

export function useUserData() {
  const username = context.username ?? null;
  return {
    data: username
      ? { username, alias: null, email: null }
      : null,
  };
}
