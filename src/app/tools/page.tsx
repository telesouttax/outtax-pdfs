import Link from "next/link";
import { Scissors, FileDown, Files, RefreshCw, Lock, PenLine, ChevronRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const tools = [
  { slug: "split", name: "Separar PDF", description: "Divida por páginas com nomeação automática pelo recebedor.", icon: Scissors, featured: true },
  { slug: "compress", name: "Comprimir PDF", description: "Reduza o tamanho sem perder qualidade visual.", icon: FileDown, featured: true },
  { slug: "merge", name: "Juntar PDFs", description: "Combine vários arquivos em um único documento.", icon: Files },
  { slug: "convert", name: "Converter PDF", description: "Converta páginas em imagens JPG ou PNG.", icon: RefreshCw },
  { slug: "protect", name: "Proteger PDF", description: "Adicione senha e restrições de acesso.", icon: Lock },
  { slug: "sign", name: "Assinar PDF", description: "Insira assinatura digital no documento.", icon: PenLine },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF8E2A] mb-2">Ferramentas</p>
          <h1 className="text-3xl font-semibold text-[#152c6b] mb-2">O que deseja fazer?</h1>
          <p className="text-slate-500">Todas as ferramentas rodam no seu navegador, sem enviar arquivos para servidores.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-[#285199] hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              {tool.featured && (
                <span className="absolute top-4 right-4 text-xs px-2 py-0.5 bg-[#FF8E2A]/10 text-[#FF8E2A] rounded-full border border-[#FF8E2A]/20 font-medium">
                  Popular
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-[#152c6b] flex items-center justify-center mb-4 group-hover:bg-[#285199] transition-colors">
                <tool.icon size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-[#152c6b] mb-1.5">{tool.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-[#285199] opacity-0 group-hover:opacity-100 transition-opacity">
                Usar ferramenta <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
