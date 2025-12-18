import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// API Key kontrolü
const apiKey = process.env.ANTHROPIC_API_KEY;

const anthropic = new Anthropic({
  apiKey: apiKey || 'dummy_key', // Boşsa patlamasın ama hata versin
});

export async function POST(req: Request) {
  try {
    // 1. Anahtar Kontrolü
    if (!apiKey) {
      throw new Error("API ANAHTARI BULUNAMADI (Vercel Environment Variables kontrol et)");
    }

    const { history, userName, sign, regret } = await req.json();

    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi.
      TARZ: Otoriter, gizemli, hafif alaycı, astrolojik referanslı.
      GÖREV: Hikayeyi devam ettir.
      KURAL: SADECE geçerli bir JSON formatında cevap ver.
      FORMAT: { "story": "Hikaye...", "options": ["Seçenek1", "Seçenek2"] }
    `;

    // Mesajları hazırla
    let messages: any[] = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    if (messages.length === 0) {
      messages.push({
        role: "user",
        content: `Ben ${userName}. Burcum ${sign}. Pişmanlığım: "${regret}". Başlat.`
      });
    }

    console.log("CLAUDE'A İSTEK GİDİYOR...");

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });

    console.log("CLAUDE CEVAP VERDİ:", msg.content);

    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    // JSON PARSING
    let parsedResponse;
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
    } else {
        throw new Error("Claude JSON döndürmedi: " + rawContent);
    }

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("API HATASI:", error);
    
    // HATA MESAJINI DİREKT EKRANA BASIYORUZ (DEBUG İÇİN)
    return NextResponse.json(
      { 
        story: `SİSTEM HATASI (DEBUG): ${error.message || error}`, 
        options: ["Tekrar Dene"] 
      },
      { status: 500 }
    );
  }
}
