export type Tool = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  bg: string;
  featured?: boolean;
};

export const tools: Tool[] = [
  {
    slug: "split",
    name: "Separar PDF",
    description: "Divida um PDF em múltiplos arquivos por páginas ou intervalos.",
    longDescription: "Selecione quais páginas ou intervalos quer extrair. O resultado é baixado como um arquivo ZIP com cada parte separada.",
    icon: "Scissors",
    color: "text-blue-600",
    bg: "bg-blue-50",
    featured: true,
  },
  {
    slug: "compress",
    name: "Comprimir PDF",
    description: "Reduza o tamanho sem perder qualidade visual do documento.",
    longDescription: "Comprime imagens e remove metadados desnecessários para reduzir o tamanho do arquivo mantendo a leitura perfeita.",
    icon: "FileZip",
    color: "text-teal-600",
    bg: "bg-teal-50",
    featured: true,
  },
  {
    slug: "merge",
    name: "Juntar PDFs",
    description: "Combine vários arquivos em um único documento organizado.",
    longDescription: "Arraste múltiplos PDFs e ordene-os como quiser antes de combinar em um único arquivo.",
    icon: "Files",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    slug: "convert",
    name: "Converter",
    description: "PDF para Word, Excel, JPG e outros formatos populares.",
    longDescription: "Converta seus PDFs para os formatos mais usados: DOCX, XLSX, PNG, JPG.",
    icon: "RefreshCw",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    slug: "protect",
    name: "Proteger PDF",
    description: "Adicione senha e restrições de acesso ao seu documento.",
    longDescription: "Proteja seus documentos com senha de 256-bit AES e defina permissões como impressão e cópia.",
    icon: "Lock",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    slug: "sign",
    name: "Assinar PDF",
    description: "Insira assinatura digital em documentos.",
    longDescription: "Desenhe ou faça upload de sua assinatura e posicione-a no documento com precisão.",
    icon: "PenLine",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];
