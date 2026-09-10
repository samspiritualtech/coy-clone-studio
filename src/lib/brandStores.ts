import type { Product } from "@/types";

const EXTERNAL_API_URL = "https://pyesltzkemtranachpne.supabase.co/functions/v1/products";

export interface BrandStoreProduct extends Product {
  storeName?: string;
  storeSlug?: string;
  videoUrl?: string;
}

export interface BrandStore {
  name: string;
  slug: string;
  productCount: number;
  coverImages: string[];
  products: BrandStoreProduct[];
}

export const slugifyBrand = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapApiProduct = (p: any, i: number): BrandStoreProduct => {
  const storeName: string | undefined = p?.store?.name ?? p?.brand ?? undefined;
  const storeSlug = p?.store?.slug ?? (storeName ? slugifyBrand(storeName) : undefined);
  const images: string[] = Array.isArray(p?.image_urls) && p.image_urls.length
    ? p.image_urls
    : p?.image_url
    ? [p.image_url]
    : Array.isArray(p?.images) && p.images.length
    ? p.images
    : ["/placeholder.svg"];

  return {
    id: String(p?.id ?? `api-${i}`),
    name: p?.name ?? p?.title ?? "Untitled",
    brand: storeName ?? "OGURA",
    price: Number(p?.price) || 0,
    originalPrice: p?.mrp ? Number(p.mrp) : undefined,
    category: (p?.category as Product["category"]) ?? "accessories",
    images,
    tags: p?.tags ?? [],
    sizes: p?.sizes ?? [],
    colors: p?.colors ?? [],
    rating: 0,
    reviews: 0,
    inStock: p?.stock == null ? true : Number(p.stock) > 0,
    description: p?.description ?? "",
    material: p?.material ?? "",
    occasions: [],
    storeName,
    storeSlug,
    videoUrl: p?.video_url ?? undefined,
  };
};

/** Fetch all seller products from the Seller Center API. */
export const fetchSellerProducts = async (): Promise<BrandStoreProduct[]> => {
  try {
    const res = await fetch(EXTERNAL_API_URL);
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : data?.products ?? data?.data ?? [];
    return items.map(mapApiProduct);
  } catch (err) {
    console.error("[brandStores] failed to fetch seller products:", err);
    return [];
  }
};

/** Group seller products into brand stores. */
export const groupIntoBrandStores = (items: BrandStoreProduct[]): BrandStore[] => {
  const map = new Map<string, BrandStore>();

  items.forEach((product) => {
    if (!product.storeName || !product.storeSlug) return;
    const existing = map.get(product.storeSlug);
    if (existing) {
      existing.products.push(product);
      existing.productCount += 1;
      if (existing.coverImages.length < 4 && product.images[0]) {
        existing.coverImages.push(product.images[0]);
      }
    } else {
      map.set(product.storeSlug, {
        name: product.storeName,
        slug: product.storeSlug,
        productCount: 1,
        coverImages: product.images[0] ? [product.images[0]] : [],
        products: [product],
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.productCount - a.productCount);
};

export const fetchBrandStores = async (): Promise<BrandStore[]> =>
  groupIntoBrandStores(await fetchSellerProducts());
