"use client";
import { useState } from "react";
import { Files, Download, X, GripVertical, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { mergePdfs, formatBytes, downloadFile } from "@/lib/pdf";

type Status = "idle" | "loading" | "done" | "error";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).filter(
      (f) => !files.find((ex) => ex.name === f.name)
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleMerge() {
    if (files.length < 2) return;
    setStatus("loading");
    setError("");
    try {
      const bytes = await mergePdfs(files);
      downloadFile(bytes, "outtax_merged.pdf");
      setStatus("done");
    } catch {
      setError("Não foi possível juntar os PDFs. Verifique se os arquivos não estão protegidos.");
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Files size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Juntar PDFs</h1>
          </div>
          <p className="text-slate-500">Adicione múltiplos PDFs e combine-os em um único arquivo.</p>
        </div>

        <div className="space-y-4">
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={f.name} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
                  <GripVertical size={16} className="text-slate-300" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                    <p className="text-xs text-slate-400">{formatBytes(f.size)}</p>
                  </div>
                  <button onClick={() => removeFile(i)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                    <X size={14} className="text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all">
            <Plus size={18} className="text-slate-400" />
            <span className="text-sm text-slate-500 font-medium">
              {files.length === 0 ? "Adicionar PDFs" : "Adicionar mais PDFs"}
            </span>
            <input type="file" accept=".pdf" multiple onChange={addFiles} className="hidden" />
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {status === "done" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
              <CheckCircle2 size={16} />
              PDFs combinados com sucesso! O download começou automaticamente.
            </div>
          )}

          <button
            onClick={handleMerge}
            disabled={files.length < 2 || status === "loading"}
            className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors disabled:opacity-40"
          >
            {status === "loading" ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Download size={17} />
            )}
            {status === "loading"
              ? "Combinando…"
              : files.length < 2
              ? "Adicione pelo menos 2 PDFs"
              : `Juntar ${files.length} PDFs e baixar`}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
