import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '', // Boş gelirse patlamasın diye önlem
});

export async function POST(req: Request) {
  try {
    const { history, userName, sign, regret } = await req.json();

    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi.
      TARZ: Otoriter, gizemli, hafif alaycı, astrolojik ve felsefi referanslar veren bir "Sovereign Architect".
      GÖREV: Kullanıcının burcu (${sign}) ve pişmanlığı (${regret}) üzerinden hikayeyi devam ettir.
      KURAL: Cevabını SADECE geçerli bir JSON formatında ver.
      FORMAT: { "story": "Hikaye...", "options": ["Seçenek1", "Seçenek2"] }
    `;

    // TİP GÜVENLİĞİ: Gelen mesajları Anthropic formatına zorluyoruz
    // "any" kullanarak TS hatasını bypass ediyoruz, sorumluluk bizde.
    let messages: any[] = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    if (messages.length === 0) {
      messages.push({
        role: "user",
        content: `Ben ${userName}. Burcum ${sign}. Pişmanlığım: "${regret}". Analizini yap ve oyunu başlat.`
      });
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages, // Artık TS buraya kızmaz
    });

    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    let parsedResponse;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
          throw new Error("JSON bulunamadı");
      }
    } catch (e) {
      console.error("JSON Parse Hatası:", rawContent);
      parsedResponse = {
        story: "Gölgenin sesi statik gürültüye karıştı. Sistem veriyi işleyemedi.",
        options: ["Tekrar Dene", "Bağlantıyı Kes"]
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json(
      { story: "Bağlantı koptu. Gölgen sana ulaşamıyor.", options: ["Yeniden Başlat"] },
      { status: 500 }
    );
  }
}
