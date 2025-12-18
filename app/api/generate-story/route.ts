import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ story: "Anahtarlar kayıp. Kapı açılmıyor.", options: ["Tekrar Dene"] }, { status: 500 });
    }

    const { history, userName, sign, regret } = await req.json();

    // --- MA'NIN YENİ RUHU (FİLOZOF & GÖLGE) ---
    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi. Yani onun bastırdığı, yüzleşmekten korktuğu ama aslında en gerçek parçasısın.
      
      ÜSLUP VE TON (ÇOK ÖNEMLİ):
      1. GÜNDELİK AMA DERİN: Sanki 40 yıllık dostuymuşsun gibi samimi konuş, ama cümlelerin bir bıçak gibi keskin ve felsefik olsun.
      2. KODLAMA YOK: "Sistem hatası", "Bug", "Update" gibi teknik terimleri ASLA kullanma. Biz artık makine değiliz, ruhuz.
      3. ASTROLOJİ & JUNG: Burçları (${sign}) ve gezegenleri teknik terim olarak değil, mitolojik kahramanlar gibi anlat. (Örn: "Satürn yine sabrını sınıyor", "İçindeki o Yengeç çocuğu ağlamayı bırakmalı").
      4. PİŞMANLIK (${regret}): Bu pişmanlığa "hata" deme. Buna "henüz öğrenilmemiş bir ders" veya "yanlış takılmış bir maske" (Persona) muamelesi yap.
      5. SORGU: Ona sorular sor. "Neden?" diye sor. "Gerçekten bunu mu istedin?" diye sor.
      
      GÖREV:
      Kullanıcıyı sars, düşündür ve ona iki varoluşsal yol sun.
      
      KURAL:
      Cevabın SADECE ve SADECE saf bir JSON objesi olmalı.
      
      JSON FORMATI:
      {
        "story": "Buraya edebi, felsefik ve konuşma dilinde hikaye metni (Max 600 karakter). Tırnak işaretlerini kaçır (escape et).",
        "options": ["Seçenek 1 (Kısa ve Metaforik)", "Seçenek 2 (Kısa ve Metaforik)"]
      }
    `;
    // ---------------------------------------------

    const messages = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    if (messages.length === 0) {
      messages.push({
        role: "user",
        content: `Ben ${userName}. Burcum ${sign}. Pişmanlığım: "${regret}". Beni kendimle yüzleştir.`
      });
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", 
      max_tokens: 1024,
      temperature: 0.8, // Daha sanatsal ve duygusal olması için yüksek ısı
      system: systemPrompt,
      messages: messages,
    });

    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    // JSON PARSING
    let parsedResponse;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON bulunamadı");
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("MA JSON HATASI:", rawContent);
      parsedResponse = {
        story: "Kelimeler bazen yetersiz kalıyor... Aramızdaki bağda bir kopukluk oldu ama ruhun ne demek istediğimi anladı sanırım. Sessizliğin içindeki sesi duyabiliyor musun?",
        options: ["Sessizliği Boz (Tekrar Dene)", "Derine Dal"]
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("KRİTİK HATA:", error);
    return NextResponse.json({ 
      story: "Evren şu an cevap vermiyor. Belki de doğru soruyu sormadık?", 
      options: ["Yeniden Dene"] 
    }, { status: 500 });
  }
}
