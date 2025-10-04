// convex/langchain/search.js

// import { internalQuery } from "../_generated/server";
// import { v } from "convex/values";

// export const performSearch = internalQuery({
//   handler: async (ctx, { query, count }) => {
//     return await ctx.db
//       .vectorSearch("documents", "byEmbedding", {
//         vector: query,
//         limit: count,
//       });
//   },
//   args: {
//     query: v.array(v.number()),
//     count: v.number(),
//   },
// });