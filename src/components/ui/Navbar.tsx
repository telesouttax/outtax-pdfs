"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User, Scissors, FileDown, Files, RefreshCw, Lock, PenLine, ChevronDown, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const tools = [
  { slug: "split", name: "Separar PDF", icon: Scissors },
  { slug: "compress", name: "Comprimir PDF", icon: FileDown },
  { slug: "merge", name: "Juntar PDFs", icon: Files },
  { slug: "convert", name: "Converter", icon: RefreshCw },
  { slug: "protect", name: "Proteger PDF", icon: Lock },
  { slug: "sign", name: "Assinar PDF", icon: PenLine },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [showMobile, setShowMobile] = useState(false);

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
    <header className="sticky top-0 z-50 bg-[#152c6b] shadow-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/tools/split" className="flex items-center gap-3">
          <Image src="/logo-outtax.png" alt="Outtax" width={110} height={36} className="brightness-0 invert" />
          <span className="text-white/40 text-lg font-light hidden sm:block">|</span>
          <span className="text-white/70 text-sm font-medium hidden sm:block tracking-wide">PDFs</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setShowTools(!showTools)}
              onBlur={() => setTimeout(() => setShowTools(false), 150)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              Ferramentas
              <ChevronDown size={14} className={`transition-transform ${showTools ? "rotate-180" : ""}`} />
            </button>
            {showTools && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 z-50">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      pathname === `/tools/${tool.slug}`
                        ? "text-[#285199] font-semibold bg-blue-50"
                        : "text-[#152c6b] hover:bg-slate-50"
                    }`}
                  >
                    <tool.icon size={15} className="text-[#285199]" />
                    {tool.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* User area */}
        <div className="hidden md:flex items-center gap-3">
          {email ? (
            <>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-[#FF8E2A] flex items-center justify-center">
                  <User size={13} className="text-white" />
                </div>
                <span className="text-white/90 text-sm max-w-[160px] truncate">{email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm px-3 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
              >
                <LogOut size={14} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-4 py-2 border border-white/20 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all">
                Entrar
              </Link>
              <Link href="/cadastro" className="text-sm px-4 py-2 bg-[#FF8E2A] text-white rounded-lg font-medium hover:bg-orange-500 transition-colors">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setShowMobile(!showMobile)}
        >
          {showMobile ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {showMobile && (
        <div className="md:hidden bg-[#1a3578] border-t border-white/10 px-6 py-4 space-y-1">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              onClick={() => setShowMobile(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === `/tools/${tool.slug}`
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <tool.icon size={15} />
              {tool.name}
            </Link>
          ))}
          {email && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors mt-2"
            >
              <LogOut size={15} />
              Sair
            </button>
          )}
        </div>
      )}
    </header>
  );
}
