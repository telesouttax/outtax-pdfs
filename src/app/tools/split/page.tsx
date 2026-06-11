"use client";
import { useState } from "react";
import { Scissors, Download, X, AlertCircle, CheckCircle2, Plus, Wand2, Pencil } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DropZone from "@/components/ui/DropZone";
import { splitPdf, getPdfPageCount, formatBytes, downloadFile } from "@/lib/pdf";

type Range = { from: string; to: string; name: string };
type Status = "idle" | "loading" | "reading" | "done" | "error";
type Mode = "ranges" | "all";
type NamingMode = "auto" | "manual";

async function getPdfJs() {
  const pdfjsLib = await import("pdfjs-dist");
  // Usa unpkg CDN com a versão exata instalada
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  return pdfjsLib;
}

async function extractNativeText(file: File, pageNum: number): Promise<string> {
  const pdfjsLib = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const page = await pdf.getPage(pageNum);
  const content = await page.getTextContent();
  return content.items.map((item: any) => item.str).join(" ").trim();
}

async function renderPageToCanvas(file: File, pageNum: number): Promise<HTMLCanvasElement> {
  const pdfjsLib = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
  return canvas;
}

async function extractTextWithOCR(file: File, pageNum: number): Promise<string> {
  const canvas = await renderPageToCanvas(file, pageNum);
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("por");
  const { data } = await worker.recognize(canvas);
  await worker.terminate();
  return data.text;
}

async function getPageText(file: File, pageNum: number): Promise<string> {
  const native = await extractNativeText(file, pageNum);
  if (native.length > 10) return native;
  return extractTextWithOCR(file, pageNum);
}

function suggestNameFromText(text: string, pageNum: number): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  const upperWordsMatch = cleaned.match(/\b([A-ZÁÉÍÓÚÀÂÊÔÃÕÇ]{2,}(?:\s+[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ]{2,}){1,5})\b/);
  if (upperWordsMatch) {
    return upperWordsMatch[1]
      .split(" ")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" ");
  }
  const words = cleaned.split(" ").filter((w) => w.length > 3).slice(0, 4);
  if (words.length > 0) return words.join(" ").slice(0, 40);
  return `Pagina_${pageNum}`;
}

