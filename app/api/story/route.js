import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { choice, stage, userProfile } = await req.json();
    let systemPrompt = "";
    let isFinal = false;

    // --- SENARYO HARİTASI ---
    if (stage === 'kintsugi') systemPrompt = "Kintsugi. Kırıkların altınla onarılması. Mistik ve güçlü bir açılış.";
    else if (stage === 'intro') systemPrompt = "Lansman. Hoşgeldiniz mesajı.";
    else if (stage === 'childhood') systemPrompt = "Mum ışığında seçim anı. İlim (Mühendis) mi, Hikmet (Ev Kızı) mi?";
    
    // --- MÜHENDİS ZİNCİRİ ---
    else if (stage === 'muh') systemPrompt = "Kullanıcı Mühendisliği seçti. Kariyer, plazalar, başarı hırsı.";
    else if (stage === 'atakm') systemPrompt = "Mühendislik Atağı. Sistem çöküyor. Kodlar, mavi ışık, panik.";
    else if (stage === 'priz') systemPrompt = "Priz Sahnesi. Enerjiyi kaynaktan alma sanrısı. Elektrikle bütünleşme.";

    // --- EV KIZI ZİNCİRİ ---
    else if (stage === 'evkizi') systemPrompt = "Kullanıcı Ev Kızını seçti. Huzur sanılan sessizlik, ev işleri, rutin.";
    else if (stage === 'atakb') systemPrompt = "Ev Atağı. Duvarlar üstüne geliyor. Sıkışmışlık ve görünmezlik hissi.";
    
    // --- ARA DURAKLAR ---
    else if (stage === 'halis') systemPrompt = "Halüsinasyon. Gerçeklik perdesi yırtılıyor. Görüntüler bozuk.";
    else if (stage === 'manti') systemPrompt = "Mantı Sahnesi (Ev Kızı için). Halüsinasyonun ortasında robotik bir şekilde hamur açma. Trans hali.";

    // --- ORTAK TÜNEL ---
    else if (stage === 'tv') systemPrompt = "TV'deki adama kilitlenme. Ekranın içinden gelen çağrı.";
    else if (stage === 'el') systemPrompt = "Umut dolu bir el uzanıyor.";
    else if (stage === 'tvel') systemPrompt = "TV'deki adam elini uzattı. Sınırlar kalktı.";
    else if (stage === 'anneel') systemPrompt = "ŞOK. Annenin yaşlı eli. Gerçek yüzüne vurdu.";
    else if (stage === 'uzuntu') systemPrompt = "Büyük hüzün ve çöküş.";
    else if (stage === 'theend') { isFinal = true; systemPrompt = "Final. Simsiyah veda."; }

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 150,
      temperature: 0.7,
      system: "Sen karanlık bir film anlatıcısısın. JSON yanıt ver: { text: '...' }",
      messages: [{ role: "user", content: systemPrompt || "Devam et" }]
    });

    const content = msg.content[0].text;
    const jsonString = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    const result = JSON.parse(jsonString);

    return NextResponse.json({ text: result.text, isFinal: isFinal });

  } catch (error) {
    return NextResponse.json({ text: "...", isFinal: true });
  }
}
