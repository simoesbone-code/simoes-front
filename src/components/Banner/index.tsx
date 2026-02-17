"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container, Slide, Content, SkeletonBanner } from "./styles";
import { getBanner } from "@/hooks/useClient";
import { PropsBanner } from "@/types/banner";

export function Banner() {
  const { data: dataBanner = [], isLoading } = useQuery<PropsBanner[]>({
    queryKey: ["Banner"],
    queryFn: getBanner,
  });

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (dataBanner.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === dataBanner.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [dataBanner]);

  /** 🦴 Skeleton enquanto carrega */
  if (isLoading) {
    return (
      <Container>
        <SkeletonBanner />
      </Container>
    );
  }

  if (!dataBanner.length) return null;

  return (
    <Container>
      {dataBanner.map((banner, index) => (
        <Slide
          key={banner._id}
          active={index === current}
          background={banner.image.url}
        >
          <Content>
            <span />
            <strong />
          </Content>
        </Slide>
      ))}
    </Container>
  );
}
