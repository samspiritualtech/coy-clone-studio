import { useEffect, useState } from "react";
import { fetchBrandStores, type BrandStore } from "@/lib/brandStores";

export const useBrandStores = () => {
  const [stores, setStores] = useState<BrandStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const data = await fetchBrandStores();
      if (!active) return;
      setStores(data);
      setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { stores, isLoading };
};
