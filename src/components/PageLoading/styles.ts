import styled, { keyframes } from "styled-components";

/* Rotações */
const rotateRight = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const rotateLeft = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

/* Overlay que bloqueia tudo */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: all;
`;

/* SVG container */
export const Svg = styled.svg`
  width: 96px;
  height: 96px;
`;

/* Base comum dos anéis */
const RingBase = styled.circle`
  fill: none;
  stroke-linecap: round;
  transform-origin: 50% 50%;
`;

/* Anel grande (direita) */
export const RingLarge = styled(RingBase).attrs({
  cx: 60,
  cy: 60,
  r: 44,
})`
  stroke: #ff8c00;
  stroke-width: 5;
  stroke-dasharray: 200 80;

  animation: ${rotateRight} 1.6s linear infinite;
`;

/* Anel médio (esquerda) */
export const RingMedium = styled(RingBase).attrs({
  cx: 60,
  cy: 60,
  r: 32,
})`
  stroke: #ffb347;
  stroke-width: 5;
  stroke-dasharray: 150 70;

  animation: ${rotateLeft} 1.2s linear infinite;
`;

/* Anel pequeno (direita) */
export const RingSmall = styled(RingBase).attrs({
  cx: 60,
  cy: 60,
  r: 20,
})`
  stroke: #ffd1a3;
  stroke-width: 4;
  stroke-dasharray: 90 50;

  animation: ${rotateRight} 0.9s linear infinite;
`;
