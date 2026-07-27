import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchProducts from "./tools/search-products";
import getProduct from "./tools/get-product";
import listMyOrders from "./tools/list-my-orders";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ogura-mcp",
  title: "OGURA",
  version: "0.1.0",
  instructions:
    "Tools for the OGURA luxury fashion marketplace. Use search_products to browse the live catalog, get_product to fetch a specific product's details, and list_my_orders to view the signed-in customer's own orders.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchProducts, getProduct, listMyOrders],
});
