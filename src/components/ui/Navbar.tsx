"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FileText, LogOut, User, Scissors, FileDown, Files, RefreshCw, Lock, PenLine, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const tools = [
  { slug: "split", name: "Separar PDF", icon: Scissors, color: "text-blue-600" },
  { slug: "compress", name: "Comprimir PDF", icon: FileDown, color: "text-teal-600" },
  { slug: "merge", name: "Juntar PDFs", icon: Files, color: "text-orange-600" },
  { slug: "convert", name: "Converter", icon: RefreshCw, color: "text-amber-600" },
  { slug: "protect", name: "Proteger PDF", icon: Lock, color: "text-purple-600" },
  { slug: "sign", name: "Assinar PDF", icon: PenLine, color: "text-green-600" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/tools/split" className="flex items-center gap-2.5 font-semibold text-slate-900">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </span>
          Outtax PDFs
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm text-slate-500">
          {/* Dropdown ferramentas */}
          <div className="relative">
            <button
              onClick={() => setShowTools(!showTools)}
              onBlur={() => setTimeout(() => setShowTools(false), 150)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Ferramentas <ChevronDown size={14} className={`transition-transform ${showTools ? "rotate-180" : ""}`} />
            </button>
            {showTools && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
                      pathname === `/tools/${tool.slug}` ? "text-blue-600 font-medium" : "text-slate-700"
                    }`}
                  >
                    <tool.icon size={15} className={tool.color} />
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://github.com/telesouttax/outtax-pdfs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {email ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={14} className="text-blue-600" />
                </div>
                <span className="max-w-[180px] truncate">{email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <LogOut size={14} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                Entrar
              </Link>
              <Link href="/cadastro" className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
