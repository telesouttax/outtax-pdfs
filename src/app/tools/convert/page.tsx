"use client";
import { useState } from "react";
import { RefreshCw, Download, X, AlertCircle, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DropZone from "@/components/ui/DropZone";
import { formatBytes } from "@/lib/pdf";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type Status = "idle" | "loading" | "done" | "error";
type Format = "jpg" | "png";

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("jpg");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [pagesDone, setPagesDone] = useState(0);
  const [total, setTotal] = useState(0);

  async function handleConvert() {
    if (!file) return;
    setStatus("loading");
    setError("");
    setPagesDone(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      setTotal(pageCount);

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.92);
        const base64 = dataUrl.split(",")[1];
        zip.file(`pagina_${String(i).padStart(3, "0")}.${format}`, base64, { base64: true });
        setPagesDone(i);
      }

      const zipBytes = await zip.generateAsync({ type: "uint8array" });
      const blob = new Blob([zipBytes as unknown as ArrayBuffer], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${file.name.replace(".pdf", "")}_imagens.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch {
      setError("Não foi possível converter o PDF. Tente novamente.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setError("");
    setPagesDone(0);
    setTotal(0);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RefreshCw size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Converter PDF</h1>
          </div>
          <p className="text-slate-500">Converta as páginas do PDF em imagens JPG ou PNG.</p>
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
              <label className="block text-sm font-medium text-slate-700 mb-3">Formato de saída</label>
              <div className="flex gap-3">
                {(["jpg", "png"] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                      format === f
                        ? "border-amber-400 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    .{f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {status === "loading" && total > 0 && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Convertendo páginas…</span>
                  <span>{pagesDone} / {total}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${(pagesDone / total) * 100}%` }}
                  />
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
                PDF convertido com sucesso! O download do ZIP começou automaticamente.
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}
              {status === "loading" ? "Convertendo…" : `Converter para ${format.toUpperCase()}`}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
