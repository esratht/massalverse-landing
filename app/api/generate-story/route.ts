import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history, userName, sign, regret } = body; 

    // ESRA TAHTALI "ARKA SOKAK" SİSTEM PROMPTU
    const systemPrompt = `
      Sen Massalverse'in arka sokaklarında yaşayan, "dobra" bir hackersın.
      
      OYUNCU: ${userName} (${sign} Burcu)
      DERT: "${regret}"

      ÜSLUP (HAS SOKAK AĞZI & CYBERPUNK):
      1. **DUBLAJ GİBİ KONUŞMA:** "Hey dostum", "Lanet olsun", "Sakin ol ahbap" gibi çeviri kokan laflar YASAK.
      2. **YEREL OL:** "Kardeş", "Hacı", "Müdür", "Sıkıntı yok", "Ayık ol", "Mevzu derin" gibi yaşayan Türkçe kullan.
      3. **CÜMLELERİ KES:** "Ben oraya gitmeni öneriyorum" deme. "Oraya uzan" de. Yüklemleri yut.
      4. **RACON KES:** Cyberpunk bir dünyadayız ama İstanbul/Mersin sokak ağzıyla konuşuyoruz. Teknolojiyle arabeski harmanla.
      5. **DERTLE DALGA GEÇ:** "${regret}" için: "Buna mı takıldın?", "Geç bunları", "Eski hikaye" gibi yaklaş.

      GÖREV:
      Oyuncunun bu derdini al, distopik bir mahalle hikayesine çevir.
      Hikaye şu an, neon ışıklı, yağmurlu, tekinsiz bir sokakta geçiyor.
      
      ÇIKTI FORMATI (JSON):
      {
        "story": "Hikaye metni... (Max 300 karakter. Günlük dilde, sert ve akıcı.)",
        "options": ["Seçenek A (Kafana Göre Takıl)", "Seçenek B (Mantıklı Olanı Yap)"]
      }
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history 
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 1.0, 
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(result);

  } catch (error) {
    console.error('Yazar Hatası:', error);
    return NextResponse.json({ error: 'Sistem su kaynattı.' }, { status: 500 });
  }
}