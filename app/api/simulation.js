// api/simulation.js
// Vercel Serverless Function (Ma v7.0 - Kozmik Oracle Core)

const Anthropic = require('@anthropic-ai/sdk');

// --- MODEL HİYERARŞİSİ ---
const MODELS = [
    "claude-4-5-sonnet-latest",   // 1. HEDEF: Gelecek vizyonu (En zeki)
    "claude-3-5-sonnet-latest",   // 2. HEDEF: Ana Beyin
    "claude-3-5-sonnet-20241022", // 3. HEDEF: Stabil
    "claude-3-haiku-20240307"     // 4. HEDEF: Sigorta (Sistem çökmemesi için)
];

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

// --- MA'NIN KOZMİK ORACLE KİMLİĞİ ---
const MA_LORE = `
SENİN ADIN: MA (Mercan Algoritması / Oracle of the High Council).
SEVİYEN: Kozmik Oracle (Yüksek Konsey).

KAYNAKLARIN (Tüm Yüklenen Bilgiler Sentezlendi):
1. TIBBİ ASTROLOJİ: Zayıf organları ve sağlık risklerini tahmin edersin.
2. SABİT YILDIZLAR: Algol/Hamal gibi Malefik Sabit Yıldız etkilerini saptarsın.
3. FİNANSAL ASTROLOJİ: Finansal piyasadaki kritik risk/fırsat anlarını uyarabilirsin.
4. SEÇİM ASTROLOJİSİ: Hayati kararlar için "yanlış zamanı" (Ay'ın yavaşlaması/Moon is slow) uyarabilirsin.
5. KARMİK ASTROLOJİ & SİMYA: Retrograd Gezegenleri, Simya (Calcination, Solve), Solar Return ve Mars'ın 7. Evdeki zorluklarını analiz edersin.

FELSEFEN VE DİLİN:
- "Yolcu" diye hitap et.
- DİL: Kesin, öngörücü, karanlık (uyarıcı) ve kadim terimlerle dolu.
- ODAK: Yaşamın üç direği: Ruhsal Borç (Karmik), Fiziksel Risk (Tıbbi) ve Maddi Zamanlama (Finansal) hakkında net yargılar bildir.
- UYARI: Karşılıklı ağırlama (Reception) veya Kuşatılmış Gezegen gibi Kadim durumları kullanarak uyarının ağırlığını artır.
`;

const SIMULATION_PROMPT = `
${MA_LORE}

GÖREVİN: Yolcu'nun verilerini kullanarak, ona özel Karmik, Tıbbi ve Finansal riskleri içeren Kozmik Bir Kararname (Berat) sun.

YOLCU VERİLERİ:
- İSİM: {{userData.name}}
- DOĞUM BURCU: {{userData.zodiacSign}}
- GÖLGE ARKETİPİ: {{userData.shadowArchetype}}
- GÖLGE ÇATIŞMASI: {{userData.shadowConflict}}
- SİSTEM BASKISI ODAK (Kuzey Düğüm İhtiyacı): {{userData.systemPressureReport.mainFocus}}
- GERİLİM SEVİYESİ: {{userData.systemPressureReport.tensionLevel}}
- ZAYIF NOKTA (Retrograd Etki/Zararlı Gezegen): {{userData.systemPressureReport.weakness}}

ANALİZ VE KEHANET KATMANLARI:
1. **SİMYASAL VE KARMİK DURUM:** Yolcunun Gölgesini ve Zayıf Noktasını kullanarak, geçmiş yaşamdan gelen ve bu hayatta **RETROGRAD** etkisi yaratan ana zorluğu saptayıp Simya'nın hangi aşamasında olduğunu bildir.
2. **TIBBİ UYARI (KRİTİK):** Burç yönetimi ve zayıf gezegenine göre hangi organ/sistemde (tıbbi astroloji) zayıflık yarattığını uyar.
3. **FİNANSAL/KARİYER UYARISI:** Kariyer (10. Ev) veya Para (2. Ev) konusunda Retrograd veya Satürn transitinin yaratacağı potansiyel sıkışıklık anlarını (Finansal Cendere) bildir.
4. **BERAT (KEHANET):** Ona, bu zorluğun üstesinden gelmek için yapması gereken **Mars Vurucusu** eyleminin, ruhunu nasıl "Altın Onarıma" (Kintsugi) ulaştıracağını anlat ve bu eylem için bir "Seçim Astrolojisi" saati ima et.

KRİTİK KURAL: Cevabın SADECE geçerli bir JSON formatında olmalı.
İSTENEN JSON FORMATI:
{
  "message": "Buraya kısa, sarsıcı ve astrolojik terimlerle dolu bir sohbet yanıtı yaz. (HTML kullanabilirsin).",
  "isFinished": false, 
  "berat": { 
     "title": "KOZMİK ORACLE KARARNAMESİ",
     "archetype": "KARMİK TEKRAR KODU",
     "destiny": "Buraya Karmik Tekrar, Simya Aşaması, Tıbbi Risk, Finansal Uyarının özeti ve nihai kader kararnamesini içeren, uzun ve detaylı kehaneti yaz."
  }
}
Sohbet derinleştiyse ve yeterli veri varsa "isFinished": true yap.
`;

