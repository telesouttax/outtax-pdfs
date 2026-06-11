"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError("A senha deve ter pelo menos 6 caracteres."); return; }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      setError(error.message === "User already registered" ? "Este e-mail já está cadastrado." : "Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#152c6b] via-[#1e3d8f] to-[#285199] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-[#152c6b] mb-2">Conta criada!</h2>
          <p className="text-slate-500 text-sm mb-6">Sua conta foi criada com sucesso.</p>
          <Link href="/login" className="inline-block w-full py-3 bg-[#152c6b] text-white rounded-xl font-medium text-sm hover:bg-[#285199] transition-colors text-center">
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#152c6b] via-[#1e3d8f] to-[#285199] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/logo-outtax.png" alt="Outtax" width={140} height={46} className="brightness-0 invert mx-auto mb-4" />
          <p className="text-white/60 text-sm">Crie sua conta gratuitamente</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-xl font-semibold text-[#152c6b] mb-6">Criar conta</h1>
          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#152c6b] mb-1.5">Nome completo</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#285199] text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#152c6b] mb-1.5">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#285199] text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#152c6b] mb-1.5">Senha</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#285199] text-slate-800" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 bg-[#152c6b] text-white rounded-xl font-medium text-sm hover:bg-[#285199] transition-colors disabled:opacity-50 mt-2">
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-2">ou</div>
          </div>

          <p className="text-center text-sm text-slate-500">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#285199] font-semibold hover:underline">Entrar</Link>
          </p>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © {new Date().getFullYear()} Outtax · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
