"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { FiArrowLeft, FiLock, FiMail } from "react-icons/fi";

export default function LoginForm() {
  const { signIn, alert, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmitAdm = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn({ email, password });
    } catch (error) {
      console.log("Error efetuar login:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] px-4 py-6 text-neutral-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-8">
        <section className="relative hidden overflow-hidden rounded-[32px] border border-orange-100 bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 p-8 text-white shadow-[0_30px_70px_rgba(249,115,22,0.18)] lg:flex lg:min-h-[680px] lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_30%)]" />

          <div className="relative z-10">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/95 backdrop-blur-sm">
              Acesso administrativo
            </span>

            <h1 className="mt-6 max-w-md text-4xl font-black leading-tight">
              Entre para gerenciar seu catálogo com mais controle e praticidade.
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-7 text-white/90">
              Acesse sua área administrativa para organizar produtos, atualizar
              banners, ajustar categorias e manter sua vitrine com aparência
              mais profissional.
            </p>
          </div>

          <div className="relative z-10 grid gap-4">
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">
                Painel rápido, visual limpo e experiência otimizada para celular
                e desktop.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-white/90">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              Segurança no acesso
            </div>

            <div className="flex items-center gap-3 text-sm text-white/90">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              Gestão visual do catálogo
            </div>

            <div className="flex items-center gap-3 text-sm text-white/90">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
              Interface moderna e responsiva
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100vh-3rem)] flex-col justify-center lg:min-h-[680px]">
          <div className="mb-5">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center gap-2 rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-orange-600 shadow-sm transition-all duration-300 hover:bg-orange-50 hover:shadow-md"
            >
              <FiArrowLeft size={18} />
              Voltar
            </button>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-[0_24px_60px_rgba(249,115,22,0.08)]">
            <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white px-5 py-6 sm:px-7 sm:py-7">
              <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-xs">
                Login
              </span>

              <h2 className="mt-3 text-2xl font-black leading-tight text-neutral-900 sm:text-3xl">
                Acesse sua conta
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600 sm:text-[15px] sm:leading-7">
                Entre com seu e-mail e senha para acessar o painel
                administrativo.
              </p>
            </div>

            <form
              onSubmit={handleSubmitAdm}
              className="space-y-5 px-5 py-6 sm:px-7 sm:py-8"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-neutral-700"
                >
                  E-mail
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all duration-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                  <FiMail size={18} className="text-orange-500" />

                  <input
                    id="email"
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-[15px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-neutral-700"
                >
                  Senha
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition-all duration-300 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
                  <FiLock size={18} className="text-orange-500" />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Digite sua senha"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 sm:text-[15px]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 text-base font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_18px_34px_rgba(249,115,22,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              {alert?.message && (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                    alert?.type === "error"
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-orange-200 bg-orange-50 text-orange-700"
                  }`}
                >
                  {alert.message}
                </div>
              )}
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
