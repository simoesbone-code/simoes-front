"use client";

import axios from "@/lib/axios";
import { useMemo, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PropsProduct } from "@/types/product";
import ProductList from "../ProductList";

import {
  FiArrowLeft,
  FiSearch,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import PageLoading from "../PageLoading/page";

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

  useEffect(() => {
    if (!selectedCategory && Object.keys(productsByCategory).length > 0) {
      setSelectedCategory(Object.keys(productsByCategory)[0]);
    }
  }, [productsByCategory, selectedCategory]);

  const bannerProduct =
    selectedCategory && productsByCategory[selectedCategory]
      ? productsByCategory[selectedCategory][0]
      : null;

  const filteredProducts =
    selectedCategory && productsByCategory[selectedCategory]
      ? productsByCategory[selectedCategory].filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

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
    <main className="min-h-screen bg-[#fffaf5] px-3 py-4 text-neutral-900 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-[1180px]">
        {/* TOPO */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:gap-3 md:flex-row md:items-center">
            {adm === "admin" ? null : (
              <button
                onClick={() => {
                  setLoading(true);
                  router.push("/");
                }}
                className="inline-flex h-11 w-fit items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 text-sm font-semibold text-[#9a3412] transition hover:bg-orange-50 hover:border-orange-300"
              >
                <FiArrowLeft size={18} />
                Voltar
              </button>
            )}

            <div>
              <h1 className="text-2xl font-black leading-tight text-neutral-900 sm:text-3xl">
                Catálogo
              </h1>
              <p className="mt-1 text-sm leading-6 text-neutral-500 sm:text-[15px]">
                Explore as categorias e encontre os produtos com mais facilidade.
              </p>
            </div>
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <button
              onClick={() => setOpenSearch((p) => !p)}
              className="inline-flex h-11 w-11 min-w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_14px_28px_rgba(249,115,22,0.20)] transition hover:-translate-y-[1px] hover:shadow-[0_18px_34px_rgba(249,115,22,0.28)]"
            >
              <FiSearch size={18} />
            </button>

            {openSearch && (
              <input
                ref={inputRef}
                placeholder="Buscar produto"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-2xl border border-orange-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none placeholder:text-neutral-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 md:w-[280px]"
              />
            )}
          </div>
        </div>

        {/* HERO */}
        {bannerProduct && (
          <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)] lg:gap-5">
            {/* BANNER */}
            <div className="relative min-h-[230px] overflow-hidden rounded-[22px] border border-orange-200 bg-neutral-900 shadow-[0_24px_60px_rgba(249,115,22,0.12)] sm:min-h-[280px] sm:rounded-[26px] lg:min-h-[360px] lg:rounded-[30px]">
              <div
                className="absolute inset-0 scale-[1.04] bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerProduct.image.url})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,24,39,0.72)_0%,rgba(17,24,39,0.32)_45%,rgba(17,24,39,0.1)_100%),linear-gradient(180deg,rgba(17,24,39,0.08)_0%,rgba(17,24,39,0.3)_100%)]" />

              <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-5 sm:p-6 lg:p-8">
                <span className="inline-flex w-fit rounded-full bg-orange-500 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white sm:text-xs">
                  Categoria em destaque
                </span>

                <h2 className="max-w-[600px] text-2xl font-black leading-tight text-white sm:text-3xl lg:text-[2.5rem] lg:leading-[1.02]">
                  {selectedCategory}
                </h2>

                <p className="max-w-[520px] text-sm leading-6 text-white/90 sm:text-[15px] sm:leading-7">
                  Produtos organizados para uma navegação mais bonita, rápida e
                  profissional.
                </p>
              </div>
            </div>

            {/* CARD LATERAL AJUSTADO PARA MOBILE */}
            <aside
              className="
                flex flex-col justify-between gap-4
                rounded-2xl border border-orange-100 bg-white
                p-4 shadow-sm
                sm:gap-5 sm:rounded-[26px] sm:p-6
                lg:rounded-[30px] lg:p-7
              "
            >
              <div>
                <span
                  className="
                    inline-flex rounded-full bg-orange-50 px-3 py-1
                    text-[10px] font-extrabold uppercase tracking-[0.16em]
                    text-orange-600
                    sm:text-xs
                  "
                >
                  Catálogo moderno
                </span>

                <h2
                  className="
                    mt-3 text-xl font-black leading-tight text-neutral-900
                    sm:mt-4 sm:text-2xl
                    lg:text-[1.7rem]
                  "
                >
                  Uma vitrine mais elegante para seus produtos
                </h2>

                <p
                  className="
                    mt-3 text-sm leading-6 text-neutral-600
                    sm:text-[15px] sm:leading-7
                  "
                >
                  Selecione uma categoria, pesquise por nome e encontre os itens
                  com uma apresentação mais clara tanto no celular quanto no
                  desktop.
                </p>
              </div>

              <div className="grid gap-2.5 sm:gap-3">
                <div
                  className="
                    rounded-xl border border-orange-100 bg-[#fffaf5]
                    px-3 py-3 text-sm leading-5 text-[#7c2d12]
                    sm:rounded-2xl sm:px-4
                  "
                >
                  Navegação mais intuitiva entre categorias.
                </div>

                <div
                  className="
                    rounded-xl border border-orange-100 bg-[#fffaf5]
                    px-3 py-3 text-sm leading-5 text-[#7c2d12]
                    sm:rounded-2xl sm:px-4
                  "
                >
                  Busca rápida para localizar produtos com facilidade.
                </div>

                <div
                  className="
                    rounded-xl border border-orange-100 bg-[#fffaf5]
                    px-3 py-3 text-sm leading-5 text-[#7c2d12]
                    sm:rounded-2xl sm:px-4
                  "
                >
                  Estrutura responsiva com aparência mais premium.
                </div>
              </div>
            </aside>
          </section>
        )}

        {/* CATEGORIAS */}
        <section className="mb-7">
          <div className="mb-4">
            <h3 className="text-xl font-black text-neutral-900">Categorias</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-500 sm:text-[15px]">
              Escolha uma categoria para visualizar os produtos relacionados.
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
            {Object.entries(productsByCategory).map(([category, items]) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex w-[92px] min-w-[92px] flex-col items-center gap-2 rounded-[22px] bg-white p-2 transition sm:w-[104px] sm:min-w-[104px] sm:rounded-[26px] sm:p-[10px] ${
                    isActive
                      ? "border-2 border-orange-500 shadow-[0_18px_34px_rgba(249,115,22,0.16)]"
                      : "border border-neutral-200 shadow-[0_10px_22px_rgba(15,23,42,0.04)] hover:-translate-y-[2px] hover:border-orange-300"
                  }`}
                >
                  <img
                    src={items[0].image.url}
                    alt={category}
                    className="h-[68px] w-[68px] rounded-[18px] object-cover sm:h-[76px] sm:w-[76px] sm:rounded-[22px]"
                  />

                  <span
                    className={`block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold leading-4 sm:text-[13px] ${
                      isActive ? "text-orange-600" : "text-neutral-700"
                    }`}
                  >
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRODUTOS */}
        <section>
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[32vh] items-center justify-center rounded-[24px] border border-dashed border-orange-300 bg-orange-50 px-6 py-10 text-center text-base font-extrabold text-orange-700 sm:min-h-[42vh] sm:text-xl">
              Nenhum produto encontrado
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black leading-tight text-neutral-900 sm:text-[2rem]">
                    {selectedCategory}
                  </h2>
                  <p className="mt-2 max-w-[760px] text-sm leading-6 text-neutral-500 sm:text-[15px] sm:leading-7">
                    Confira os itens disponíveis nesta categoria e selecione o
                    que melhor combina com sua necessidade.
                  </p>
                </div>

                <span className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-orange-100 bg-white px-4 text-sm font-bold text-orange-600">
                  {filteredProducts.length} produto
                  {filteredProducts.length !== 1 ? "s" : ""}
                </span>
              </div>

              <ProductList
                products={filteredProducts}
                isAdmin={adm === "admin"}
                onSelect={setSelectedProduct}
              />
            </>
          )}
        </section>
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[4px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-2xl"
          >
            <h3 className="text-xl font-black leading-7 text-neutral-900">
              {selectedProduct.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Escolha a ação que deseja realizar para este produto.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handleDelete(selectedProduct._id)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-red-600 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <FiTrash2 />
                Deletar
              </button>

              <button
                onClick={() => handleUpdate(selectedProduct)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white transition hover:brightness-95"
              >
                <FiEdit2 />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      )}

      <PageLoading visible={loading} />
    </main>
  );
}