"use client";
import styled from "styled-components";

export const Grid = styled.section`
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 420px;
  margin: 0 auto;

  /* 📱 Tablet */
  @media (min-width: 640px) {
    max-width: 700px;
    gap: 20px;
  }

  /* 💻 Notebook */
  @media (min-width: 1024px) {
    max-width: 900px;
    gap: 24px;
  }
`;

export const Card = styled.div`
  background: #f3f4f6;
  border-radius: 14px;
  padding: 14px;

  .image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 10px;

    img {
      object-fit: cover;
    }
  }

  h3 {
    font-size: 0.95rem;
  }

  span {
    font-size: 0.8rem;
  }

  /* 💻 cresce no desktop */
  @media (min-width: 1024px) {
    padding: 18px;

    h3 {
      font-size: 1.05rem;
    }

    span {
      font-size: 0.85rem;
    }
  }
`;

export const SkeletonCard = styled.div`
  background: #f3f4f6;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .image {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e0e0e0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .title {
    width: 70%;
    height: 16px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e0e0e0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .subtitle {
    width: 50%;
    height: 12px;
    border-radius: 8px;
    background: linear-gradient(90deg, #f3f4f6 25%, #e0e0e0 50%, #f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
