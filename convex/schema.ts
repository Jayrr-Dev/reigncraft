import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  counters: defineTable({
    postId: v.string(),
    count: v.number(),
  }).index('by_postId', ['postId']),
});
