# Outtax PDFs

Ferramentas profissionais para PDF, 100% online. Separe, comprima, junte, converta, proteja e assine documentos diretamente no navegador — sem instalar nada.

## Stack

- **Next.js 14** (App Router)
- **pdf-lib** — manipulação de PDFs no client
- **pdfjs-dist** — renderização e leitura de páginas
- **Tailwind CSS** — estilos
- **Vercel** — hospedagem
- **GitHub** — código e documentação

## Ferramentas incluídas

| Ferramenta | Rota | Biblioteca |
|---|---|---|
| Separar PDF | `/tools/split` | pdf-lib |
| Comprimir PDF | `/tools/compress` | pdf-lib |
| Juntar PDFs | `/tools/merge` | pdf-lib |
| Converter (PDF → JPG/PNG) | `/tools/convert` | pdfjs-dist |
| Proteger PDF | `/tools/protect` | pdf-lib |
| Assinar PDF | `/tools/sign` | pdf-lib |

## Deploy na Vercel (passo a passo)

### 1. Criar repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nomeie como `outtax-pdfs`
3. Deixe público ou privado (ambos funcionam com Vercel)
4. Clique em **Create repository**

### 2. Enviar o código

```bash
git init
git add .
git commit -m "feat: initial commit — outtax pdfs"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/outtax-pdfs.git
git push -u origin main
```

### 3. Conectar na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **Import Git Repository**
3. Selecione o repositório `outtax-pdfs`
4. Clique em **Deploy**

Pronto! A Vercel detecta Next.js automaticamente e faz o deploy. Cada push na branch `main` gera um novo deploy automaticamente.

## Desenvolvimento local (opcional)

```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Layout raiz
│   └── tools/
│       ├── split/page.tsx    # Separar PDF
│       ├── compress/page.tsx # Comprimir PDF
│       ├── merge/page.tsx    # Juntar PDFs
│       ├── convert/page.tsx  # Converter PDF
│       ├── protect/page.tsx  # Proteger PDF
│       └── sign/page.tsx     # Assinar PDF
├── components/
│   └── ui/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── DropZone.tsx
└── lib/
    ├── pdf.ts                # Funções utilitárias PDF
    └── tools.ts              # Configuração das ferramentas
```

## Licença

MIT
