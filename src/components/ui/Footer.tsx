import Link from "next/link";
import { FileText, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <span className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <FileText size={14} className="text-white" />
          </span>
          Outtax PDFs
        </div>

        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Outtax PDFs · Hospedado na Vercel
        </p>

        <div className="flex items-center gap-5 text-sm text-slate-500">
          <Link href="/privacidade" className="hover:text-slate-900 transition-colors">Privacidade</Link>
          <Link href="/termos" className="hover:text-slate-900 transition-colors">Termos</Link>
          <a
            href="https://github.com/seu-usuario/outtax-pdfs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            <Github size={15} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
