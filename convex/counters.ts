import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: { postId: v.string() },
  handler: async (ctx, { postId }) => {
    const row = await ctx.db
      .query('counters')
      .withIndex('by_postId', (q) => q.eq('postId', postId))
      .unique();
    return row?.count ?? 0;
  },
});

export const adjust = mutation({
  args: { postId: v.string(), delta: v.number() },
  handler: async (ctx, { postId, delta }) => {
    const existing = await ctx.db
      .query('counters')
      .withIndex('by_postId', (q) => q.eq('postId', postId))
      .unique();

    if (existing) {
      const count = existing.count + delta;
      await ctx.db.patch(existing._id, { count });
      return count;
    }

    const count = delta;
    await ctx.db.insert('counters', { postId, count });
    return count;
  },
});
