import type { Metadata } from "next";
import "./globals.css";

import StyledComponentsRegistry from "@/lib/registry";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../services/queryClient";
import { AuthProvider } from "@/context/authContext";

export const metadata: Metadata = {
  title: "Simões Atacado - Varejo e Atacado!",
  description: "Varejo e Atacado você encontra aqui!",
  icons: {
    icon: "https://res.cloudinary.com/dz46wt0iy/image/upload/v1775007158/ChatGPT_Image_31_de_mar._de_2026_22_31_37_rekjvh.png",
    shortcut: "https://res.cloudinary.com/dz46wt0iy/image/upload/v1775007158/ChatGPT_Image_31_de_mar._de_2026_22_31_37_rekjvh.png",
    apple: "https://res.cloudinary.com/dz46wt0iy/image/upload/v1775007158/ChatGPT_Image_31_de_mar._de_2026_22_31_37_rekjvh.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
