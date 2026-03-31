"use client";

import { useState } from "react";
import { destroyCookie } from "nookies";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import {
  FiMenu,
  FiX,
  FiLogOut,
  FiPlus,
  FiImage,
  FiHome,
} from "react-icons/fi";

import { getProduct } from "@/hooks/useClient";
import { PropsProduct } from "@/types/product";
import CatalogPage from "@/components/CatalogPage";

export default function Sidebar() {
  const { data: dataProduct, refetch } = useQuery<PropsProduct[]>({
    queryKey: ["Product"],
    queryFn: getProduct,
  });

  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    destroyCookie(null, "nextauth.token", { path: "/" });
    destroyCookie(null, "nextauth.userId", { path: "/" });

    router.push("/");
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  return (
    <main className="min-h-screen bg-[#fffaf5]">

      {/* BOTÃO MENU */}
      <button
        onClick={() => setIsOpen(true)}
        className="
        fixed left-4 top-4 z-40
        inline-flex h-12 w-12 items-center justify-center
        rounded-2xl border border-orange-200 bg-white
        text-orange-500
        shadow-[0_12px_28px_rgba(249,115,22,0.14)]
        transition hover:bg-orange-50
        "
      >
        <FiMenu size={24} />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        fixed left-0 top-0 z-50 flex h-screen w-[290px]
        flex-col border-r border-orange-100 bg-white
        shadow-xl transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* HEADER SIDEBAR */}
        <div className="border-b border-orange-100 px-5 pb-5 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-600">
                Painel admin
              </span>

              <h2 className="mt-3 text-2xl font-black text-neutral-900">
                Simoes Bone
              </h2>

              <p className="text-sm text-neutral-500">
                Controle da loja
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="h-10 w-10 rounded-xl border border-orange-100 flex items-center justify-center hover:bg-orange-50"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">

          <button
            onClick={() => handleNavigate(`${pathname}/formProduct`)}
            className="
            flex items-center gap-3
            rounded-2xl bg-orange-500
            px-4 py-4 text-white
            shadow-md transition hover:bg-orange-600
            "
          >
            <FiPlus size={18} />

            <span className="flex flex-col text-left">
              <span className="text-sm font-bold">
                Cadastrar Produto
              </span>
              <span className="text-xs text-orange-100">
                Adicione novos itens
              </span>
            </span>
          </button>

          <button
            onClick={() => handleNavigate(`${pathname}/formBanner`)}
            className="
            flex items-center gap-3
            rounded-2xl border border-orange-100
            bg-white px-4 py-4
            shadow-sm transition hover:bg-orange-50
            "
          >
            <FiImage size={18} className="text-orange-500" />

            <span className="flex flex-col text-left">
              <span className="text-sm font-bold text-neutral-900">
                Cadastrar Banner
              </span>
              <span className="text-xs text-neutral-500">
                Atualize os destaques
              </span>
            </span>
          </button>

        </div>

        {/* RODAPÉ SIDEBAR */}
        <div className="border-t border-orange-100 p-5 flex gap-3">

          <button
            onClick={() => router.push("/")}
            className="
            flex-1 flex items-center justify-center gap-2
            rounded-2xl border border-orange-200
            bg-orange-50 px-4 py-3
            text-sm font-bold text-orange-600
            transition hover:bg-orange-100
            "
          >
            <FiHome size={18} />
            Home
          </button>

          <button
            onClick={logout}
            className="
            flex-1 flex items-center justify-center gap-2
            rounded-2xl border border-red-100
            bg-red-50 px-4 py-3
            text-sm font-bold text-red-600
            transition hover:bg-red-100
            "
          >
            <FiLogOut size={18} />
            Sair
          </button>

        </div>
      </aside>

      {/* CONTEÚDO */}
      <section className="px-3 pb-8 pt-20 sm:px-4 sm:pt-24 lg:px-6">

        <div className="mx-auto max-w-[1280px]">

          <div className="mb-5 rounded-[28px] border border-orange-100 bg-white px-6 py-6 shadow-sm">

            <h1 className="text-3xl font-black text-neutral-900">
              Painel de Produtos
            </h1>

            <p className="mt-2 text-neutral-500">
              Visualize e gerencie os produtos cadastrados.
            </p>

          </div>

          <div className="rounded-[28px] border border-orange-100 bg-white p-2 shadow-sm sm:p-3">

            {dataProduct && dataProduct.length > 0 ? (
              <CatalogPage adm="admin" products={dataProduct} refetch={refetch} />
            ) : (
              <div className="
              flex min-h-[55vh] items-center justify-center
              rounded-[24px] border border-dashed border-orange-200
              bg-[#fffaf5] text-xl font-bold text-orange-600
              ">
                Nenhum produto registrado...
              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}