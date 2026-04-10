"use client";

import Catalog from "@/components/CatalogPage";
import { getProduct } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

export default function CatalogPage() {
  const { data: dataProduct, refetch } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Catalog refetch={refetch} products={dataProduct} />
    </div>
  );
}