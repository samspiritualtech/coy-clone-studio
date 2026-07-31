import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";


export default defineTool({
  name: "list_my_orders",
  title: "List my OGURA orders",
  description:
    "List the signed-in OGURA customer's own orders, most recent first. Requires authentication.",
  inputSchema: {
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max number of orders to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return {
        content: [{ type: "text", text: "You must be signed in to view your orders." }],
        isError: true,
      };
    }
    const { data, error } = await userClient(ctx)
      .from("orders")
      .select(
        "id, order_number, status, subtotal, shipping_fee, discount, total, tracking_id, created_at",
      )
      .eq("customer_id", ctx.getUserId())
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { orders: data ?? [] },
    };
  },
});
