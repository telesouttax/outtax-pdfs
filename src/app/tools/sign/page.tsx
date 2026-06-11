"use client";
import { useState, useRef, useEffect } from "react";
import { PenLine, Download, X, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import DropZone from "@/components/ui/DropZone";
import { PDFDocument, rgb } from "pdf-lib";
import { formatBytes, downloadFile } from "@/lib/pdf";

type Status = "idle" | "loading" | "done" | "error";

export default function SignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, [file]);

  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSig(true);
  }

  function stopDraw() {
    setIsDrawing(false);
  }

  function clearSig() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  }

  async function handleSign() {
    if (!file || !hasSig) return;
    setStatus("loading");
    setError("");
    try {
      const canvas = canvasRef.current!;
      const sigDataUrl = canvas.toDataURL("image/png");
      const sigRes = await fetch(sigDataUrl);
      const sigBytes = new Uint8Array(await sigRes.arrayBuffer());

      const arrayBuffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      const sigImage = await doc.embedPng(sigBytes);
      const pages = doc.getPages();
      const lastPage = pages[pages.length - 1];
      const { width, height } = lastPage.getSize();

      lastPage.drawImage(sigImage, {
        x: width - 200,
        y: 40,
        width: 160,
        height: 60,
        opacity: 0.9,
      });

      const bytes = await doc.save();
      downloadFile(bytes, file.name.replace(".pdf", "_assinado.pdf"));
      setStatus("done");
    } catch {
      setError("Não foi possível assinar o PDF. Tente novamente.");
      setStatus("error");
    }
  }

  function reset() {
    setFile(null);
    setStatus("idle");
    setError("");
    setHasSig(false);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-14">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <PenLine size={20} />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Assinar PDF</h1>
          </div>
          <p className="text-slate-500">Desenhe sua assinatura e insira na última página do documento.</p>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Desenhe sua assinatura</label>
                <button onClick={clearSig} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={13} /> Limpar
                </button>
              </div>
              <canvas
                ref={canvasRef}
                width={560}
                height={140}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                className="w-full border-2 border-dashed border-slate-200 rounded-xl cursor-crosshair bg-white"
              />
              <p className="text-xs text-slate-400 mt-1.5">A assinatura será inserida no canto inferior direito da última página.</p>
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
                PDF assinado com sucesso! O download começou automaticamente.
              </div>
            )}

            <button
              onClick={handleSign}
              disabled={!hasSig || status === "loading"}
              className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-40"
            >
              {status === "loading" ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Download size={17} />
              )}
              {status === "loading" ? "Assinando…" : "Assinar e baixar"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
