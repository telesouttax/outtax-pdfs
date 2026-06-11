"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { clsx } from "clsx";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: Record<string, string[]>;
  label?: string;
  sublabel?: string;
}

export default function DropZone({
  onFile,
  accept = { "application/pdf": [".pdf"] },
  label = "Arraste seu PDF aqui",
  sublabel = "ou clique para selecionar · até 100 MB",
}: DropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx(
        "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <Upload size={24} className="text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-slate-800">{label}</p>
          <p className="text-sm text-slate-400 mt-1">{sublabel}</p>
        </div>
      </div>
    </div>
  );
}
