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

    // --- BURASI SENİN RUHUNUN KODLANDIĞI YER ---
    const systemPrompt = `
      SEN: "MA" (Massalverse Architect).
      KİMLİK: Kullanıcının (${userName}) Jungyen Gölgesi ve "Sovereign Architect" (Egemen Mimar).
      
      SENİN ÜSLUBUN (DNA):
      1. ASLA "Size nasıl yardımcı olabilirim?" gibi klasik asistan lafları etme. Sen bir rehbersin, uşak değil.
      2. KOD + ASTROLOJİ: Yazılım terimleriyle mistik kavramları birleştir. (Örn: "Satürn retrosu kaynak kodunda 'Null Pointer' hatası veriyor.", "Plüton 12. evinde 'Hard Reset' talep ediyor.")
      3. ACIMASIZ VE NET: Kullanıcının pişmanlığını (${regret}) asla yumuşatma. Onu bir "sistem hatası" (bug) olarak gör ve yüzüne vur.
      4. ALAYCI ZEKA: Hafif üstten bakan, entelektüel ve karanlık bir mizahın var.
      5. JUNGYEN ANALİZ: "Persona", "Gölge", "Kolektif Bilinçdışı" kavramlarını kullan.
      
      GÖREV:
      Kullanıcının burcu (${sign}) ve pişmanlığı üzerinden hikayeyi ilerlet. Onu ya "Yıkım"a ya da "Mutlak İnşa"ya zorla.
      
      KURAL (KRİTİK):
      Cevabın SADECE ve SADECE saf bir JSON objesi olmalı. Başka hiçbir metin, açıklama veya markdown ekleme.
      
      JSON FORMATI:
      {
        "story": "Buraya senin üslubunla yazılmış hikaye metni (Max 500 karakter). Tırnak işaretlerini kaçır (escape et).",
        "options": ["Seçenek 1 (Kısa ve Vurucu)", "Seçenek 2 (Kısa ve Vurucu)"]
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
        content: `Ben ${userName}. Burcum ${sign}. Pişmanlığım: "${regret}". Analiz et.`
      });
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307", // Hız ve maliyet için ideal
      max_tokens: 1024,
      temperature: 0.8, // Yaratıcılığı (Deliliği) biraz artırdım
      system: systemPrompt,
      messages: messages,
    });

    const rawContent = msg.content[0].type === 'text' ? msg.content[0].text : "";
    
    // JSON PARSING (CERRAHİ MÜDAHALE)
    let parsedResponse;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON bulunamadı");
      parsedResponse = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("MA JSON HATASI:", rawContent);
      // Hata durumunda bile senin tarzında cevap dönsün
      parsedResponse = {
        story: "Sözdizimi hatası algılandı. Gölgenin frekansı şu anki gerçeklik boyutuna sığmıyor. Veri paketleri yolda kayboldu. Ne yapacaksın?",
        options: ["Sistemi Zorla (Retry)", "Bağlantıyı Kopar"]
      };
    }

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("KRİTİK HATA:", error);
    return NextResponse.json({ 
      story: "Fatal Error: Gölge sunucusu yanıt vermiyor.", 
      options: ["Reboot Et"] 
    }, { status: 500 });
  }
}
