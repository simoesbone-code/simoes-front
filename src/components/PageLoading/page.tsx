"use client";

import { Overlay, Svg, RingLarge, RingMedium, RingSmall } from "./styles";

type Props = {
  visible: boolean;
};

export default function PageLoading({ visible }: Props) {
  if (!visible) return null;

  return (
    <Overlay>
      <Svg viewBox="0 0 120 120">
        <RingLarge />
        <RingMedium />
        <RingSmall />
      </Svg>
    </Overlay>
  );
}
