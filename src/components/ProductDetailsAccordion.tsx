import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/types";

interface ProductDetailsAccordionProps {
  product: Product;
}

export const ProductDetailsAccordion = ({ product }: ProductDetailsAccordionProps) => {
  return (
    <Accordion type="single" collapsible defaultValue="description" className="w-full">
      <AccordionItem value="description" className="border-b">
        <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
          Product Description
        </AccordionTrigger>
        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
          {product.description || "No description available."}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="material" className="border-b">
        <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
          Material & Fabric
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Material</span>
              <span className="font-medium">{product.material || "Cotton Blend"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fabric</span>
              <span className="font-medium">Woven</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pattern</span>
              <span className="font-medium capitalize">{product.tags?.[0] || "Solid"}</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fit" className="border-b">
        <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
          Fit & Sizing
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fit Type</span>
              <span className="font-medium">Regular Fit</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Length</span>
              <span className="font-medium">Standard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model Size</span>
              <span className="font-medium">Model wears size M</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="care" className="border-b">
        <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
          Care Instructions
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Machine wash cold with similar colors
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Do not bleach
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Tumble dry low
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Iron on low heat if needed
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Do not dry clean
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="shipping" className="border-b">
        <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
          Shipping & Returns
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Free Shipping:</span> On all orders above ₹999
            </p>
            <p>
              <span className="font-medium text-foreground">Estimated Delivery:</span> 3-5 business days
            </p>
            <p>
              <span className="font-medium text-foreground">Easy Returns:</span> 7-day return & exchange policy. 
              Items must be unworn with original tags attached.
            </p>
            <p>
              <span className="font-medium text-foreground">COD Available:</span> Cash on delivery available on orders under ₹10,000
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="details" className="border-b">
        <AccordionTrigger className="text-sm font-medium hover:no-underline py-4">
          Product Details
        </AccordionTrigger>
        <AccordionContent className="pb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium">{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium capitalize">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU</span>
              <span className="font-medium uppercase">{product.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country of Origin</span>
              <span className="font-medium">India</span>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
