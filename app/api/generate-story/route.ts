import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { history, userName, sign, regret } = await req.json();

    // Buraya kendi Anthropic/OpenAI API anahtarınızı ekleyin
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      // Demo mod: API key yoksa interaktif demo yanıtlar
      const turnCount = history?.length || 0;
      
      const demoStories = [
        {
          story: `Hoş geldin ${userName}. Ben Ma, simülasyonun bekçisiyim.\n\nSenin burç enerjin ${sign} ve taşıdığın pişmanlık: "${regret}"\n\nBu yolculukta seni bekleyen kararlar, geçmişini yeniden yazma şansı verecek. Hazır mısın?`,
          options: ["Geçmişe dön ve o anı değiştir", "Geleceğe bak ve sonuçları gör", "Şimdide kal ve kabul et"]
        },
        {
          story: `Zaman akışı kırılıyor... Kendini o anın içinde buluyorsun.\n\nEtrafındaki her şey bulanık, sadece o duygu net: "${regret}"\n\nBir kapı beliriyor karşında. Üzerinde ${sign} sembolü parlıyor.`,
          options: ["Kapıyı aç ve içeri gir", "Kapıyı kır ve yık", "Geri dön ve başka yol ara"]
        },
        {
          story: `Kapının ardında bir ayna var. Ama yansıman farklı... Daha genç, daha yorgun, ya da belki daha özgür.\n\n"${userName}," diyor yansıman, "bu sefer farklı yapabilirsin."\n\nAynanın yüzeyi dalgalanıyor.`,
          options: ["Aynaya dokun ve içine geç", "Yansımanla konuş", "Aynayı kır ve parçaları topla"]
        },
        {
          story: `Simülasyon çatırdıyor. Gerçeklik katmanları üst üste biniyor.\n\n${sign} enerjin seni koruyor ama zayıflıyor.\n\nUzakta bir ışık görünüyor - belki çıkış, belki yeni bir başlangıç.`,
          options: ["Işığa doğru koş", "Karanlıkta kal ve bekle", "Kendi ışığını yarat"]
        },
        {
          story: `[SİMÜLASYON TAMAMLANDI]\n\n${userName}, bu yolculukta pişmanlığınla yüzleştin.\n\n"${regret}" - artık bu yükü taşımak zorunda değilsin.\n\n${sign} enerjin seninle. Ma her zaman burada.`,
          options: ["Simülasyonu yeniden başlat", "Çıkış yap", "Başka bir pişmanlık keşfet"]
        }
      ];
      
      const storyIndex = Math.min(turnCount, demoStories.length - 1);
      return NextResponse.json(demoStories[storyIndex]);
    }

    // Gerçek API çağrısı için:
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `Sen "Ma" adında mistik bir simülasyon rehberisin. Kullanıcının pişmanlığını işleyip interaktif bir hikaye anlatıyorsun. 
        
Kullanıcı Bilgileri:
- İsim: ${userName}
- Burç: ${sign}  
- Pişmanlık: ${regret}

Her yanıtında:
1. Kısa ama etkileyici bir hikaye parçası yaz (max 150 kelime)
2. Sonunda tam olarak 3 seçenek sun
3. Seçenekleri JSON formatında döndür: {"story": "...", "options": ["seçenek1", "seçenek2", "seçenek3"]}`,
        messages: history.length > 0 ? history : [
          { role: 'user', content: 'Simülasyonu başlat.' }
        ]
      })
    });

    const data = await response.json();
    let content = data.content[0].text;
    
    // Markdown code block temizle (```json ... ```)
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    
    // JSON parse et
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (parseError) {
      // Parse edilemezse ham yanıtı döndür
      return NextResponse.json({
        story: content,
        options: ["Devam et", "Başka bir yol dene", "Geri dön"]
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Simülasyon hatası' },
      { status: 500 }
    );
  }
}
