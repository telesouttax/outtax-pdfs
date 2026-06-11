"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

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
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-900">
          <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </span>
          Outtax PDFs
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-500">
          <Link href="/#tools" className="hover:text-slate-900 transition-colors">Ferramentas</Link>
          <Link href="/#how" className="hover:text-slate-900 transition-colors">Como funciona</Link>
          <a
            href="https://github.com/seu-usuario/outtax-pdfs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors"
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
              <Link
                href="/login"
                className="text-sm px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
