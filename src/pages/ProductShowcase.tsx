import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/ProductGallery";

const designAImages = [
  "/user-uploads/imgi_58_jbl00937_1.jpg",
  "/user-uploads/imgi_59_jbl00946_1.jpg",
  "/user-uploads/imgi_60_jbl00940_2.jpg",
  "/user-uploads/imgi_61_jbl00929_1.jpg",
  "/user-uploads/imgi_62_jbl00940_2_1.jpg",
];

const designBImages = [
  "/user-uploads/imgi_19_HASnCL0O_0064ba7d42224827b21bb798565d4b2e.jpg",
  "/user-uploads/imgi_20_v6kcUeDj_243f3eae7fca4b8c964b4843dff9418b.jpg",
  "/user-uploads/imgi_21_z2etZUrt_ec4bbb6073784d899f9c0d004236bbe7.jpg",
];

const ProductShowcase = () => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          Product Showcase
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProductGallery title="Design A — Black & Gold Stripe" images={designAImages} />
          <ProductGallery title="Design B — Colorful Print" images={designBImages} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductShowcase;
