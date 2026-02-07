"use client";

import axios from "@/lib/axios";
import styled from "styled-components";
import { useMemo, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PropsProduct } from "@/types/product";
import ProductList from "../ProductList";

import { FiArrowLeft } from "react-icons/fi";
import PageLoading from "../PageLoading/page";

type CategoryButtonProps = {
  active: boolean;
};

/* ================== STYLES ================== */

const Page = styled.main`
  min-height: 100vh;
  padding: 24px 16px 80px;
`;

/* ===== TOP BAR ===== */

const TopBar = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #000;
  cursor: pointer;

  &:hover {
    color: #f97316;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: #d97745;
  color: #fff;
  cursor: pointer;
`;

const SearchInput = styled.input`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 220px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;

  &:focus {
    outline: none;
    border-color: #d97745;
  }
`;

/* ===== BANNER ===== */

const Banner = styled.section`
  max-width: 1100px;
  margin: 32px auto 36px;
  position: relative;
  height: 180px;
  border-radius: 20px;
  overflow: hidden;
`;

const BannerImage = styled.div<{ image: string }>`
  position: absolute;
  inset: 0;
  background-image: url(${(p) => p.image});
  background-size: cover;
  background-position: center;
  filter: blur(5px) brightness(0.55);
  transform: scale(1.1);
`;

const BannerContent = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 24px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BannerTitle = styled.h1`
  color: #fff;
  font-size: 1.9rem;
  font-weight: 800;
`;

const BannerSubtitle = styled.p`
  color: #f97316;
  font-size: 1rem;
  font-weight: 600;
`;

/* ===== CATEGORIES ===== */

export const Categories = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 8px;

  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryButton = styled.button<CategoryButtonProps>`
  flex: 0 0 auto;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;

  border: ${({ active }) =>
    active ? "3px solid #f97316" : "2px solid #e5e7eb"};

  @media (min-width: 1024px) {
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }
`;

export const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

/* ===== CONTENT ===== */

const Content = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const CategoryTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 800;
  color: #f97316;
  margin-bottom: 24px;
`;

const EmptyState = styled.div`
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
  font-size: 1.6rem;
  font-weight: 700;
`;

/* ===== MODAL ===== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #111827;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 320px;
  color: #fff;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #dc2626;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const UpdateButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #f97316;
  color: #fff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

/* ================== PAGE ================== */

type Props = {
  products?: PropsProduct[];
  adm?: string;
  refetch: () => void;
};

export default function CatalogPage({ products, adm, refetch }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PropsProduct | null>(
    null,
  );

  useEffect(() => {
    if (openSearch) inputRef.current?.focus();
  }, [openSearch]);

  /* ===== GROUP BY CATEGORY ===== */
  const productsByCategory = useMemo(() => {
    if (!products) return {};

    return products.reduce(
      (acc, product) => {
        const category = product.category || "Outros";
        acc[category] = acc[category] || [];
        acc[category].push(product);
        return acc;
      },
      {} as Record<string, PropsProduct[]>,
    );
  }, [products]);

  /* ===== DEFAULT CATEGORY ===== */
  useEffect(() => {
    if (!selectedCategory && Object.keys(productsByCategory).length > 0) {
      setSelectedCategory(Object.keys(productsByCategory)[0]);
    }
  }, [productsByCategory, selectedCategory]);

  /* ===== BANNER PRODUCT ===== */
  const bannerProduct =
    selectedCategory && productsByCategory[selectedCategory]
      ? productsByCategory[selectedCategory][0]
      : null;

  /* ===== FILTERED PRODUCTS ===== */
  const filteredProducts =
    selectedCategory && productsByCategory[selectedCategory]
      ? productsByCategory[selectedCategory].filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  /* ===== ACTIONS ===== */
  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    await axios.delete(`product/delete-product/${id}`);
    await refetch();
    setSelectedProduct(null);
  };

  const handleUpdate = (product: PropsProduct) => {
    router.push(`${pathname}/formProduct?id=${product._id}`);
  };

  return (
    <Page>
      <TopBar>
        {adm === "admin" ? (
          <div />
        ) : (
          <BackButton
            onClick={() => {
              setLoading(true);
              router.push("/");
            }}
          >
            <FiArrowLeft size={20} />
            Voltar
          </BackButton>
        )}

        <SearchWrapper>
          <SearchButton onClick={() => setOpenSearch((p) => !p)}>
            🔍
          </SearchButton>

          {openSearch && (
            <SearchInput
              ref={inputRef}
              placeholder="Buscar produto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}
        </SearchWrapper>
      </TopBar>

      {/* ===== BANNER ===== */}
      {bannerProduct && (
        <Banner>
          <BannerImage image={bannerProduct.image.url} />
          <BannerContent>
            <BannerTitle>{selectedCategory}</BannerTitle>
            <BannerSubtitle>Modelos para varejo e atacado</BannerSubtitle>
          </BannerContent>
        </Banner>
      )}

      {/* ===== CATEGORIES ===== */}
      <Categories>
        {Object.entries(productsByCategory).map(([category, items]) => (
          <CategoryButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            <CategoryImage src={items[0].image.url} />
          </CategoryButton>
        ))}
      </Categories>

      {/* ===== PRODUCTS ===== */}
      <Content>
        {filteredProducts.length === 0 ? (
          <EmptyState>Nenhum produto encontrado</EmptyState>
        ) : (
          <>
            <CategoryTitle>{selectedCategory}</CategoryTitle>

            <ProductList
              products={filteredProducts}
              isAdmin={adm === "admin"}
              onSelect={setSelectedProduct}
            />
          </>
        )}
      </Content>

      {selectedProduct && (
        <ModalOverlay onClick={() => setSelectedProduct(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>{selectedProduct.name}</h3>

            <ModalActions>
              <DeleteButton onClick={() => handleDelete(selectedProduct._id)}>
                Deletar
              </DeleteButton>

              <UpdateButton onClick={() => handleUpdate(selectedProduct)}>
                Atualizar
              </UpdateButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      <PageLoading visible={loading} />
    </Page>
  );
}
