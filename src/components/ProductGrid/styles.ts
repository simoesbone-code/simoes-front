"use client";

import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #ececec;
  transition: 0.28s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: #dddddd;
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.06);
  }
`;

export const ImageBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.12;
  overflow: hidden;
  background: #f6f6f6;

  img {
    transition: transform 0.4s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.03);
  }
`;

export const Info = styled.div`
  padding: 16px 16px 18px;

  h3 {
    font-size: 1rem;
    line-height: 1.4;
    color: #111827;
    font-weight: 600;
    margin-bottom: 6px;
  }

  span {
    font-size: 0.92rem;
    color: #6b7280;
  }
`;

export const SkeletonCard = styled.div`
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid #ececec;
  background: #ffffff;

  .image,
  .title,
  .subtitle {
    background: linear-gradient(90deg, #ececec 25%, #f5f5f5 37%, #ececec 63%);
    background-size: 800px 100%;
    animation: ${shimmer} 1.4s linear infinite;
  }

  .image {
    width: 100%;
    aspect-ratio: 1 / 1.12;
  }

  .title {
    height: 16px;
    margin: 16px 16px 8px;
    border-radius: 8px;
  }

  .subtitle {
    height: 13px;
    width: 58%;
    margin: 0 16px 18px;
    border-radius: 8px;
  }
`;