export default function SplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<Mode>("all");
  const [namingMode, setNamingMode] = useState<NamingMode>("auto");
  const [ranges, setRanges] = useState<Range[]>([{ from: "1", to: "1", name: "Parte 1" }]);
  const [pageNames, setPageNames] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingLabel, setReadingLabel] = useState("");
  const [error, setError] = useState("");

  async function handleFile(f: File) {
    setFile(f);
    setStatus("loading");
    try {
      const count = await getPdfPageCount(f);
      setPageCount(count);
      setRanges([{ from: "1", to: String(count), name: "Parte 1" }]);
      setPageNames(Array.from({ length: count }, (_, i) => `Pagina_${i + 1}`));
      setStatus("idle");
    } catch {
      setError("Não foi possível ler o PDF. Verifique se o arquivo não está protegido.");
      setStatus("error");
    }
  }

  async function autoName(pages: number[], onName: (i: number, name: string) => void) {
    for (let idx = 0; idx < pages.length; idx++) {
      const pageNum = pages[idx];
      setReadingLabel(`Analisando página ${pageNum}${pages.length > 1 ? ` de ${pages.length}` : ""}…`);
      const text = await getPageText(file!, pageNum);
      onName(idx, suggestNameFromText(text, pageNum));
      setReadingProgress(Math.round(((idx + 1) / pages.length) * 100));
    }
  }

  async function autoNamePages() {
    if (!file) return;
    setStatus("reading");
    setReadingProgress(0);
    setError("");
    try {
      const names = [...pageNames];
      await autoName(
        Array.from({ length: pageCount }, (_, i) => i + 1),
        (idx, name) => { names[idx] = name; setPageNames([...names]); }
      );
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setError("Não foi possível analisar o PDF. Tente a nomeação manual.");
      setStatus("error");
    }
  }

  async function autoNameRanges() {
    if (!file) return;
    setStatus("reading");
    setReadingProgress(0);
    setError("");
    try {
      const named = [...ranges];
      await autoName(
        ranges.map((r) => Math.max(1, parseInt(r.from) || 1)),
        (idx, name) => { named[idx] = { ...named[idx], name }; setRanges([...named]); }
      );
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setError("Não foi possível analisar o PDF. Tente a nomeação manual.");
      setStatus("error");
    }
  }

  function updateRange(i: number, key: keyof Range, val: string) {
    setRanges((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  }

  function addRange() {
    setRanges((prev) => [...prev, { from: "1", to: String(pageCount), name: `Parte ${prev.length + 1}` }]);
  }

  function removeRange(i: number) {
    setRanges((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updatePageName(i: number, val: string) {
    setPageNames((prev) => prev.map((n, idx) => (idx === i ? val : n)));
  }

  async function handleSplit() {
    if (!file) return;
    setStatus("loading");
    setError("");
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const sanitize = (s: string, fallback: string) =>
        s.replace(/[^a-zA-Z0-9À-ú\s_-]/g, "").trim() || fallback;

      if (mode === "all") {
        const allRanges = Array.from({ length: pageCount }, (_, i) => ({ from: i + 1, to: i + 1 }));
        const results = await splitPdf(file, allRanges);
        results.forEach((bytes, i) => {
          zip.file(`${sanitize(pageNames[i] || "", `pagina_${i + 1}`)}.pdf`, bytes);
        });
        const zipBytes = await zip.generateAsync({ type: "uint8array" });
        const blob = new Blob([zipBytes as unknown as ArrayBuffer], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(".pdf", "")}_paginas.zip`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const parsed = ranges.map((r) => ({
          from: Math.max(1, parseInt(r.from) || 1),
          to: Math.min(pageCount, parseInt(r.to) || pageCount),
        }));
        const results = await splitPdf(file, parsed);
        if (results.length === 1) {
          downloadFile(results[0], `${sanitize(ranges[0].name, "parte_1")}.pdf`);
        } else {
          results.forEach((bytes, i) => {
            zip.file(`${sanitize(ranges[i]?.name || "", `parte_${i + 1}`)}.pdf`, bytes);
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
    setRanges([{ from: "1", to: "1", name: "Parte 1" }]);
    setPageNames([]);
    setStatus("idle");
    setError("");
    setReadingProgress(0);
    setReadingLabel("");
  }

  const isProcessing = status === "loading" || status === "reading";

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
          <p className="text-slate-500">Separe páginas individualmente ou por intervalos, com nomes automáticos ou manuais.</p>
        </div>

        {!file ? (
          <DropZone onFile={handleFile} />
        ) : (
          <div className="space-y-6">

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

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Como deseja separar?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setMode("all")} className={`p-4 rounded-xl border text-left transition-all ${mode === "all" ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <p className={`text-sm font-medium ${mode === "all" ? "text-blue-700" : "text-slate-700"}`}>Todas as páginas</p>
                  <p className={`text-xs mt-1 ${mode === "all" ? "text-blue-500" : "text-slate-400"}`}>Uma página por arquivo · ZIP</p>
                </button>
                <button onClick={() => setMode("ranges")} className={`p-4 rounded-xl border text-left transition-all ${mode === "ranges" ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <p className={`text-sm font-medium ${mode === "ranges" ? "text-blue-700" : "text-slate-700"}`}>Intervalos personalizados</p>
                  <p className={`text-xs mt-1 ${mode === "ranges" ? "text-blue-500" : "text-slate-400"}`}>Defina quais páginas extrair</p>
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Como nomear os arquivos?</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setNamingMode("auto")} className={`p-4 rounded-xl border text-left transition-all ${namingMode === "auto" ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Wand2 size={14} className={namingMode === "auto" ? "text-blue-600" : "text-slate-400"} />
                    <p className={`text-sm font-medium ${namingMode === "auto" ? "text-blue-700" : "text-slate-700"}`}>Automático</p>
                  </div>
                  <p className={`text-xs ${namingMode === "auto" ? "text-blue-500" : "text-slate-400"}`}>Lê texto · OCR para escaneados</p>
                </button>
                <button onClick={() => setNamingMode("manual")} className={`p-4 rounded-xl border text-left transition-all ${namingMode === "manual" ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Pencil size={14} className={namingMode === "manual" ? "text-blue-600" : "text-slate-400"} />
                    <p className={`text-sm font-medium ${namingMode === "manual" ? "text-blue-700" : "text-slate-700"}`}>Manual</p>
                  </div>
                  <p className={`text-xs ${namingMode === "manual" ? "text-blue-500" : "text-slate-400"}`}>Você digita cada nome</p>
                </button>
              </div>
            </div>

            {namingMode === "auto" && (
              <div>
                <button
                  onClick={mode === "all" ? autoNamePages : autoNameRanges}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {status === "reading" ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Wand2 size={15} />
                  )}
                  {status === "reading" ? readingLabel : "Ler PDF e sugerir nomes"}
                </button>
                {status === "reading" && (
                  <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${readingProgress}%` }} />
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  Gratuito · roda no seu navegador. PDFs escaneados usam OCR e podem demorar um pouco mais.
                </p>
              </div>
            )}

            {mode === "all" && (namingMode === "manual" || pageNames.some((n) => !n.startsWith("Pagina_"))) && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">
                  Nomes das páginas
                  {namingMode === "auto" && <span className="ml-2 text-xs text-slate-400 font-normal">· edite se precisar ajustar</span>}
                </p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-16 shrink-0">Pág. {i + 1}</span>
                      <input
                        type="text"
                        value={pageNames[i] || ""}
                        onChange={(e) => updatePageName(i, e.target.value)}
                        placeholder={`pagina_${i + 1}`}
                        className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === "ranges" && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-3">Intervalos de páginas</p>
                <div className="space-y-4">
                  {ranges.map((range, i) => (
                    <div key={i} className="p-4 border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Parte {i + 1}</span>
                        {ranges.length > 1 && (
                          <button onClick={() => removeRange(i)} className="p-1 hover:bg-red-50 rounded-lg">
                            <X size={13} className="text-red-400" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">De</label>
                          <input type="number" min={1} max={pageCount} value={range.from} onChange={(e) => updateRange(i, "from", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 block mb-1">Até</label>
                          <input type="number" min={1} max={pageCount} value={range.to} onChange={(e) => updateRange(i, "to", e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 block mb-1">Nome do arquivo</label>
                        <input type="text" value={range.name} onChange={(e) => updateRange(i, "name", e.target.value)} placeholder={`parte_${i + 1}`} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addRange} className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <Plus size={15} /> Adicionar intervalo
                </button>
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
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}
              {status === "loading" ? "Processando…" : mode === "all" ? `Separar ${pageCount} páginas e baixar ZIP` : "Separar e baixar"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
