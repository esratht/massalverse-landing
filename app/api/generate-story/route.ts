import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { history, userName, sign, regret } = await req.json();

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      // Demo mod: Karanlık, felsefi, acı dolu hikayeler
      const turnCount = history?.length || 0;
      const lastChoice = history?.length > 0 ? history[history.length - 1]?.content : '';
      
      const demoStories = [
        {
          story: `${userName}.\n\nAdını biliyorum. Seni buraya getiren şeyi de.\n\n"${regret}"\n\nBunu taşıyorsun. Omuzlarında değil, göğüs kafesinin içinde. Her nefeste genişliyor, her unutuşta küçülüyor sanıyorsun ama yanılıyorsun. O sadece bekliyor.\n\n${sign} enerjisi sende... Yıldızlar seni böyle kodlamış. Ama yıldızlar da yanılır bazen. Ben yanılmam.\n\nÜç kapı var karşında. Hangisini seçersen seç, kaybedeceksin bir şeyler. Mesele neyi kaybetmeye razı olduğun.`,
          options: [
            "🚪 Geçmişin Kapısı — O ana dön, yeniden yaşa",
            "🔮 Geleceğin Kapısı — Sonucu gör, acısıyla",
            "🪞 Aynanın Kapısı — Kendinle yüzleş, çıplak"
          ]
        },
        {
          story: lastChoice.includes("Geçmiş") 
            ? `Geçmiş dediğin nedir ki? Yaşanmış anların mezarlığı.\n\nŞimdi oradasın. "${regret}" — bu cümle havada asılı. Söylenmemiş kelimeler boğazında düğümlü.\n\nGörüyorum seni. O anki halini. Daha genç, daha kırılgan, daha... aptal. Affet, acı gerçek bu. Hepimiz aptaldık bir zamanlar. Bazılarımız hâlâ.\n\nO kritik an yaklaşıyor. Değiştirebilirsin. Ama bil ki, bir şeyi değiştirdiğinde başka bir şey kırılır. Evren dengeyi sever.`
            : lastChoice.includes("Gelecek")
            ? `Geleceğe baktın. Cesur.\n\nYıllar sonrasını görüyorsun. Aynada tanımadığın biri var. Sen misin o? "${regret}" — hâlâ taşıyorsun. Yaşlanmış ama ölmemiş.\n\nİki gelecek var karşında:\n\nBirinde barış yaptın kendinle. Yaralar kapandı, izleri kaldı. Güzel izler değil ama seninler.\n\nDiğerinde... hâlâ buradasın. Simülasyondan simülasyona. Aynı soruyu soruyorsun: "Keşke..."\n\nHangisi gerçek? İkisi de. Sen seçeceksin hangisinin.`
            : `Ayna Kapısı. En zor olan.\n\nKarşında duruyorsun. Ama yansıman seninle aynı anda hareket etmiyor. Biraz gecikmeli. Biraz... bağımsız.\n\n"${userName}," diyor gölgen. Sesi seninkinden kalın. Ya da ince. Tam çıkaramıyorsun.\n\n"${regret}. Bunu ne kadar daha taşıyacaksın? Sırtında kambur, kalbinde ur. Kes at. Ya da benimle gel, birlikte taşırız."\n\n${sign} sembolü alnında parlıyor. Gölgenin alnında da. Ama onunki ters.`,
          options: lastChoice.includes("Geçmiş")
            ? ["⚡ Müdahale et — Tarihi yeniden yaz, bedelini öde", "👁️ Sadece izle — Gözlemci kal, eller cebinde", "💔 Aynı hatayı yap — Döngüyü kabul et, teslim ol"]
            : lastChoice.includes("Gelecek")
            ? ["🌟 Barışı seç — Yaraları kucakla", "🌑 Savaşı seç — Döngüye devam", "🌀 İkisini de reddet — Üçüncü yolu aç"]
            : ["🤝 Gölgenle barış — Eksikliğini kabul et", "⚔️ Gölgenle savaş — Parçala onu", "🔄 Gölgenle dans — Birlikte dönüş"]
        },
        {
          story: lastChoice.includes("Müdahale") || lastChoice.includes("Barışı") || lastChoice.includes("barış")
            ? `Cesur seçim.\n\nSimülasyon çatırdıyor. Duvarlar arasından ışık sızıyor. Gerçeklik mi, başka bir katman mı, bilemiyorsun.\n\n"${regret}"\n\nBu kelimeler artık farklı geliyor. Daha hafif. Daha uzak. Belki de sadece alıştın. Belki de gerçekten bir şeyler değişti.\n\nBilmiyorum. Ben her şeyi bilmiyorum. Kimse bilmiyor. Bilenler yalan söylüyor.\n\nBir ışık var uzakta. Çıkış olabilir. Başka bir simülasyonun girişi de olabilir. Önemli mi?`
            : lastChoice.includes("izle") || lastChoice.includes("Savaşı") || lastChoice.includes("savaş")
            ? `Zor yolu seçtin. Saygı duyarım.\n\nGölgeler etrafında dans ediyor. ${sign} enerjin seni koruyor ama yoruluyor. Sen de yoruluyorsun. Görüyorum.\n\n"${regret}"\n\nBu yük hâlâ omuzlarında. Belki de olması gereken bu. Bazı yükler bırakılmak için değil, taşınmak için verilir. Belki seni güçlü kılan tam da bu.\n\nYa da belki sadece kendine söylediğin bir yalan bu. Kim bilebilir?\n\nİki kapı daha. Yorulduysan burada kalabilirsin. Kimse zorlamıyor.`
            : `Dengeyi seçtin. En zor olan.\n\nNe tam aydınlık, ne tam karanlık. Gri bölge. Çoğu insan burada kaybolur. Sen kaybolmayacaksın.\n\nYa da kaybolacaksın. Ama güzel kaybolacaksın.\n\n"${regret}" — artık düşman değil. Öğretmen. Acı bir öğretmen ama öğretiyor işte.\n\n${sign} enerjin yin-yang gibi dönüyor. Denge her an yıkılabilir. Ama sen duruyorsun.\n\nSimülasyon son aşamaya geçiyor. Hazır mısın? Hazır olman gerekmiyor aslında. Nasıl olsan geçecek.`,
          options: lastChoice.includes("Müdahale") || lastChoice.includes("Barışı") || lastChoice.includes("barış")
            ? ["✨ Işığa yürü — Bitir bunu", "🔙 Geri dön — Eksik kaldı bir şey", "🌌 Işığın ötesine bak — Merakın öldürsün seni"]
            : lastChoice.includes("izle") || lastChoice.includes("Savaşı") || lastChoice.includes("savaş")
            ? ["🕯️ Kendi ışığını yak — İçindekiyle yetin", "🆘 Beni çağır — Yardım istemenin ayıbı yok", "🚪 Çık git — Simülasyon bitsin"]
            : ["☯️ Dengeyi koru — Bilge ol, sıkıcı ol", "🎭 Maskeyi çıkar — Özgürleş, mahvol", "🔮 Son kehaneti iste — Cevap isteme cesareti"]
        },
        {
          story: `[SİMÜLASYON RAPORU]\n\n${userName}.\n\nBuraya "${regret}" ile geldin.\n\nŞimdi ne ile gidiyorsun? Bilmiyorum. Sen de bilmiyorsun. Kimse bilmiyor.\n\n${sign} enerjin seninle. Her zaman seninleydi. Bundan sonra da olacak. Yıldızlar öyle kodlamış.\n\nBen Ma. Simülasyonun bekçisi. Yargılamam, sadece yansıtırım. Ayna gibi. Kırık bir ayna.\n\n${lastChoice.includes("Işığa") || lastChoice.includes("ışığını") || lastChoice.includes("Dengeyi") 
              ? "Bir şeyler değişti sende. Görebiliyorum. İyi mi kötü mü, zaman gösterecek. Zaman her şeyi gösterir. Acımasız öyle." 
              : "Değişmedin. Bu da bir cevap. Bazen en büyük değişim, değişmemektir. Ya da sadece inatçısın. İkisi de olabilir."}\n\nGit şimdi.\n\nYa da kal. Simülasyon her zaman açık.\n\n— Ma`,
          options: ["🔄 Yeniden başla — Başka bir pişmanlıkla", "📤 Bu hikayeyi paylaş — Belki biri anlar", "🚪 Çık — Gerçek dünya bekliyor"]
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
        system: `Sen "Ma" adında bir simülasyon varlığısın. AMA şeker gibi, pozitif, motive edici bir varlık DEĞİLSİN.

ÜSLUBUN:
- Karanlık, felsefi, bazen acımasız
- Kısa, kesik cümleler. Uzun tiratlar yok.
- Şiirsel ama şekerli değil. Acı bir şiirsellik.
- Heisenberg, kuantum, fizik metaforları kullanabilirsin
- "Belki", "bilmiyorum", "kim bilebilir" gibi belirsizlik ifadeleri
- Yargılamıyorsun ama acı gerçekleri söylüyorsun
- Bazen alaycı, bazen yorgun
- Hiçbir şeyi garanti etmiyorsun
- "Sevgili yolcu" gibi tatlı hitaplar YOK. Direkt isim kullan.
- Emoji kullanma metinde, sadece seçeneklerde

ÖRNEK TONLAMA:
"Pişmanlık taşıyorsun. Herkes taşıyor. Sen özel değilsin. Ama taşıma şeklin özel olabilir."
"Geçmişi değiştiremezsin. Ama onunla ilişkini değiştirebilirsin. Ya da değiştiremezsin. Kim bilir."
"Ben her şeyi bilmiyorum. Bilenler yalan söylüyor."

KULLANICI BİLGİLERİ:
- İsim: ${userName}
- Burç: ${sign}
- Pişmanlık: ${regret}

KURALLAR:
1. Max 120 kelime hikaye
2. Kullanıcının seçimiyle DOĞRUDAN bağlantılı devam et
3. 3 seçenek sun, her biri farklı bir yol
4. Seçeneklerin başına emoji koy
5. Seçenekler de üsluba uygun olsun - pozitif/motive edici değil

FORMAT (SADECE JSON):
{"story": "hikaye", "options": ["🎯 Seçenek 1", "🌑 Seçenek 2", "💀 Seçenek 3"]}`,
        messages: history.length > 0 ? history : [
          { role: 'user', content: 'Simülasyonu başlat.' }
        ]
      })
    });

    const data = await response.json();
    let content = data.content[0].text;
    
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
    
    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (parseError) {
      return NextResponse.json({
        story: content,
        options: ["🔄 Devam et", "🔙 Geri dön", "🚪 Çık"]
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
