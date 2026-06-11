import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outtax PDFs — Ferramentas para PDF online",
  description: "Separe, comprima, junte, converta e proteja seus PDFs diretamente no navegador. Sem instalar nada.",
  openGraph: {
    title: "Outtax PDFs",
    description: "Ferramentas profissionais para PDF, 100% online.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
