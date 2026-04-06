"use client";

import { PropsProduct } from "@/types/product";
import { FiMove } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ProductListProps = {
  products: PropsProduct[];
  isAdmin?: boolean;
  onSelect?: (product: PropsProduct) => void;
  sortable?: boolean;
  productNumbers?: Record<string, number>;
};

function formatCurrency(value: number | string | undefined) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(String(value).replace(",", "."))
        : 0;

  if (Number.isNaN(numericValue)) return "R$ 0,00";

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatProductCode(value: number) {
  return `#${String(value).padStart(4, "0")}`;
}

function SortableProductCard({
  product,
  isAdmin,
  onSelect,
  sortable,
  productNumber,
}: {
  product: PropsProduct;
  isAdmin?: boolean;
  onSelect?: (product: PropsProduct) => void;
  sortable?: boolean;
  productNumber?: number;
}) {
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: product._id,
      disabled: !sortable,
    });

  const style = sortable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined;

  const handleCardClick = () => {
    if (isAdmin && onSelect) {
      onSelect(product);
      return;
    }

    const params = new URLSearchParams();

    if (productNumber) {
      params.set("code", formatProductCode(productNumber));
    }

    if (product?.category) {
      params.set("category", product.category);
    }

    const query = params.toString();
    router.push(`/catalog/${product._id}${query ? `?${query}` : ""}`);
  };

  const imageUrl =
    product?.image?.url ||
    (Array.isArray((product as any)?.images) &&
      (product as any)?.images[0]?.url) ||
    "/images/sem-imagem.png";

  const price =
    (product as any)?.priceUnit ??
    (product as any)?.salePrice ??
    (product as any)?.price ??
    0;

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <div
        onClick={handleCardClick}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] border border-orange-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(249,115,22,0.14)]"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-[#fff7ed]">
          <img
            src={imageUrl}
            alt={product?.name || "Produto"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />

          {typeof productNumber === "number" && (
            <span className="absolute left-3 top-3 inline-flex h-9 items-center justify-center rounded-full bg-orange-400/70 px-3 text-xs font-extrabold tracking-[0.12em] text-white backdrop-blur-sm">
              {formatProductCode(productNumber)}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="line-clamp-2 min-h-[48px] text-[15px] font-extrabold leading-6 text-neutral-900 sm:text-base">
            {product?.name}
          </h3>

          <p className="mt-2 text-lg font-black text-orange-600 sm:text-[1.15rem]">
            {formatCurrency(price)}
          </p>

          {product?.category && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit rounded-full bg-orange-50 px-3 py-1 text-[11px] font-bold text-orange-700">
                {product.category}
              </span>

              {typeof productNumber === "number" && (
                <span className="inline-flex w-fit rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-extrabold text-neutral-700">
                  Código {formatProductCode(productNumber)}
                </span>
              )}
            </div>
          )}

          <div className="mt-auto pt-4">
            {sortable && (
              <div className="flex justify-center">
                <button
                  type="button"
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex h-8 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 shadow-sm touch-none active:cursor-grabbing"
                >
                  <FiMove size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductList({
  products,
  isAdmin,
  onSelect,
  sortable,
  productNumbers = {},
}: ProductListProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <SortableProductCard
          key={product._id}
          product={product}
          isAdmin={isAdmin}
          onSelect={onSelect}
          sortable={sortable}
          productNumber={productNumbers[product._id]}
        />
      ))}
    </div>
  );
}
