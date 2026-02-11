export interface CatalogProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  showInAllShop: boolean;
  showInExplore: boolean;
  featured: boolean;
  images: string[];
  sizes: string[];
  description?: string;
}

export const productCatalog: CatalogProduct[] = [
  {
    id: "colorful-coord",
    title: "Colorful Printed Co-ord Set",
    price: 2499,
    category: "co-ord-sets",
    showInAllShop: true,
    showInExplore: true,
    featured: true,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/user-uploads/imgi_19_HASnCL0O_0064ba7d42224827b21bb798565d4b2e.jpg",
      "/user-uploads/imgi_20_v6kcUeDj_243f3eae7fca4b8c964b4843dff9418b.jpg",
      "/user-uploads/imgi_21_z2etZUrt_ec4bbb6073784d899f9c0d004236bbe7.jpg",
    ],
    description:
      "A vibrant printed co-ord set with traditional motifs. Perfect for festive celebrations and casual outings.",
  },
  {
    id: "black-gold-coord",
    title: "Black & Gold Stripe Co-ord Set",
    price: 2999,
    category: "co-ord-sets",
    showInAllShop: true,
    showInExplore: true,
    featured: true,
    sizes: ["S", "M", "L", "XL"],
    images: [
      "/user-uploads/imgi_58_jbl00937_1.jpg",
      "/user-uploads/imgi_59_jbl00946_1.jpg",
      "/user-uploads/imgi_60_jbl00940_2.jpg",
      "/user-uploads/imgi_61_jbl00929_1.jpg",
      "/user-uploads/imgi_62_jbl00940_2_1.jpg",
    ],
    description:
      "A stunning black and gold striped co-ord set crafted for modern elegance. Perfect for festive occasions and evening gatherings.",
  },
];

export const getAllShopProducts = () =>
  productCatalog.filter((p) => p.showInAllShop);

export const getProductsByCategory = (category: string) =>
  productCatalog.filter((p) => p.category === category);

export const getExploreProducts = () =>
  productCatalog.filter((p) => p.showInExplore || p.featured);

export const getProductById = (id: string) =>
  productCatalog.find((p) => p.id === id);
