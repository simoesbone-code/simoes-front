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
import { Footer } from "@/components/ContactFooter";

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
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-[74px] w-full max-w-7xl items-center justify-between px-4 sm:h-[84px] sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="https://res.cloudinary.com/dz46wt0iy/image/upload/v1775007158/ChatGPT_Image_31_de_mar._de_2026_22_31_37_rekjvh.png"
              alt="Logo da loja"
              className="h-[85px] w-auto object-contain sm:h-[90px] lg:h-[90px]"
            />
          </div>

          <button
            onClick={handleNavigateProfile}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-200 bg-white text-[1.25rem] text-orange-500 transition-all duration-300 hover:bg-orange-50 hover:shadow-md"
          >
            {credentialVerifier ? <IoHomeSharp /> : <CgProfile />}
          </button>
        </div>
      </header>

      {/* 🔥 BANNER AJUSTADO */}
      <section className="w-full py-0 sm:px-6 sm:py-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="overflow-hidden sm:border sm:border-orange-100 sm:bg-white sm:shadow-[0_22px_60px_rgba(249,115,22,0.08)]">
            <div className="relative h-[220px] w-full sm:h-[360px] lg:h-[520px]">
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
        </div>
      </section>

      {/* PRODUTOS */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="rounded-[22px] border border-orange-100 bg-white p-4 shadow-sm sm:rounded-[30px] sm:p-7">
          <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-xs">
            Nova coleção
          </span>

          <h1 className="mt-3 text-lg font-bold leading-tight text-neutral-900 sm:mt-4 sm:text-3xl">
            Preço baixo e qualidade é aqui — a vitrine perfeita para destacar
            seus produtos.
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-600 sm:mt-4 sm:text-base sm:leading-7">
            Preço baixo e qualidade que se destacam em uma vitrine moderna, com
            melhor leitura no celular e uma apresentação que valoriza cada
            produto de forma mais profissional.
          </p>

          <button
            onClick={handleNavigateCatalog}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-[20px] font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-lg sm:mt-7 sm:w-auto sm:rounded-2xl sm:px-5 sm:py-3.5"
          >
            Explorar catálogo
            <FiArrowRight />
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {isLoadingProducts ? (
          <div className="mt-10 text-center text-neutral-500">
            Carregando produtos...
          </div>
        ) : (
          <>
            {featuredProduct && (
              <div className="mt-8">
                <div
                  onClick={() => router.push(`/catalog/${featuredProduct._id}`)}
                  className="relative cursor-pointer overflow-hidden rounded-[28px] bg-white shadow-md transition hover:shadow-lg"
                >
                  <div className="relative h-[300px] w-full sm:h-[420px] lg:h-[520px]">
                    <Image
                      src={featuredProduct.image.url}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                    <h3 className="text-xl font-bold sm:text-2xl">
                      {featuredProduct.name}
                    </h3>

                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                      Ver detalhes <FiArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {secondaryProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => router.push(`/catalog/${product._id}`)}
                  className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-[160px] w-full sm:h-[200px]">
                    <Image
                      src={product.image.url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <h4 className="line-clamp-2 text-sm font-semibold text-neutral-800">
                      {product.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <WhatsAppFloatingButton
        phone="5583998033753"
        message="Olá! Vim pelo site e gostaria de saber mais."
      />

      <PageLoading visible={pageLoading} />

      <Footer />
    </main>
  );
}
