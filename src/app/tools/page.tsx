import Link from "next/link";
import { Scissors, FileDown, Files, RefreshCw, Lock, PenLine, ChevronRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const tools = [
  {
    slug: "split",
    name: "Separar PDF",
    description: "Divida um PDF em múltiplos arquivos por páginas ou intervalos. Nomeação automática pelo nome do recebedor.",
    icon: Scissors,
    color: "text-blue-600",
    bg: "bg-blue-50",
    featured: true,
  },
  {
    slug: "compress",
    name: "Comprimir PDF",
    description: "Reduza o tamanho do arquivo sem perder qualidade visual do documento.",
    icon: FileDown,
    color: "text-teal-600",
    bg: "bg-teal-50",
    featured: true,
  },
  {
    slug: "merge",
    name: "Juntar PDFs",
    description: "Combine vários arquivos em um único documento organizado.",
    icon: Files,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    slug: "convert",
    name: "Converter PDF",
    description: "Converta as páginas do PDF em imagens JPG ou PNG.",
    icon: RefreshCw,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    slug: "protect",
    name: "Proteger PDF",
    description: "Adicione senha e restrições de acesso ao seu documento.",
    icon: Lock,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    slug: "sign",
    name: "Assinar PDF",
    description: "Desenhe sua assinatura e insira na última página do documento.",
    icon: PenLine,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">Ferramentas</h1>
          <p className="text-slate-500">Escolha o que deseja fazer com seu PDF.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={`group relative p-6 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                tool.featured ? "border-blue-200 ring-1 ring-blue-100" : "border-slate-200"
              }`}
            >
              {tool.featured && (
                <span className="absolute top-4 right-4 text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 font-medium">
                  Popular
                </span>
              )}
              <div className={`w-11 h-11 rounded-xl ${tool.bg} ${tool.color} flex items-center justify-center mb-4`}>
                <tool.icon size={22} />
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{tool.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
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
