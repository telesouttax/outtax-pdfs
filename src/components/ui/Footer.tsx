import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#152c6b] mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image src="/logo-outtax.png" alt="Outtax" width={90} height={30} className="brightness-0 invert opacity-70" />
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Outtax PDFs · Todos os direitos reservados
        </p>
        <p className="text-xs text-white/30">Hospedado na Vercel</p>
      </div>
    </footer>
  );
}
