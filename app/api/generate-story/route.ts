import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// BU SATIR HAYAT KURTARIR: Vercel'e "Node.js kullan" diyoruz.
export const runtime = 'nodejs'; 

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. API KEY KONTROLÜ
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("HATA: API Key tanımlı değil!");
      return NextResponse.json({ 
        story: "Sistem Anahtarı Eksik. Vercel ayarlarını kontrol et.", 
        options: ["Tekrar Dene"] 
      }, { status: 500 });
    }

    const { history, userName, sign, regret } = await req.json();

    // 2. SİSTEM PROMPTU (MA PERSONASI)
    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi.
      TARZ: Otoriter, gizemli, alaycı, astrolojik (Satürn/Plüton) referanslı.
      GÖREV: Kullanıcının burcu (${sign}) ve pişmanlığı (${regret}) üzerinden hikayeyi devam ettir.
      
      KURAL: Cevabını SADECE geçerli bir JSON formatında ver. JSON dışında tek kelime etme.
      
      İSTENEN JSON FORMATI:
      {
        "story": "Buraya hikaye metni (Max 400 karakter).",
        "options": ["Seçenek 1", "Seçenek 2"]
      }
    `;

    // 3. MESAJLARI HAZIRLA
    const messages = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    if (messages.length === 0) {
      messages.push({
        role: "user",
        content: `Ben ${userName}. Burcum ${sign}. Pişmanlığım: "${regret}". Analiz et.`
      });
    }

    // 4. CLAUDE'U ÇAĞIR
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Hızlı ve ucuz model
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    });

    // 5. CEVABI İŞLE (JSON PARSING)
    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    // Güvenli JSON Ayıklama
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Claude JSON döndürmedi.");
    
    const parsedResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("API HATASI:", error);
    return NextResponse.json({ 
      story: `SİSTEM HATASI: ${error.message || "Bilinmeyen Hata"}. (Build loglarına bak)`, 
      options: ["Yeniden Başlat"] 
    }, { status: 500 });
  }
}
