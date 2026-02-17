"use client";

import { PropsProduct } from "@/types/product";
import {
  Card,
  ImageBox,
  ProductImage,
  Title,
  Prices,
  PriceTag,
  List,
} from "./styles";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageLoading from "../PageLoading/page";

type Props = {
  products: PropsProduct[] | undefined;
  isAdmin: boolean;
  onSelect?: (product: PropsProduct) => void;
};

export default function ProductList({ products, isAdmin, onSelect }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (id: string) => {
    setLoading(true);
    router.push(`/catalog/${id}`);
  };

  return (
    <List>
      {products?.map((item) => {
        const Wrapper = isAdmin ? "button" : "div";

        return (
          <Wrapper
            key={item._id}
            onClick={isAdmin ? () => onSelect?.(item) : undefined}
            style={{
              all: "unset",
              cursor: isAdmin ? "pointer" : "default",
            }}
          >
            <Card
              onClick={isAdmin ? undefined : () => handleNavigate(item._id)}
            >
              <ImageBox>
                <ProductImage src={item.image.url} alt={item.name} />
              </ImageBox>

              <Title>{item.name}</Title>

              <Prices>
                <PriceTag>
                  Unidade <span>R$ {item.priceUnit}</span>
                </PriceTag>

                <PriceTag>
                  Atacado <span>R$ {item.priceWholesale}</span>
                </PriceTag>
              </Prices>
            </Card>
          </Wrapper>
        );
      })}

      <PageLoading visible={loading} />
    </List>
  );
}
