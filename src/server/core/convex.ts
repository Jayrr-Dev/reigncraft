import { settings } from '@devvit/web/server';

const DEFAULT_CONVEX_URL = 'https://basic-woodpecker-389.convex.cloud';

type ConvexSuccess<T> = {
  status: 'success';
  value: T;
};

type ConvexError = {
  status: 'error';
  errorMessage: string;
};

type ConvexResponse<T> = ConvexSuccess<T> | ConvexError;

const getConvexUrl = async (): Promise<string> => {
  const configured = await settings.get('convexUrl');
  if (typeof configured === 'string' && configured.length > 0) {
    return configured.replace(/\/$/, '');
  }

  const fromEnv = process.env.CONVEX_URL;
  if (typeof fromEnv === 'string' && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }

  return DEFAULT_CONVEX_URL;
};

const callConvex = async <T>(
  endpoint: 'query' | 'mutation',
  path: string,
  args: Record<string, unknown>
): Promise<T> => {
  const baseUrl = await getConvexUrl();
  const response = await fetch(`${baseUrl}/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, args, format: 'json' }),
  });

  if (!response.ok) {
    throw new Error(`Convex HTTP ${response.status}: ${await response.text()}`);
  }

  const data: ConvexResponse<T> = await response.json();
  if (data.status === 'error') {
    throw new Error(data.errorMessage);
  }

  return data.value;
};

export const convexQuery = <T>(
  path: string,
  args: Record<string, unknown>
): Promise<T> => callConvex('query', path, args);

export const convexMutation = <T>(
  path: string,
  args: Record<string, unknown>
): Promise<T> => callConvex('mutation', path, args);
