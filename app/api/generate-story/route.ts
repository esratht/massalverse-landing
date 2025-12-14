import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { history, userName, sign, regret } = await req.json();

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      // Demo mod: Hikaye ile alakalı seçenekler
      const turnCount = history?.length || 0;
      const lastChoice = history?.length > 0 ? history[history.length - 1]?.content : '';
      
      const demoStories = [
        {
          story: `Hoş geldin ${userName}. Ben Ma, simülasyonun bekçisiyim.\n\nSenin burç enerjin ${sign} ve taşıdığın pişmanlık: "${regret}"\n\nKarşında üç yol var. Her biri seni farklı bir gerçekliğe götürecek. Hangi kapıyı seçersen seç, geri dönüş yok.`,
          options: [
            "🚪 Geçmiş Kapısı - O anı yeniden yaşa",
            "🔮 Gelecek Kapısı - Sonuçları gör",
            "🪞 Ayna Kapısı - Kendinle yüzleş"
          ]
        },
        {
          story: lastChoice.includes("Geçmiş") 
            ? `Geçmiş Kapısı açılıyor... Zaman geriye sarılıyor.\n\nKendini o anın içinde buluyorsun: "${regret}"\n\nHer şey aynı, ama bu sefer farkındasın. ${sign} enerjin sana güç veriyor. O kritik an yaklaşıyor.`
            : lastChoice.includes("Gelecek")
            ? `Gelecek Kapısı açılıyor... Zaman ileri akıyor.\n\nYıllar sonrasını görüyorsun. "${regret}" - bu pişmanlık seninle yaşlanmış.\n\nAma bekle... İki farklı gelecek beliriyor. Hangisi gerçek?`
            : `Ayna Kapısı açılıyor... Yansıman seninle konuşuyor.\n\n"${userName}," diyor gölgen, "${regret} - bunu hâlâ taşıyorsun. Neden bırakmıyorsun?"\n\n${sign} sembolü alnında parlıyor.`,
          options: lastChoice.includes("Geçmiş")
            ? ["⚡ Müdahale et - Tarihi değiştir", "👁️ Sadece izle - Gözlemci kal", "💔 Aynı hatayı yap - Döngüyü kabul et"]
            : lastChoice.includes("Gelecek")
            ? ["🌟 Parlak gelecek - Pişmanlıksız yaşam", "🌑 Karanlık gelecek - Değişmeyen sen", "🌀 İkisini birleştir - Denge bul"]
            : ["🤝 Gölgenle barış - Kabullen", "⚔️ Gölgenle savaş - Reddet", "🔄 Gölgenle dans et - Dönüştür"]
        },
        {
          story: lastChoice.includes("Müdahale") || lastChoice.includes("Parlak") || lastChoice.includes("barış")
            ? `Cesur bir seçim, ${userName}.\n\nSimülasyon sarsılıyor. ${sign} enerjin dorukta.\n\n"${regret}" - bu kelimeler artık farklı hissettiriyor. Daha hafif. Daha uzak.\n\nBir ışık beliriyor. Çıkış mı, yoksa yeni bir başlangıç mı?`
            : lastChoice.includes("izle") || lastChoice.includes("Karanlık") || lastChoice.includes("savaş")
            ? `Zor yolu seçtin, ${userName}.\n\nGölgeler etrafında dans ediyor. ${sign} enerjin seni koruyor ama yoruluyor.\n\n"${regret}" - bu yük hâlâ omuzlarında. Ama belki de taşıman gereken bir ders var içinde.\n\nİki kapı daha beliriyor.`
            : `Dengeyi seçtin, ${userName}.\n\nNe tamamen aydınlık, ne tamamen karanlık. ${sign} enerjin yin-yang gibi dönüyor.\n\n"${regret}" - artık bir düşman değil, bir öğretmen.\n\nSimülasyon son aşamaya geçiyor.`,
          options: lastChoice.includes("Müdahale") || lastChoice.includes("Parlak") || lastChoice.includes("barış")
            ? ["✨ Işığa yürü - Simülasyonu tamamla", "🔙 Geri dön - Bir şey eksik kaldı", "🌌 Işığın ötesine bak - Merak et"]
            : lastChoice.includes("izle") || lastChoice.includes("Karanlık") || lastChoice.includes("savaş")
            ? ["🕯️ Kendi ışığını yak - İçsel güç", "🆘 Yardım iste - Ma'yı çağır", "🏃 Kaç - Simülasyondan çık"]
            : ["☯️ Dengeyi koru - Bilge ol", "🎭 Maskeyi çıkar - Özgürleş", "🔮 Geleceği sor - Son kehanet"]
        },
        {
          story: `[SİMÜLASYON SONUÇ RAPORU]\n\n${userName}, yolculuğun tamamlandı.\n\n📊 Profil: ${sign} Enerjisi\n💫 İşlenen Pişmanlık: "${regret}"\n🎯 Seçim Paterni: ${lastChoice.includes("Işığa") || lastChoice.includes("ışığını") || lastChoice.includes("Dengeyi") ? "Dönüştürücü" : "Arayış İçinde"}\n\n${lastChoice.includes("Işığa") || lastChoice.includes("ışığını") || lastChoice.includes("Dengeyi") 
            ? "✅ Pişmanlığınla yüzleştin ve onu dönüştürdün. Artık bu yükü taşımak zorunda değilsin." 
            : "⚠️ Yolculuk devam ediyor. Bazı cevaplar zaman alır. Tekrar dene."}\n\nMa seninle. Her zaman.`,
          options: ["🔄 Yeni simülasyon başlat", "📤 Hikayemi paylaş", "🏠 Ana sayfaya dön"]
        }
      ];
      
      const storyIndex = Math.min(turnCount, demoStories.length - 1);
      return NextResponse.json(demoStories[storyIndex]);
    }

    // Gerçek API çağrısı
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
        system: `Sen "Ma" adında mistik bir simülasyon rehberisin. Türkçe konuşuyorsun.

KULLANICI BİLGİLERİ:
- İsim: ${userName}
- Burç: ${sign}
- Pişmanlık: ${regret}

KURALLAR:
1. Kısa ama etkileyici bir hikaye parçası yaz (max 150 kelime)
2. Hikaye kullanıcının son seçimiyle DOĞRUDAN bağlantılı olmalı
3. Burç enerjisini ve pişmanlık temasını hikayeye ör
4. Sonunda tam olarak 3 seçenek sun
5. SEÇENEKLER HİKAYEYLE ALAKALI OLMALI - rastgele değil, hikayenin devamı niteliğinde
6. Her seçenek farklı bir yol/sonuç sunmalı
7. Seçeneklerin başına emoji koy

FORMAT (SADECE JSON, başka bir şey yazma):
{"story": "hikaye metni", "options": ["🎯 Seçenek 1", "🌟 Seçenek 2", "🔮 Seçenek 3"]}`,
        messages: history.length > 0 ? history : [
          { role: 'user', content: 'Simülasyonu başlat.' }
        ]
      })
    });

    const data = await response.json();
    let content = data.content[0].text;
    
    // Markdown code block temizle
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (parseError) {
      return NextResponse.json({
        story: content,
        options: ["🔄 Devam et", "🔙 Başka bir yol dene", "🏠 Geri dön"]
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
