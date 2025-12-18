import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// Bu satır Vercel'de kodun Node.js ortamında çalışmasını garantiler (Daha kararlı)
export const runtime = 'nodejs';
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Frontend'den gelen veriyi al
    const { history, userName, sign, regret } = await req.json();

    // 2. Sistem Promptunu Hazırla (MA'nın Beyni)
    // Burada Claude'a kesinlikle JSON dönmesi gerektiğini emrediyoruz.
    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi.
      TARZ: Otoriter, gizemli, hafif alaycı, astrolojik ve felsefi referanslar veren bir "Sovereign Architect".
      
      GÖREV:
      Kullanıcının burcu (${sign}) ve pişmanlığı (${regret}) üzerinden hikayeyi devam ettir.
      
      ÇOK ÖNEMLİ KURAL:
      Cevabını SADECE geçerli bir JSON formatında ver. Başka hiçbir kelime etme.
      
      İSTENEN JSON FORMATI:
      {
        "story": "Buraya hikaye metni gelecek (Max 500 karakter).",
        "options": ["Seçenek 1 (Kısa)", "Seçenek 2 (Kısa)"]
      }
    `;

    // 3. Mesaj Geçmişini Formatla
    // İlk mesaj boşsa başlatıcı mesajı biz ekliyoruz
    let messages = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    if (messages.length === 0) {
      messages.push({
        role: "user",
        content: `Ben ${userName}. Burcum ${sign}. Pişmanlığım: "${regret}". Analizini yap ve oyunu başlat.`
      });
    }

    // 4. Claude'a Çağrı Yap (Model: Claude 3.5 Sonnet veya Haiku)
    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Hız için Haiku, Zeka için "claude-3-5-sonnet-latest"
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });

    // 5. Gelen Cevabı İşle (JSON Parsing)
    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    let parsedResponse;
    try {
      // Claude bazen JSON'ın dışına yazı eklerse temizle
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
          throw new Error("JSON bulunamadı");
      }
    } catch (e) {
      console.error("JSON Parse Hatası:", rawContent);
      // Eğer JSON bozuk gelirse fallback (yedek) cevap dön
      parsedResponse = {
        story: "Sistem veriyi işlerken bir anomali oluştu. Gölgen sessizliğe büründü. Ne yapacaksın?",
        options: ["Sistemi Zorla (Tekrar Dene)", "Bağlantıyı Kes"]
      };
    }

    // 6. Sonucu Döndür
    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("API ROUTE ERROR:", error);
    return NextResponse.json(
      { story: "Bağlantı koptu. Gölgen sana ulaşamıyor.", options: ["Yeniden Başlat"] },
      { status: 500 }
    );
  }
}
