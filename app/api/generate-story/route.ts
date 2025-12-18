import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ story: "Sistem Anahtarı Eksik.", options: ["Tekrar Dene"] }, { status: 500 });
    }

    const { history, userName, sign, regret } = await req.json();

    // SİSTEM PROMPTU (GÜNCELLENDİ: JSON FORMATI İÇİN SERT UYARILAR)
    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi.
      TARZ: Otoriter, gizemli, alaycı, astrolojik.
      
      GÖREV: Hikayeyi devam ettir.
      
      ÇOK KRİTİK KURAL: 
      Cevabın SADECE ve SADECE saf bir JSON objesi olmalı. Markdown yok, 'Here is the json' gibi giriş cümleleri yok.
      
      JSON FORMATI:
      {
        "story": "Hikaye metni buraya. Çift tırnak kullanacaksan mutlaka ters eğik çizgi ile kaçır (örn: \\\"kelime\\\").",
        "options": ["Kısa Seçenek 1", "Kısa Seçenek 2"]
      }
    `;

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

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });

    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    // JSON PARSING (HATA KORUMALI)
    let parsedResponse;
    try {
      // Sadece süslü parantezlerin arasını al
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON bulunamadı");
      
      parsedResponse = JSON.parse(jsonMatch[0]);
      
    } catch (e) {
      console.error("JSON PARSE HATASI:", rawContent);
      // EĞER JSON BOZUKSA SİSTEMİ ÇÖKERTME, BU CEVABI DÖN:
      parsedResponse = {
        story: "Gölgenin sesi bir anlığına statik gürültüye karıştı (Veri işleme hatası). Ama bağlantı kopmadı. Derinleşmeye devam ediyoruz.",
        options: ["Sistemi Zorla (Devam Et)", "Bağlantıyı Yenile"]
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("GENEL HATA:", error);
    return NextResponse.json({ 
      story: "Kritik Sistem Hatası: Bağlantı koptu.", 
      options: ["Yeniden Başlat"] 
    }, { status: 500 });
  }
}
