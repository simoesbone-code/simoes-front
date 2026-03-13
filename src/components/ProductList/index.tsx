"use client";

import { PropsProduct } from "@/types/product";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PageLoading from "../PageLoading/page";

type Props = {
  products: PropsProduct[] | undefined;
  isAdmin: boolean;
  onSelect?: (product: PropsProduct) => void;
};

const formatPrice = (value: number | string) => {
  const number = Number(value);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export default function ProductList({ products, isAdmin, onSelect }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigate = (id: string) => {
    setLoading(true);
    router.push(`/catalog/${id}`);
  };

  const handleCardClick = (item: PropsProduct) => {
    if (isAdmin) {
      onSelect?.(item);
      return;
    }

    handleNavigate(item._id);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {products?.map((item) => (
          <button
            key={item._id}
            type="button"
            onClick={() => handleCardClick(item)}
            className="
              group overflow-hidden rounded-[20px] border border-orange-100 bg-white text-left
              shadow-[0_10px_24px_rgba(15,23,42,0.05)]
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(249,115,22,0.12)]
              focus:outline-none focus:ring-4 focus:ring-orange-100
            "
          >
            <div className="relative aspect-[1/1] overflow-hidden bg-[#fff7ed]">
              <img
                src={item.image.url}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />

              <div className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-orange-600 shadow-sm sm:left-3 sm:top-3">
                {isAdmin ? "Admin" : "Produto"}
              </div>
            </div>

            <div className="p-3 sm:p-4">
              <h3 className="line-clamp-2 min-h-[42px] text-sm font-extrabold leading-5 text-neutral-900 sm:min-h-[48px] sm:text-[15px] sm:leading-6">
                {item.name}
              </h3>

              <div className="mt-3 grid gap-2">
                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-3 py-2.5 sm:px-4 sm:py-3">
                  <span className="block text-[11px] font-medium text-neutral-500 sm:text-xs">
                    Unidade
                  </span>
                  <span className="mt-1 block text-sm font-extrabold text-orange-600 sm:text-base">
                    {formatPrice(item.priceUnit)}
                  </span>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-[#fffaf5] px-3 py-2.5 sm:px-4 sm:py-3">
                  <span className="block text-[11px] font-medium text-neutral-500 sm:text-xs">
                    Atacado
                  </span>
                  <span className="mt-1 block text-sm font-extrabold text-orange-600 sm:text-base">
                    {formatPrice(item.priceWholesale)}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 sm:text-[11px]">
                  {isAdmin ? "Gerenciar" : "Ver detalhes"}
                </span>

                <span className="rounded-full bg-orange-500 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition group-hover:bg-orange-600 sm:px-3">
                  {isAdmin ? "Ações" : "Abrir"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <PageLoading visible={loading} />
    </>
  );
}