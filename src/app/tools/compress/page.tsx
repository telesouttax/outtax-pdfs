"use client";
import { useState } from "react";
import { FileDown, Download, X, AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DropZone from "@/components/ui/DropZone";
import { compressPdf, formatBytes, downloadFile } from "@/lib/pdf";

type Status = "idle" | "loading" | "done" | "error";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [savings, setSavings] = useState<{ original: number; compressed: number } | null>(null);

  async function handleCompress() {
    if (!file) return;
    setStatus("loading");
    setError("");
    try {
      const bytes = await compressPdf(file);
      setSavings({ original: file.size, compressed: bytes.length });
      downloadFile(bytes, file.name.replace(".pdf", "_comprimido.pdf"));
      setStatus("done");
    } catch {
      setError("Não foi possível comprimir o PDF. Tente novamente.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setError("");
    setSavings(null);
  }

  const reduction = savings
    ? Math.round((1 - savings.compressed / savings.original) * 100)
    : 0;

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileDown size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Comprimir PDF</h1>
          </div>
          <p className="text-slate-500">Reduza o tamanho do arquivo mantendo a qualidade visual.</p>
        </div>

        {!file ? (
          <DropZone onFile={setFile} />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-800 text-sm">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatBytes(file.size)}</p>
              </div>
              <button onClick={reset} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {savings && (
              <div className="p-5 bg-teal-50 border border-teal-100 rounded-xl">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-teal-600 mb-1">Original</p>
                    <p className="font-semibold text-slate-800">{formatBytes(savings.original)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-600 mb-1">Redução</p>
                    <p className="font-semibold text-teal-700 text-lg">{reduction}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-600 mb-1">Comprimido</p>
                    <p className="font-semibold text-slate-800">{formatBytes(savings.compressed)}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {status === "done" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
                <CheckCircle2 size={16} />
                PDF comprimido com sucesso! O download começou automaticamente.
              </div>
            )}

            <button
              onClick={handleCompress}
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}
              {status === "loading" ? "Comprimindo…" : "Comprimir e baixar"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
