"use client";

import { Footer } from "@/components/ContactFooter";
import PageLoading from "@/components/PageLoading/page";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { getProduct } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiArrowLeft, FiTag, FiShoppingBag } from "react-icons/fi";

export default function ProductPage() {
  const { data: dataProduct } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  const router = useRouter();
  const { producId } = useParams();
  const [loading, setLoading] = useState(false);

  const product = dataProduct?.find((p) => p._id === producId);

  const formatPrice = (value: number | string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  };

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf5] px-6">
        <div className="rounded-[28px] border border-orange-100 bg-white px-8 py-10 text-center shadow-sm">
          <h1 className="text-2xl font-black text-orange-600 sm:text-3xl">
            Produto não encontrado
          </h1>
          <p className="mt-3 text-sm leading-6 text-neutral-500 sm:text-base">
            Não foi possível localizar este item no catálogo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#fffaf5] px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <div className="mx-auto max-w-6xl">
          {/* TOPO */}
          <div className="mb-5 flex items-center justify-between gap-4">
            <button
              onClick={() => {
                setLoading(true);
                router.push("/catalog");
              }}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
            >
              <FiArrowLeft size={18} />
              Voltar
            </button>
          </div>

          {/* CONTEÚDO */}
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:gap-8">
            {/* IMAGEM */}
            <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm">
              <div className="relative aspect-[1/1] w-full overflow-hidden bg-[#fff7ed]">
                <img
                  src={product.image.url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-orange-600 shadow-sm">
                  <FiShoppingBag size={12} />
                  Produto
                </div>
              </div>
            </div>

            {/* INFORMAÇÕES */}
            <div className="flex flex-col justify-between rounded-[28px] border border-orange-100 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
              <div>
                <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-600 sm:text-xs">
                  Detalhes do produto
                </span>

                <h1 className="mt-4 text-2xl font-black leading-tight text-neutral-900 sm:text-3xl lg:text-4xl">
                  {product.name}
                </h1>

                <p className="mt-4 text-sm leading-7 text-neutral-500 sm:text-base">
                  Confira os valores disponíveis para compra no varejo e no
                  atacado. Para mais informações, fale diretamente pelo
                  WhatsApp.
                </p>

                <div className="mt-6 grid gap-3">
                  <div className="rounded-[22px] border border-orange-100 bg-[#fffaf5] p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                      <FiTag className="text-orange-500" />
                      Varejo
                    </div>

                    <strong className="mt-2 block text-2xl font-black text-orange-600 sm:text-[1.8rem]">
                      {formatPrice(product.priceUnit)}
                    </strong>
                  </div>

                  <div className="rounded-[22px] border border-orange-100 bg-[#fffaf5] p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                      <FiTag className="text-orange-500" />
                      Atacado
                    </div>

                    <strong className="mt-2 block text-2xl font-black text-orange-600 sm:text-[1.8rem]">
                      {formatPrice(product.priceWholesale)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* BLOCO DECORATIVO / CTA */}
              <div className="mt-6 overflow-hidden rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-neutral-900">
                      Gostou deste produto?
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      Entre em contato para consultar disponibilidade, condições
                      e mais detalhes sobre o pedido.
                    </p>
                  </div>

                  <div className="relative hidden h-16 w-16 shrink-0 sm:block">
                    <span className="absolute bottom-0 left-0 h-10 w-10 rounded-full bg-orange-200" />
                    <span className="absolute right-0 top-0 h-8 w-8 rounded-full bg-orange-400" />
                    <span className="absolute bottom-2 right-3 h-5 w-5 rounded-full bg-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <WhatsAppFloatingButton
          phone="5583998033753"
          message={`Olá! Vim pelo site e gostaria de saber mais sobre o produto "${product.name}".`}
        />

        <PageLoading visible={loading} />
      </main>
      <Footer />
    </>
  );
}
