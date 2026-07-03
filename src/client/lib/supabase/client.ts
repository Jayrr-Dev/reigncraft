/** Phase 1 no-op Supabase client until Convex persistence lands. */

export type SupabaseResult = {
  data: unknown;
  error: { message: string } | null;
  count?: number | null;
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
  single: () => Promise<SupabaseResult>;
  maybeSingle: () => Promise<SupabaseResult>;
  then: <T>(
    onfulfilled?: (value: SupabaseResult) => T | PromiseLike<T>,
  ) => Promise<T>;
};

function createQueryBuilder(): SupabaseQueryBuilder {
  const result: SupabaseResult = { data: null, error: null };
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
    single: () => promise,
    maybeSingle: () => promise,
    then: (onfulfilled) => promise.then(onfulfilled),
  };
  return builder;
}

export function createClient() {
  return {
    from: (_table: string) => createQueryBuilder(),
    rpc: (..._args: unknown[]) => Promise.resolve({ data: null, error: null }),
    channel: (..._args: unknown[]) => ({
      on: (..._args: unknown[]) => ({
        subscribe: (..._args: unknown[]) => ({ unsubscribe: () => undefined }),
      }),
    }),
    removeChannel: (..._args: unknown[]) => undefined,
    auth: {
      getUser: () =>
        Promise.resolve({ data: { user: null }, error: null }),
    },
  };
}
