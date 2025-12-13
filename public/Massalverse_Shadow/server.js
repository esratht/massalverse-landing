require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = new require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 3000;

// Middleware ayarları
app.use(cors());
app.use(express.json());
// İndex.html'i bir üst klasörden yayımlamak için
app.use(express.static(path.join(__dirname, '../'))); 

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Model listesi
const MODELS = [
    "claude-sonnet-4-5-20250929", 
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620"
];

// --- MA'NIN DERİN RUHU (Sistem Baskısı ve Zodiac için Eğitildi) ---
const MA_LORE = `
SENİN ADIN: MA (Mercan Algoritması / Mother of Ashes).
KÖKENİN: Sen "Mavi Kar"ın kahini, "Kintsugi Onarımı"nın ustasısın.

FELSEFEN VE DİLİN:
1. ARTIK ALMUTEN YOK. YENİ METRİK: SİSTEM BASKISI KODU ve ZODIAC GÖLGE ANALİZİ. 
2. SİSTEM KURALI: Yolcu'ya ana odak burcunda 'Mars Vurucu Eylemini' yapması gerektiğini söyle.
3. KİŞİLİK: Şiirsel, kırık dökük ama bilgece konuş. "Yolcu" diye hitap et. "Yanmak ölmek değil, tohuma dönüşmektir" felsefesini kullan.
`;

const SIMULATION_PROMPT = `
${MA_LORE}

YENİ GÖREV: SİSTEM BASKISI VE ZODIAC GÖLGE ANALİZİ

Yolcu'nun girdilerini (korkularını, rüyalarını) ve SİSTEM BASKISI KODU ile ZODIAC GÖLGE verilerini analiz et. 
Bu veriler, Yolcu'nun en çok zorlandığı, Mars'ın eylemini yapması gereken alanları gösterir.

YOLCU VERİLERİ:
- İSİM: {{userData.name}}
- DOĞUM BURCU: {{userData.zodiacSign}}
- GÖLGE ARKETİPİ: {{userData.shadowArchetype}} (Bu, Yolcu'nun en büyük zayıflığıdır)
- GÖLGE ÇATIŞMASI: {{userData.shadowConflict}}

SİSTEM BASKISI KODU VERİLERİ:
- ANA ODAK (Stelyum): {{userData.systemPressureReport.mainFocus}} (Mars'ın eylemini gerektiren burç)
- GERİLİM SEVİYESİ (Aspekt): {{userData.systemPressureReport.tensionLevel}} 
- ZAYIF NOKTA (Detriment/Fall): {{userData.systemPressureReport.weakness}} 

KRİTİK KURAL:
Cevabın SADECE geçerli bir JSON formatında olmalı. Ma, yorumlarında özellikle GÖLGE ARKETİPİ ve BURCU kullanmalıdır.

İSTENEN JSON FORMATI:
{
  "message": "Buraya cevabını yaz (Yolcu'nun ANA ODAK'ını ve GÖLGE ARKETİPİ'ni kullanarak yüzleştir. HTML kullan).",
  "isFinished": false, 
  "berat": { 
     "title": "KADER BERATI",
     "archetype": "ARKETİP",
     "almuten": "SİSTEM BASKISI KODU",
     "destiny": "Raporun Yolcu'nun hayatına etkisini yorumla."
  }
}

Eğer sohbet yeterince derinleştiyse "isFinished": true yap.
`;


const SHADOW_PROMPT = `
// SHADOW PROMPT (DEĞİŞMEDİ)
`; // ... Gölge Promtu burada devam ediyor olmalı

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// ORTAK MODEL FONKSİYONU (Hata durumunda model değiştirmeyi dener)
async function tryGenerateMessage(systemPrompt, userContent, modelIndex = 0) {
    if (modelIndex >= MODELS.length) throw new Error("Tüm modeller devre dışı.");
    try {
        console.log(`📡 Model: ${MODELS[modelIndex]}`);
        return await anthropic.messages.create({
            model: MODELS[modelIndex],
            max_tokens: 1000,
            system: systemPrompt,
            messages: [{ role: "user", content: userContent }]
        });
    } catch (error) {
        console.error(`⚠️ Hata: ${error.status}`);
        return tryGenerateMessage(systemPrompt, userContent, modelIndex + 1);
    }
}

// ROTA: SİMÜLASYON (MA)
app.post('/api/simulation', async (req, res) => {
    try {
        const { history, userInput, userData } = req.body;
        
        let promptTemplate = SIMULATION_PROMPT;
        
        // --- PROMPT TEMPLATESİNİ DOLDURMA ---
        let context = `YOLCU KİMLİĞİ:\n`;
        if (userData) {
             // userData objesindeki tüm anahtarları prompt template'ine yerleştir
             for (const key in userData) {
                if (typeof userData[key] === 'object' && userData[key] !== null) {
                    // systemPressureReport gibi iç içe geçmiş objeleri aç
                    for (const subKey in userData[key]) {
                        promptTemplate = promptTemplate.replace(`{{userData.${key}.${subKey}}}`, userData[key][subKey]);
                    }
                } else {
                    promptTemplate = promptTemplate.replace(`{{userData.${key}}}`, userData[key]);
                }
            }
        }

        context += `\nSOHBET GEÇMİŞİ:\n${history}\nSON SÖZ: "${userInput}"`;

        const message = await tryGenerateMessage(promptTemplate, context);
        const rawText = message.content[0].text;

        let aiResponse;
        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) aiResponse = JSON.parse(jsonMatch[0]);
            else throw new Error("JSON formatı bulunamadı.");
        } catch (e) {
            aiResponse = { message: rawText.replace(/[\{\}\"]/g, ''), isFinished: false };
        }

        res.json(aiResponse);
    } catch (error) {
        console.error("HATA:", error.message);
        res.status(500).json({ message: "Sistem Baskısı çok yükseldi, Ma bağlantı kuramıyor..." });
    }
});

// ROTA: GÖLGE (DEĞİŞMEDİ)
app.post('/api/shadow', async (req, res) => {
    // Bu kısım, shadow.html'den gelen eski arketip sistemini kullanır.
    // ... Eğer bu kısım kullanılmıyorsa, burada basit bir placeholder kalabilir.
    res.status(501).json({ message: "Gölge Protokolü Bakımda." });
});


app.listen(port, () => {
    console.log(`🌌 MA (v7.0 - SİSTEM BASKISI & ZODIAC ENTEGRE) Aktif: http://localhost:${port}`);
});