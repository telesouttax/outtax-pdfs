"use client";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function Navbar() {
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
          <Link
            href="/tools/split"
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
