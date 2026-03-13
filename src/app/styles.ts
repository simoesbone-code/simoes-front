"use client";

import styled from "styled-components";

export const Container = styled.main`
  min-height: 100vh;
  background: #ffffff;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 18px 20px 70px;

  @media (max-width: 768px) {
    padding: 14px 14px 60px;
  }
`;