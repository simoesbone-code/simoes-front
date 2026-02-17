import styled from "styled-components";

/* GRID */
export const List = styled.section`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

/* CARD */
export const Card = styled.article`
  background: #ffffff;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
`;

/* IMAGEM */
export const ImageBox = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* TITULO */
export const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
`;

/* PREÇOS */
export const Prices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PriceTag = styled.div`
  background: #d97745;
  color: #fff;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 600;

  display: flex;
  justify-content: space-between;

  span {
    font-weight: 700;
  }
`;
