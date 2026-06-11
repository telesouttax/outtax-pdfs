import Link from "next/link";
import { Scissors, FileDown, Files, RefreshCw, Lock, PenLine, Upload, ChevronRight, Github } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { tools } from "@/lib/tools";

const iconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors size={22} />,
  FileZip: <FileDown size={22} />,
  Files: <Files size={22} />,
  RefreshCw: <RefreshCw size={22} />,
  Lock: <Lock size={22} />,
  PenLine: <PenLine size={22} />,
};

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          100% online · sem instalação · código aberto
        </div>

        <h1 className="text-5xl font-semibold text-slate-900 leading-tight mb-5">
          Ferramentas profissionais<br />
          <span className="text-blue-600">para seus PDFs</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Separe, comprima, junte e converta documentos diretamente no navegador.
          Nenhum software para instalar, nenhum dado que sai do seu dispositivo.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/tools/split"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <Upload size={17} />
            Enviar PDF agora
          </Link>
          <a
            href="https://github.com/seu-usuario/outtax-pdfs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <Github size={17} />
            Ver no GitHub
          </a>
        </div>
      </section>

      {/* Upload CTA Strip */}
      <section className="max-w-2xl mx-auto px-6 mb-20">
        <Link href="/tools/split">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all duration-200 cursor-pointer group">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Upload size={28} className="text-blue-600" />
            </div>
            <p className="font-medium text-slate-800 text-lg">Arraste seu PDF aqui</p>
            <p className="text-slate-400 text-sm mt-1">ou clique para selecionar · PDF até 100 MB</p>
          </div>
        </Link>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-5xl mx-auto px-6 mb-20">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Ferramentas</p>
          <h2 className="text-3xl font-semibold text-slate-900">O que você pode fazer</h2>
          <p className="text-slate-500 mt-2">Seis ferramentas, todas gratuitas, todas no navegador.</p>
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
                {iconMap[tool.icon]}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1.5">{tool.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Usar ferramenta <ChevronRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-slate-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">Como funciona</p>
            <h2 className="text-3xl font-semibold">Três passos, pronto.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Faça o upload", desc: "Selecione ou arraste seu arquivo PDF diretamente no navegador." },
              { n: "2", title: "Escolha a operação", desc: "Separe por páginas, comprima, junte com outros arquivos e muito mais." },
              { n: "3", title: "Baixe o resultado", desc: "O arquivo processado fica disponível para download imediato." },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-12 h-12 rounded-full border border-blue-500/40 bg-blue-600/20 text-blue-400 text-lg font-semibold flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "100%", label: "Gratuito" },
            { value: "6", label: "Ferramentas" },
            { value: "0", label: "Instalações" },
            { value: "Open", label: "Source" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
              <p className="text-3xl font-semibold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-3xl font-semibold text-slate-900 mb-3">Pronto para começar?</h2>
        <p className="text-slate-500 mb-8">Sem cadastro, sem limite de uso, sem custo.</p>
        <Link
          href="/tools/split"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
        >
          <Upload size={20} />
          Enviar meu primeiro PDF
        </Link>
      </section>

      <Footer />
    </>
  );
}
