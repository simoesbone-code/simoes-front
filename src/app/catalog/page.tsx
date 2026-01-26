"use client";
import Catalog from "@/components/CatalogPage";
import { getProduct } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { Wrapper } from "../dashboard/admin/[id]/styles";

export default function CatalogPage() {
  const { data: dataProduct, refetch } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  return (
    <Wrapper>
      <Catalog refetch={refetch} products={dataProduct} />
    </Wrapper>
  );
}
