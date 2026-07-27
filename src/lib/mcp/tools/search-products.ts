import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function client(ctx: ToolContext) {
  const token = ctx.getToken();
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: token ? { headers: { Authorization: `Bearer ${token}` } } : {},
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "search_products",
  title: "Search OGURA products",
  description:
    "Search live OGURA products by keyword, category, or price range. Returns a list of products with id, title, price, category, and description.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Keyword to match against product title or description."),
    category: z.string().trim().optional().describe("Category slug or name to filter by."),
    max_price: z.number().int().positive().optional().describe("Maximum price in INR."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(50)
      .optional()
      .describe("Max number of results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, max_price, limit }, ctx) => {
    const supabase = client(ctx);
    let q = supabase
      .from("products")
      .select("id, title, price, category, short_description, description, images")
      .eq("status", "live")
      .limit(limit ?? 20);

    if (query) q = q.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    if (category) q = q.eq("category", category);
    if (max_price) q = q.lte("price", max_price);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
