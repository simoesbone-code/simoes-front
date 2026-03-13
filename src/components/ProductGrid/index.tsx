import { PropsProduct } from "@/types/product";
import {
  Grid,
  Card,
  ImageBox,
  Info,
  SkeletonCard,
} from "./styles";
import Image from "next/image";

interface PropsDataProduct {
  dataProduct: PropsProduct[] | undefined;
  isLoading?: boolean;
}

export function ProductGrid({ dataProduct, isLoading }: PropsDataProduct) {
  const productsRandom = dataProduct
    ? [...dataProduct].sort(() => Math.random() - 0.5).slice(0, 4)
    : [];

  if (isLoading) {
    return (
      <Grid>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index}>
            <div className="image" />
            <div className="title" />
            <div className="subtitle" />
          </SkeletonCard>
        ))}
      </Grid>
    );
  }

  return (
    <Grid>
      {productsRandom.map((item) => (
        <Card key={item._id}>
          <ImageBox>
            <Image
              src={item.image.url}
              alt={item.image.filename}
              fill
              style={{ objectFit: "cover" }}
            />
          </ImageBox>

          <Info>
            <h3>{item.name}</h3>
            <span>Consulte disponibilidade</span>
          </Info>
        </Card>
      ))}
    </Grid>
  );
}