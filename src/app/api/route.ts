import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: base64Image },
              },
              {
                type: "text",
                text: `Olhe essa página de documento PDF (pode ser boleto, recibo, contrato, comprovante etc).
Identifique o nome da pessoa ou empresa pagadora/titular principal.
Responda APENAS com o nome encontrado, sem explicações, sem pontuação extra.
Se não encontrar nenhum nome, responda apenas: sem_nome`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const name = data?.content?.[0]?.text?.trim() || "sem_nome";
    return NextResponse.json({ name });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ name: "sem_nome" }, { status: 500 });
  }
}