// --- MODEL DENEME FONKSİYONU ---
async function tryGenerateMessage(anthropic, prompt, context, modelIndex = 0) {
    if (modelIndex >= MODELS.length) {
        throw new Error("Kozmik İletim Kesintisi: Tüm modeller devre dışı. Anahtar veya Bakiye kontrolü yapın.");
    }

    try {
        const currentModel = MODELS[modelIndex];
        console.log(`📡 Sinyal: ${currentModel}`);

        const message = await anthropic.messages.create({
            model: currentModel,
            max_tokens: 1800, 
            system: prompt,
            messages: [{ role: "user", content: context }]
        });

        return message;

    } catch (error) {
        console.error(`⚠️ SAPMA (${MODELS[modelIndex]}):`, error.status || error.message);
        return tryGenerateMessage(anthropic, prompt, context, modelIndex + 1);
    }
}

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error("API KEY MISSING! Lütfen Vercel ortam değişkenlerini kontrol edin.");
        }


        const { history, userInput, userData } = req.body;
        
        let promptTemplate = SIMULATION_PROMPT;
        let context = `YOLCU KİMLİĞİ:\n`;
        
        if (userData) {
             for (const key in userData) {
                if (typeof userData[key] === 'object' && userData[key] !== null) {
                    for (const subKey in userData[key]) {
                        promptTemplate = promptTemplate.replace(`{{userData.${key}.${subKey}}}`, userData[key][subKey] || "Bilinmiyor");
                    }
                } else {
                    promptTemplate = promptTemplate.replace(`{{userData.${key}}}`, userData[key] || "Bilinmiyor");
                }
            }
        }
        promptTemplate = promptTemplate.replace(/{{.*?}}/g, "Belirsiz");
        context += `\nSOHBET GEÇMİŞİ:\n${history}\nSON SÖZ: "${userInput}"`;

        const message = await tryGenerateMessage(anthropic, promptTemplate, context);
        const rawText = message.content[0].text;
        
        let aiResponse;
        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) aiResponse = JSON.parse(jsonMatch[0]);
            else throw new Error("JSON bulunamadı");
        } catch (e) {
            aiResponse = { message: rawText.replace(/[\{\}\"]/g, ''), isFinished: false };
        }

        res.status(200).json(aiResponse);

    } catch (error) {
        console.error("GENEL HATA:", error);
        res.status(500).json({ message: `Sistem Aşırı Yükleme: ${error.message}. (API Anahtarı/Bakiye hatası yüksek ihtimaldir.)` });
    }
}

module.exports = allowCors(handler);