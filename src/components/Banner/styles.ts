"use client";
import styled, { css } from "styled-components";

export const Container = styled.section`
  position: relative;
  width: 100%;
  height: 220px;
  margin: 24px 0;
  overflow: hidden;
`;

export const Slide = styled.div<{
  active: boolean;
  background: string;
}>`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.background});
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: scale(1.05);
  transition:
    opacity 0.8s ease,
    transform 0.8s ease;

  ${({ active }) =>
    active &&
    css`
      opacity: 1;
      transform: scale(1);
      z-index: 1;
    `}

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0.15)
    );
  }
`;

export const Content = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;

  span {
    font-size: 0.85rem;
    opacity: 0.9;
  }

  strong {
    margin-top: 8px;
    font-size: 1.9rem;
    line-height: 1.2;
    max-width: 520px;
  }
`;
