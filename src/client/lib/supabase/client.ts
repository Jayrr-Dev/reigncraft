/** Phase 1 no-op Supabase client until Convex persistence lands. */

export type SupabaseResult = {
  data: unknown;
  error: { message: string } | null;
  count?: number | null;
};

export type SupabaseUser = {
  id: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseQueryBuilder = {
  select: (...args: unknown[]) => SupabaseQueryBuilder;
  insert: (...args: unknown[]) => SupabaseQueryBuilder;
  update: (...args: unknown[]) => SupabaseQueryBuilder;
  upsert: (...args: unknown[]) => SupabaseQueryBuilder;
  delete: (...args: unknown[]) => SupabaseQueryBuilder;
  eq: (...args: unknown[]) => SupabaseQueryBuilder;
  in: (...args: unknown[]) => SupabaseQueryBuilder;
  lte: (...args: unknown[]) => SupabaseQueryBuilder;
  gte: (...args: unknown[]) => SupabaseQueryBuilder;
  order: (...args: unknown[]) => SupabaseQueryBuilder;
  limit: (...args: unknown[]) => SupabaseQueryBuilder;
  single: () => Promise<SupabaseResult>;
  maybeSingle: () => Promise<SupabaseResult>;
  then: <T>(
    onfulfilled?: (value: SupabaseResult) => T | PromiseLike<T>,
  ) => Promise<T>;
};

/** Minimal Realtime channel surface used by plaza online room hooks. */
export type RealtimeChannel = {
  topic: string;
  on: (...args: unknown[]) => RealtimeChannel;
  subscribe: (
    ...args: unknown[]
  ) => { unsubscribe: () => void };
  presenceState: () => Record<string, unknown[]>;
  track: (...args: unknown[]) => Promise<unknown>;
  untrack: (...args: unknown[]) => Promise<unknown>;
  send: (...args: unknown[]) => Promise<unknown>;
};

function createQueryBuilder(): SupabaseQueryBuilder {
  const result: SupabaseResult = { data: [], error: null };
  const promise = Promise.resolve(result);
  const builder: SupabaseQueryBuilder = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    eq: () => builder,
    in: () => builder,
    lte: () => builder,
    gte: () => builder,
    order: () => builder,
    limit: () => builder,
    single: () => promise,
    maybeSingle: () => promise,
    then: (onfulfilled) => promise.then(onfulfilled),
  };
  return builder;
}

function creatingRealtimeChannel(): RealtimeChannel {
  const channel: RealtimeChannel = {
    topic: 'realtime:stub',
    on: () => channel,
    subscribe: () => ({ unsubscribe: () => undefined }),
    presenceState: () => ({}),
    track: async () => ({}),
    untrack: async () => ({}),
    send: async () => ({}),
  };
  return channel;
}

export function createClient() {
  return {
    from: (_table: string) => createQueryBuilder(),
    rpc: (..._args: unknown[]) =>
      Promise.resolve({ data: null, error: null as { message: string } | null }),
    channel: (..._args: unknown[]) => creatingRealtimeChannel(),
    getChannels: () => [] as RealtimeChannel[],
    removeChannel: (..._args: unknown[]) => undefined,
    auth: {
      getUser: () =>
        Promise.resolve({
          data: { user: null as SupabaseUser | null },
          error: null as { message: string } | null,
        }),
    },
  };
}
