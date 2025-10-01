import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const recordPurchase = mutation({
  args: {
    userId: v.id("users"),
    courseId: v.id("courses"),
    amount: v.number(),
    stripePurchaseId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, amount, courseId, stripePurchaseId } = args;

    // ✅ check if purchase already exists for this user & course
    const existing = await ctx.db
      .query("purchases")
      .withIndex("by_user_course", (q) =>
        q.eq("userId", userId).eq("courseId", courseId)
      )
      .first();

    if (existing) {
      console.log("Purchase already exists for this user & course");
      return existing._id; // return existing purchase instead of inserting a duplicate
    }

    // ✅ create new purchase
    const purchaseId = await ctx.db.insert("purchases", {
      userId,
      amount,
      courseId,
      stripePurchaseId,
      purchaseDate: Date.now(),
    });

    return purchaseId;
  },
});
