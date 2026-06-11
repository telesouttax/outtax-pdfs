"use client";
import { useState } from "react";
import { Scissors, Download, X, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DropZone from "@/components/ui/DropZone";
import { splitPdf, getPdfPageCount, formatBytes, downloadFile } from "@/lib/pdf";

type Range = { from: string; to: string };
type Status = "idle" | "loading" | "done" | "error";
type Mode = "ranges" | "all";

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("all");
  const [ranges, setRanges] = useState<Range[]>([{ from: "1", to: "1" }]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleFile(f: File) {
    setFile(f);
    setStatus("loading");
    try {
      const count = await getPdfPageCount(f);
      setPageCount(count);
      setRanges([{ from: "1", to: String(count) }]);
      setStatus("idle");
    } catch {
      setError("Não foi possível ler o PDF. Verifique se o arquivo não está protegido.");
      setStatus("error");
    }
  }

  function updateRange(i: number, key: "from" | "to", val: string) {
    setRanges((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  }

  function addRange() {
    setRanges((prev) => [...prev, { from: "1", to: String(pageCount) }]);
  }

  function removeRange(i: number) {
    setRanges((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSplit() {
    if (!file) return;
    setStatus("loading");
    setError("");
    try {
      const JSZip = (await import("jszip")).default;

      if (mode === "all") {
        // Uma página por arquivo, tudo num ZIP
        const allRanges = Array.from({ length: pageCount }, (_, i) => ({
          from: i + 1,
          to: i + 1,
        }));
        const results = await splitPdf(file, allRanges);
        const zip = new JSZip();
        results.forEach((bytes, i) => {
          zip.file(`pagina_${String(i + 1).padStart(3, "0")}.pdf`, bytes);
        });
        const zipBytes = await zip.generateAsync({ type: "uint8array" });
        const blob = new Blob([zipBytes as unknown as ArrayBuffer], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(".pdf", "")}_todas_paginas.zip`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // Intervalos personalizados
        const parsed = ranges.map((r) => ({
          from: Math.max(1, parseInt(r.from) || 1),
          to: Math.min(pageCount, parseInt(r.to) || pageCount),
        }));
        const results = await splitPdf(file, parsed);

        if (results.length === 1) {
          downloadFile(results[0], `${file.name.replace(".pdf", "")}_parte1.pdf`);
        } else {
          const zip = new JSZip();
          results.forEach((bytes, i) => {
            zip.file(`parte_${String(i + 1).padStart(3, "0")}.pdf`, bytes);
          });
          const zipBytes = await zip.generateAsync({ type: "uint8array" });
          const blob = new Blob([zipBytes as unknown as ArrayBuffer], { type: "application/zip" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${file.name.replace(".pdf", "")}_partes.zip`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }

      setStatus("done");
    } catch {
      setError("Ocorreu um erro ao separar o PDF. Tente novamente.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setPageCount(0);
    setRanges([{ from: "1", to: "1" }]);
    setStatus("idle");
    setError("");
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scissors size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Separar PDF</h1>
          </div>
          <p className="text-slate-500">Separe todas as páginas individualmente ou defina intervalos personalizados.</p>
        </div>

        {!file ? (
          <DropZone onFile={handleFile} />
        ) : (
          <div className="space-y-6">
            {/* File info */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl">
              <div>
                <p className="font-medium text-slate-800 text-sm">{file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {formatBytes(file.size)} · {pageCount} {pageCount === 1 ? "página" : "páginas"}
                </p>
              </div>
              <button onClick={reset} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-400" />
              </button>
            </div>

            {/* Mode selector */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Como deseja separar?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("all")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === "all"
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className={`text-sm font-medium ${mode === "all" ? "text-blue-700" : "text-slate-700"}`}>
                    Todas as páginas
                  </p>
                  <p className={`text-xs mt-1 ${mode === "all" ? "text-blue-500" : "text-slate-400"}`}>
                    Uma página por arquivo · baixa em ZIP
                  </p>
                </button>
                <button
                  onClick={() => setMode("ranges")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    mode === "ranges"
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className={`text-sm font-medium ${mode === "ranges" ? "text-blue-700" : "text-slate-700"}`}>
                    Intervalos personalizados
                  </p>
                  <p className={`text-xs mt-1 ${mode === "ranges" ? "text-blue-500" : "text-slate-400"}`}>
                    Defina quais páginas extrair
                  </p>
                </button>
              </div>
            </div>

            {/* Ranges (only shown in ranges mode) */}
            {mode === "ranges" && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Intervalos de páginas</p>
                <div className="space-y-3">
                  {ranges.map((range, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-16">Parte {i + 1}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1">
                          <label className="text-xs text-slate-400 block mb-1">De</label>
                          <input
                            type="number"
                            min={1}
                            max={pageCount}
                            value={range.from}
                            onChange={(e) => updateRange(i, "from", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-slate-400 block mb-1">Até</label>
                          <input
                            type="number"
                            min={1}
                            max={pageCount}
                            value={range.to}
                            onChange={(e) => updateRange(i, "to", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      {ranges.length > 1 && (
                        <button
                          onClick={() => removeRange(i)}
                          className="mt-5 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={14} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addRange}
                  className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus size={15} /> Adicionar intervalo
                </button>
              </div>
            )}

            {/* All pages preview */}
            {mode === "all" && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                Serão gerados <strong>{pageCount} arquivos PDF</strong>, um por página, compactados num único ZIP.
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
                PDF separado com sucesso! O download começou automaticamente.
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}
              {status === "loading"
                ? "Processando…"
                : mode === "all"
                ? `Separar ${pageCount} páginas e baixar ZIP`
                : "Separar e baixar"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
