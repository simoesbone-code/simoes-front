"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useQuery } from "@tanstack/react-query";
import { CgProfile } from "react-icons/cg";
import { IoHomeSharp } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";

import { getProduct, getBanner } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import { PropsBanner } from "@/types/banner";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import PageLoading from "@/components/PageLoading/page";

export default function Home() {
  const router = useRouter();

  const [credentialVerifier, setCredentialVerifier] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  const { "nextauth.token": tokenParse } = parseCookies();
  const { "nextauth.userId": tokenUserId } = parseCookies();

  const { data: dataProduct, isLoading: isLoadingProducts } = useQuery<
    PropsProduct[]
  >({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  const { data: dataBanner = [], isLoading: isLoadingBanner } = useQuery<
    PropsBanner[]
  >({
    queryKey: ["Banner"],
    queryFn: getBanner,
  });

  useEffect(() => {
    setCredentialVerifier(Boolean(tokenParse && tokenUserId));
  }, [tokenParse, tokenUserId]);

  useEffect(() => {
    if (dataBanner.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) =>
        prev === dataBanner.length - 1 ? 0 : prev + 1,
      );
    }, 4500);

    return () => clearInterval(interval);
  }, [dataBanner]);

  const handleNavigateProfile = () => {
    setPageLoading(true);

    if (credentialVerifier && tokenUserId) {
      router.push(`/dashboard/admin/${tokenUserId}`);
    } else {
      router.push("/auth");
    }
  };

  const handleNavigateCatalog = () => {
    setPageLoading(true);
    router.push("/catalog");
  };

  const productsRandom = useMemo(() => {
    if (!dataProduct) return [];
    return [...dataProduct].sort(() => Math.random() - 0.5).slice(0, 7);
  }, [dataProduct]);

  const featuredProduct = productsRandom[0];
  const secondaryProducts = productsRandom.slice(1, 7);

  return (
    <main className="min-h-screen bg-[#fffaf5] text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] w-full max-w-7xl items-center justify-between px-4 sm:h-[84px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dz46wt0iy/image/upload/fl_preserve_transparency/v1769912818/1769912016331_ox3dlk.jpg?_s=public-apps"
              alt="Logo da loja"
              className="h-[42px] w-auto object-contain sm:h-[50px] lg:h-[54px]"
            />
          </div>

          <button
            onClick={handleNavigateProfile}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-white text-[1.25rem] text-orange-500 transition-all duration-300 hover:bg-orange-50 hover:shadow-md"
            aria-label="Acessar perfil"
          >
            {credentialVerifier ? <IoHomeSharp /> : <CgProfile />}
          </button>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.55fr_0.85fr] lg:gap-6">
          <div className="overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_22px_60px_rgba(249,115,22,0.08)] sm:rounded-[30px]">
            <div className="relative h-[220px] sm:h-[360px] lg:h-[520px]">
              {isLoadingBanner ? (
                <div className="h-full w-full animate-pulse bg-neutral-200" />
              ) : dataBanner.length > 0 ? (
                <>
                  {dataBanner.map((banner, index) => (
                    <div
                      key={banner._id}
                      className={`absolute inset-0 transition-all duration-700 ${
                        index === currentBanner
                          ? "z-10 scale-100 opacity-100"
                          : "z-0 scale-[1.015] opacity-0"
                      }`}
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${banner.image.url})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    </div>
                  ))}

                  {dataBanner.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/70 px-3 py-2 backdrop-blur-md">
                      {dataBanner.map((_, index) => (
                        <span
                          key={index}
                          className={`h-[7px] rounded-full transition-all duration-300 ${
                            index === currentBanner
                              ? "w-7 bg-orange-500"
                              : "w-2 bg-orange-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-100 text-neutral-500">
                  Nenhum banner disponível
                </div>
              )}
            </div>
          </div>

          <aside className="grid gap-4 sm:gap-5">
            <div className="rounded-[22px] border border-orange-100 bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-7">
              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-xs">
                Nova coleção
              </span>

              <h1 className="mt-3 text-lg font-bold leading-tight text-neutral-900 sm:mt-4 sm:text-3xl">
                Uma vitrine mais forte para destacar seus produtos
              </h1>

              <p className="mt-3 text-sm leading-6 text-neutral-600 sm:mt-4 sm:text-base sm:leading-7">
                Organize seu catálogo com um visual mais sofisticado, melhor
                leitura no celular e uma apresentação que valoriza cada item de
                forma mais profissional.
              </p>

              <div className="mt-4 grid gap-2 sm:mt-6 sm:gap-3">
                <div className="rounded-xl border border-orange-100 bg-[#fff7ed] px-3 py-2.5 text-sm text-neutral-700 sm:rounded-2xl sm:px-4 sm:py-3">
                  Layout pensado para destacar imagem e produto.
                </div>
                <div className="rounded-xl border border-orange-100 bg-[#fff7ed] px-3 py-2.5 text-sm text-neutral-700 sm:rounded-2xl sm:px-4 sm:py-3">
                  Estrutura moderna, limpa e confortável no mobile.
                </div>
                <div className="rounded-xl border border-orange-100 bg-[#fff7ed] px-3 py-2.5 text-sm text-neutral-700 sm:rounded-2xl sm:px-4 sm:py-3">
                  Botões e elementos com identidade mais marcante.
                </div>
              </div>

              <button
                onClick={handleNavigateCatalog}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg sm:mt-7 sm:rounded-2xl sm:px-5 sm:py-3.5"
              >
                Explorar catálogo
                <FiArrowRight />
              </button>
            </div>

            {featuredProduct && !isLoadingProducts ? (
              <div className="overflow-hidden rounded-[22px] border border-orange-100 bg-white shadow-sm sm:rounded-[30px]">
                <div className="relative flex h-[190px] items-center justify-center bg-[#fff7ed] p-4 sm:h-[230px] sm:p-5">
                  <Image
                    src={featuredProduct.image.url}
                    alt={featuredProduct.image.filename}
                    fill={false}
                    width={420}
                    height={420}
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-orange-600 shadow-sm sm:left-4 sm:top-4">
                    Destaque
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <h2 className="line-clamp-2 text-lg font-bold leading-6 text-neutral-900 sm:text-xl sm:leading-7">
                    {featuredProduct.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-500 sm:mt-3">
                    Veja mais detalhes e consulte disponibilidade no catálogo
                    completo.
                  </p>

                  <button
                    onClick={handleNavigateCatalog}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700 sm:mt-5"
                  >
                    Ver produto
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[22px] border border-orange-100 bg-white shadow-sm sm:rounded-[30px]">
                <div className="h-[190px] animate-pulse bg-neutral-200 sm:h-[230px]" />
                <div className="p-4 sm:p-6">
                  <div className="mb-3 h-5 w-[80%] animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-[55%] animate-pulse rounded bg-neutral-200" />
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-2 pt-2 sm:px-6 sm:pt-4 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-orange-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600 sm:text-xs">
              Seleção especial
            </span>

            <h2 className="text-xl font-bold leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
              Produtos escolhidos para uma vitrine mais elegante
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
              Uma grade de produtos pensada para dar mais presença visual,
              organização e sofisticação à sua loja.
            </p>
          </div>

          <button
            onClick={handleNavigateCatalog}
            className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-600 transition-all duration-300 hover:bg-orange-50 sm:rounded-2xl sm:px-5"
          >
            Ver catálogo completo
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {isLoadingProducts ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[20px] border border-orange-100 bg-white sm:rounded-[28px]"
              >
                <div className="aspect-[1/1] animate-pulse bg-neutral-200 sm:aspect-[1/0.9]" />
                <div className="p-4 sm:p-5">
                  <div className="mb-3 h-5 w-[80%] animate-pulse rounded bg-neutral-200" />
                  <div className="mb-2 h-4 w-[50%] animate-pulse rounded bg-neutral-200" />
                  <div className="h-10 w-[120px] animate-pulse rounded-full bg-neutral-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {secondaryProducts.map((item) => (
              <article
                key={item._id}
                className="group overflow-hidden rounded-[20px] border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(249,115,22,0.10)] sm:rounded-[28px]"
              >
                <div className="relative flex aspect-[1/1] items-center justify-center overflow-hidden bg-[#fff7ed] p-3 sm:aspect-[1/0.9] sm:p-5">
                  <Image
                    src={item.image.url}
                    alt={item.image.filename}
                    fill={false}
                    width={360}
                    height={360}
                    className="max-h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>

                <div className="p-3 sm:p-6">
                  <h3 className="line-clamp-2 text-sm font-bold leading-5 text-neutral-900 sm:text-lg sm:leading-7">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-neutral-500 sm:text-sm sm:leading-6">
                    Consulte disponibilidade e descubra mais opções no catálogo
                    completo.
                  </p>

                  <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <button
                      onClick={handleNavigateCatalog}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:bg-orange-600 sm:px-4 sm:py-2.5 sm:text-sm"
                    >
                      Ver produto
                      <FiArrowRight />
                    </button>

                    <span className="text-[10px] uppercase tracking-[0.16em] text-neutral-400 sm:text-xs">
                      Disponível
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <WhatsAppFloatingButton
        phone="5583998033753"
        message="Olá! Vim pelo site e gostaria de saber mais."
      />

      <PageLoading visible={pageLoading} />
    </main>
  );
}