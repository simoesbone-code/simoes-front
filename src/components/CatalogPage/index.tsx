"use client";

import axios from "@/lib/axios";
import { useMemo, useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { PropsProduct } from "@/types/product";
import { CategoryProps } from "@/types/category";
import ProductList from "../ProductList";

import {
  FiArrowLeft,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMove,
} from "react-icons/fi";
import PageLoading from "../PageLoading/page";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  getCatalogConfig,
  saveCategoryOrder,
  saveProductOrder,
  CatalogConfigResponse,
  getCategory,
} from "@/hooks/useClient";

type Props = {
  products?: PropsProduct[];
  adm?: string;
  refetch: () => void;
};

type ProductsByCategory = Record<string, PropsProduct[]>;

function SortableCategoryCard({
  category,
  image,
  isActive,
  onClick,
  sortable,
  onEdit,
  onDelete,
}: {
  category: string;
  image: string;
  isActive: boolean;
  onClick: () => void;
  sortable: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: category,
      disabled: !sortable,
    });

  const style = sortable
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute right-1 top-1 z-10 flex items-center gap-1">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:bg-orange-50"
          >
            <FiEdit2 size={12} className="text-orange-600" />
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shadow-md transition hover:bg-red-50"
          >
            <FiTrash2 size={12} className="text-red-600" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`flex w-[92px] min-w-[92px] flex-col items-center gap-2 rounded-[22px] bg-white p-2 pb-3 transition sm:w-[104px] sm:min-w-[104px] sm:rounded-[26px] sm:p-[10px] sm:pb-3 ${
          isActive
            ? "border-2 border-orange-500 shadow-[0_18px_34px_rgba(249,115,22,0.16)]"
            : "border border-neutral-200 shadow-[0_10px_22px_rgba(15,23,42,0.04)] hover:-translate-y-[2px] hover:border-orange-300"
        }`}
      >
        <img
          src={image}
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

        {sortable && (
          <div
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 inline-flex h-7 w-[44px] items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 shadow-sm touch-none active:cursor-grabbing"
          >
            <FiMove size={14} />
          </div>
        )}
      </button>
    </div>
  );
}

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

  const [categoryOrder, setCategoryOrder] = useState<string[]>([]);
  const [productOrderByCategory, setProductOrderByCategory] = useState<
    Record<string, string[]>
  >({});

  const isAdmin = adm === "admin";

  const { data: configData } = useQuery<CatalogConfigResponse>({
    queryKey: ["catalog-config"],
    queryFn: getCatalogConfig,
    enabled: isAdmin,
  });

  const { data: dataCategory, refetch: refetchCategories } = useQuery<
    CategoryProps[]
  >({
    queryKey: ["Category"],
    queryFn: getCategory,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (openSearch) inputRef.current?.focus();
  }, [openSearch]);

  const productsByCategory = useMemo(() => {
    if (!products) return {};

    return products.reduce((acc, product) => {
      const category = product.category || "Outros";
      acc[category] = acc[category] || [];
      acc[category].push(product);
      return acc;
    }, {} as ProductsByCategory);
  }, [products]);

  const categoriesFromData = useMemo(() => {
    const productCategories = Object.keys(productsByCategory);
    const registeredCategories = (dataCategory || []).map(
      (item) => item.category,
    );

    return [...new Set([...registeredCategories, ...productCategories])];
  }, [productsByCategory, dataCategory]);

  const categoryMap = useMemo(() => {
    if (!dataCategory?.length) return {};

    return dataCategory.reduce(
      (acc, item) => {
        acc[item.category] = item;
        return acc;
      },
      {} as Record<string, CategoryProps>,
    );
  }, [dataCategory]);

  useEffect(() => {
    const backendCategoryOrder = configData?.categoryOrder || [];

    setCategoryOrder(() => {
      if (!categoriesFromData.length) return [];

      const validBackendOrder = backendCategoryOrder.filter((category) =>
        categoriesFromData.includes(category),
      );

      const missingCategories = categoriesFromData.filter(
        (category) => !validBackendOrder.includes(category),
      );

      return [...validBackendOrder, ...missingCategories];
    });

    setSelectedCategory((prev) => {
      if (prev && categoriesFromData.includes(prev)) return prev;
      return categoriesFromData[0] ?? null;
    });

    setProductOrderByCategory(() => {
      const nextState: Record<string, string[]> = {};

      categoriesFromData.forEach((category) => {
        const idsFromData = (productsByCategory[category] || []).map(
          (item) => item._id,
        );
        nextState[category] = idsFromData;
      });

      return nextState;
    });
  }, [categoriesFromData, productsByCategory, configData]);

  const orderedCategories = useMemo(() => {
    return categoryOrder;
  }, [categoryOrder]);

  const orderedProductsByCategory = useMemo(() => {
    const result: ProductsByCategory = {};

    orderedCategories.forEach((category) => {
      const originalItems = productsByCategory[category] || [];
      const savedOrder = productOrderByCategory[category] || [];

      if (!savedOrder.length) {
        result[category] = originalItems;
        return;
      }

      const itemsMap = new Map(originalItems.map((item) => [item._id, item]));
      const orderedItems = savedOrder
        .map((id) => itemsMap.get(id))
        .filter(Boolean) as PropsProduct[];

      const missingItems = originalItems.filter(
        (item) => !orderedItems.some((ordered) => ordered._id === item._id),
      );

      result[category] = [...orderedItems, ...missingItems];
    });

    return result;
  }, [orderedCategories, productsByCategory, productOrderByCategory]);

  const currentProducts =
    selectedCategory && orderedProductsByCategory[selectedCategory]
      ? orderedProductsByCategory[selectedCategory]
      : [];

  const filteredProducts = currentProducts.filter((p) => {
    if (!p || typeof p.name !== "string") return false;
    return p.name.toLowerCase().includes(search.toLowerCase());
  });

  const selectedCategoryData = selectedCategory
    ? categoryMap[selectedCategory]
    : null;

  const bannerImage =
    selectedCategoryData?.image?.url ||
    (selectedCategory && orderedProductsByCategory[selectedCategory]?.length
      ? orderedProductsByCategory[selectedCategory][0]?.image?.url
      : null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await axios.delete(`product/delete-product/${id}`);
      await refetch();
      setSelectedProduct(null);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      window.alert("Erro ao excluir produto.");
    }
  };

  const handleUpdate = (product: PropsProduct) => {
    router.push(`${pathname}/formProduct?id=${product._id}`);
  };

  const handleCategoryEdit = (category: string) => {
    const categoryData = categoryMap[category];
    if (!categoryData) return;

    router.push(
      `${pathname}/formProduct?categoryId=${categoryData._id}&mode=update`,
    );
  };

  const handleCategoryDelete = async (category: string) => {
    const categoryData = categoryMap[category];
    if (!categoryData) return;

    const totalProductsInCategory = productsByCategory[category]?.length || 0;

    if (totalProductsInCategory > 0) {
      window.alert(
        `Não é possível excluir a categoria "${category}" porque existem ${totalProductsInCategory} produto(s) cadastrados nela.`,
      );
      return;
    }

    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a categoria "${category}"?`,
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/category/delete-category/${categoryData._id}`);

      const nextCategories = orderedCategories.filter((item) => item !== category);
      setCategoryOrder(nextCategories);

      setProductOrderByCategory((prev) => {
        const updated = { ...prev };
        delete updated[category];
        return updated;
      });

      if (selectedCategory === category) {
        setSelectedCategory(nextCategories[0] || null);
      }

      await Promise.all([refetch(), refetchCategories()]);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      window.alert("Erro ao excluir categoria.");
    }
  };

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    if (!isAdmin) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = categoryOrder.indexOf(String(active.id));
    const newIndex = categoryOrder.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(categoryOrder, oldIndex, newIndex);

    setCategoryOrder(newOrder);

    try {
      await saveCategoryOrder(newOrder);
    } catch (error) {
      console.error("Erro ao salvar ordem das categorias:", error);
    }
  };

  const handleProductDragEnd = async (event: DragEndEvent) => {
    if (!isAdmin || !selectedCategory) return;

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const visibleIds = currentProducts.map((item) => item._id);
    const oldIndex = visibleIds.indexOf(String(active.id));
    const newIndex = visibleIds.indexOf(String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = arrayMove(visibleIds, oldIndex, newIndex);

    setProductOrderByCategory((prev) => ({
      ...prev,
      [selectedCategory]: newIds,
    }));

    try {
      await saveProductOrder(selectedCategory, newIds);
      await refetch();
    } catch (error) {
      console.error("Erro ao salvar ordem dos produtos:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] px-3 py-4 text-neutral-900 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-[1180px]">
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

        {bannerImage && (
          <section className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)] lg:gap-5">
            <div className="relative min-h-[230px] overflow-hidden rounded-[22px] border border-orange-200 bg-neutral-900 shadow-[0_24px_60px_rgba(249,115,22,0.12)] sm:min-h-[280px] sm:rounded-[26px] lg:min-h-[360px] lg:rounded-[30px]">
              <div
                className="absolute inset-0 scale-[1.04] bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerImage})` }}
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
          </section>
        )}

        <section className="mb-7">
          <div className="mb-4">
            <h3 className="text-xl font-black text-neutral-900">Categorias</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-500 sm:text-[15px]">
              Escolha uma categoria para visualizar os produtos relacionados.
            </p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCategoryDragEnd}
          >
            <SortableContext
              items={orderedCategories}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-4">
                {orderedCategories.map((category) => {
                  const items = orderedProductsByCategory[category] || [];
                  const isActive = selectedCategory === category;

                  const categoryImage =
                    categoryMap[category]?.image?.url ||
                    items[0]?.image?.url ||
                    "/images/sem-imagem.png";

                  return (
                    <SortableCategoryCard
                      key={category}
                      category={category}
                      image={categoryImage}
                      isActive={isActive}
                      onClick={() => setSelectedCategory(category)}
                      sortable={isAdmin}
                      onEdit={
                        isAdmin ? () => handleCategoryEdit(category) : undefined
                      }
                      onDelete={
                        isAdmin
                          ? () => handleCategoryDelete(category)
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </section>

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
                    Explore os melhores itens do mercado com alta qualidade e
                    preços imperdíveis.
                  </p>
                </div>

                <span className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-orange-100 bg-white px-4 text-sm font-bold text-orange-600">
                  {filteredProducts.length} produto
                  {filteredProducts.length !== 1 ? "s" : ""}
                </span>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleProductDragEnd}
              >
                <SortableContext
                  items={currentProducts.map((product) => product._id)}
                  strategy={rectSortingStrategy}
                >
                  <ProductList
                    products={filteredProducts}
                    isAdmin={isAdmin}
                    onSelect={setSelectedProduct}
                    sortable={isAdmin}
                  />
                </SortableContext>
              </DndContext>
            </>
          )}
        </section>
      </div>

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