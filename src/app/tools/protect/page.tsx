"use client";
import { useState } from "react";
import { Lock, Download, X, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DropZone from "@/components/ui/DropZone";
import { protectPdf, formatBytes, downloadFile } from "@/lib/pdf";

type Status = "idle" | "loading" | "done" | "error";

export default function ProtectPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleProtect() {
    if (!file || !password) return;
    setStatus("loading");
    setError("");
    try {
      const bytes = await protectPdf(file, password);
      downloadFile(bytes, file.name.replace(".pdf", "_protegido.pdf"));
      setStatus("done");
    } catch {
      setError("Não foi possível proteger o PDF. Tente novamente.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setPassword("");
    setStatus("idle");
    setError("");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Proteger PDF</h1>
          </div>
          <p className="text-slate-500">Adicione uma senha para restringir o acesso ao documento.</p>
        </div>

        {!file ? (
          <DropZone onFile={setFile} />
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-800 text-sm">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha de acesso</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite uma senha forte"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Use letras, números e símbolos para uma senha mais segura.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {status === "done" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
                <CheckCircle2 size={16} />
                PDF protegido com sucesso! O download começou automaticamente.
              </div>
            )}

            <button
              onClick={handleProtect}
              disabled={!password || status === "loading"}
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-40"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}
              {status === "loading" ? "Protegendo…" : "Proteger e baixar"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
