import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseOptionalUser } from "../supabase";


export default defineTool({
  name: "get_product",
  title: "Get an OGURA product",
  description: "Fetch full details for a single OGURA product by its id.",
  inputSchema: {
    product_id: z.string().uuid().describe("The product's UUID."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ product_id }, ctx) => {
    const { data, error } = await supabaseOptionalUser(ctx)
      .from("products")
      .select("*")
      .eq("id", product_id)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Product not found." }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { product: data },
    };
  },
});
