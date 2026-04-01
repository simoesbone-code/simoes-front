"use client";

import Link from "next/link";
import { FiInstagram, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

type FooterProps = {
  brandName?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  email?: string;
};

export function Footer({
  brandName = "Armarinho Atacado",
  instagramUrl = "https://instagram.com/",
  whatsappNumber = "5583998033753",
  whatsappMessage = "Olá! Vim pelo site e gostaria de saber mais.",
  email = "contato@armarinhoatacado.com",
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  return (
    <footer className="mt-12 w-full bg-[#1f1f1f] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-wide sm:text-xl">
              {brandName}
            </h2>
            <p className="mt-1 text-sm text-white/65">
              Qualidade, preço baixo e variedade para o seu negócio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={instagramUrl}
              target="_blank"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <FiInstagram size={18} />
            </Link>

            <Link
              href={whatsappLink}
              target="_blank"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <FaWhatsapp size={18} />
            </Link>

            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <FiMail size={18} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {brandName}. Todos os direitos reservados.</p>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="transition hover:text-orange-400"
            >
              Início
            </Link>

            <Link
              href="/catalog"
              className="transition hover:text-orange-400"
            >
              Catálogo
            </Link>

            <a
              href={`mailto:${email}`}
              className="transition hover:text-orange-400"
            >
              Contato
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}