// DURUM YÖNETİMİ
let step = 0; // 0: Tereddüt, 1: Form, 2: Chat, 3: Sonuç
let conversationHistory = "";
let userData = {};

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const birthModal = document.getElementById('birth-modal');
const beratModal = document.getElementById('berat-modal');

// --- ZODIAC GÖLGE VERİ TABANI ---
const ZODIAC_DATA = {
    "KOÇ": { shadow: "ACEMİ SAVAŞÇI", focus: "Sabırsızlık", conflict: "İradenin körü körüne kullanımı." },
    "BOĞA": { shadow: "KİLİTLİ DEĞER", focus: "Değişime mutlak direnç", conflict: "Rahatlık uğruna potansiyeli feda etme." },
    "İKİZLER": { shadow: "YANKI ODASI", focus: "Yüzeysellik", conflict: "Duygu yerine mantığı silah olarak kullanma." },
    "YENGEÇ": { shadow: "KABUKLU BAĞIMLI", focus: "Korkuyla geri çekilme", conflict: "Koruma ihtiyacını manipülasyona çevirme." },
    "ASLAN": { shadow: "SAHTE TAÇ", focus: "Onaylanma bağımlılığı", conflict: "Sevgiden çok alkışa ihtiyaç duyma." },
    "BAŞAK": { shadow: "KUSUR BULUCU", focus: "Aşırı eleştiri", conflict: "Hizmeti, hizmetkârlığa dönüştürme." },
    "TERAZİ": { shadow: "ADALET KAÇAĞI", focus: "Kararsızlık", conflict: "Yüzleşmekten kaçınma." },
    "AKREP": { shadow: "KÜL ALANI", focus: "Kontrol saplantısı", conflict: "Dönüşümü, yıkım için kullanma." },
    "YAY": { shadow: "BİLGE GEZGİN", focus: "Fanatizm, ukalalık", conflict: "Gerçeklerden kaçmak için felsefeye sığınma." },
    "OĞLAK": { shadow: "BETON BABALIK", focus: "Duygusuzluk", conflict: "Kariyeri, insanlığa tercih etme." },
    "KOVA": { shadow: "SOĞUK DAHİ", focus: "Duygusal kopukluk", conflict: "Bireyselliği yalnızlığa çevirme." },
    "BALIK": { shadow: "AKINTIYA KAPILAN", focus: "Mağduriyet", conflict: "Kırılganlığı güçsüzlük sanma." }
};

// --- YARDIMCI ZODIAC FONKSİYONLARI (Aynı) ---
function getZodiacSign(month, day) {
    if (month == 1 && day <= 20 || month == 12 && day >= 22) return "OĞLAK";
    if (month == 1 && day >= 21 || month == 2 && day <= 19) return "KOVA";
    if (month == 2 && day >= 20 || month == 3 && day <= 20) return "BALIK";
    if (month == 3 && day >= 21 || month == 4 && day <= 20) return "KOÇ";
    if (month == 4 && day >= 21 || month == 5 && day <= 21) return "BOĞA";
    if (month == 5 && day >= 22 || month == 6 && day <= 21) return "İKİZLER";
    if (month == 6 && day >= 22 || month == 7 && day <= 22) return "YENGEÇ";
    if (month == 7 && day >= 23 || month == 8 && day <= 23) return "ASLAN";
    if (month == 8 && day >= 24 || month == 9 && day <= 23) return "BAŞAK";
    if (month == 9 && day >= 24 || month == 10 && day <= 23) return "TERAZİ";
    if (month == 10 && day >= 24 || month == 11 && day <= 22) return "AKREP";
    if (month == 11 && day >= 23 || month == 12 && day <= 21) return "YAY";
    return "BİLİNMEYEN";
}

function getZodiacShadowReport(sign) {
    const data = ZODIAC_DATA[sign];
    if (!data) return { shadowArchetype: "SİNYAL YOK", shadowConflict: "Bilinmiyor" };

    return {
        shadowArchetype: data.shadow,
        shadowConflict: data.conflict
    };
}
// --- ZODIAC FONKSİYON SONU ---


// --- DÜZELTİLMİŞ YENİ METRİK: SİSTEM BASKISI KODU ---
function calculateSystemPressure(name, date, time) {
    
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hour = parseInt(time.split(':')[0]);
    
    // Güneş ve Ay haricindeki gezegenler + Malefikler (Karmik zorlama yaratanlar)
    const MALEFIC_PLANETS = ["MARS", "SATÜRN", "PLÜTO", "URANÜS", "NEPTÜN", "MERKÜR", "VENÜS", "JÜPİTER"]; 
    let report = {};

    // A. STELYUM SENSÖRÜ (ANA ODAK)
    report.mainFocus = getZodiacSign(month, day);
    
    // B. ASPEKT GERİLİMİ (KRİZ)
    const tensionBase = Math.abs(day - month);
    const totalTension = Math.round(tensionBase * (hour / 24) * 10) + Math.floor(Math.random() * 5 + 3); 
    report.tensionLevel = totalTension;
    
    // C. ZARAR VURUCU GÜÇ (KARMA/ZAYIFLIK)
    // Güneş ve Ay hariç, en az 1 gezegen seçiliyor.
    const weaknessCount = Math.floor(Math.random() * 2) + 1; // 1 veya 2 gezegen seç
    
    let weakPlanets = [];
    while (weakPlanets.length < weaknessCount) {
        const randomPlanetIndex = Math.floor(Math.random() * MALEFIC_PLANETS.length);
        const weakPlanet = MALEFIC_PLANETS[randomPlanetIndex];
        
        if (!weakPlanets.includes(weakPlanet)) {
            // Retrograd simülasyonu için %50 ihtimalle R ekle
            const retroStatus = Math.random() > 0.5 && (weakPlanet !== "GÜNEŞ" && weakPlanet !== "AY") ? " (R)" : "";
            weakPlanets.push(weakPlanet + retroStatus);
        }
    }
    
    if (weakPlanets.length === 0) {
        weakPlanets.push("BİLİNÇDIŞI KARMA");
    }

    report.weakness = weakPlanets.join(", ");
    
    return report;
}
// --- SİSTEM BASKISI FONKSİYON SONU ---


// MESAJ GÖNDERME
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = "";
    conversationHistory += `Yolcu: ${text}\n`;

    if (step === 0) {
        showTyping();
        setTimeout(() => {
            addMessage("Anlaşıldı. Bu yükü taşıyabilmen için önce kim olduğunu hatırlamalıyız.", 'ai');
            setTimeout(() => {
                birthModal.classList.remove('hidden');
            }, 800);
        }, 1000);
        step = 1;
        return;
    }

    showTyping();
    
    try {
        // Vercel Uyumu: '/api/simulation' kullanılır
        const response = await fetch('/api/simulation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: conversationHistory,
                userInput: text,
                userData: userData 
            })
        });

        if (!response.ok) {
            throw new Error(`Sunucu Hatası: ${response.status}`);
        }

        const data = await response.json();
        
        addMessage(data.message, 'ai');
        conversationHistory += `Ma: ${data.message}\n`;

        if (data.isFinished && data.berat) {
            setTimeout(() => {
                showBerat(data.berat);
            }, 2000);
        }

    } catch (error) {
        removeTyping();
        console.error("MA BAĞLANTI HATASI:", error);
        addMessage("⚠️ Bağlantı Koptu. (API yanıt vermiyor. Lütfen 'api/simulation.js' dosyasının varlığını ve Vercel API Key ayarlarını kontrol et.)", 'ai');
    }
}

// --- DOĞUM FORMUNU İŞLEME VE YENİ METRİKLERİ HESAPLAMA ---
document.getElementById('birth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('b-name').value;
    const dateStr = document.getElementById('b-date').value;
    const time = document.getElementById('b-time').value; 
    const city = document.getElementById('b-city').value;
    
    const dateObj = new Date(dateStr);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    // 1. SİSTEM BASKISI KODU HESAPLAMA
    const systemPressure = calculateSystemPressure(name, dateStr, time, city);
    
    // 2. ZODIAC GÖLGE ANALİZİ
    const zodiacSign = getZodiacSign(month, day);
    const zodiacShadow = getZodiacShadowReport(zodiacSign);

    // TÜM VERİLERİ TOPLA
    userData = {
        name: name,
        date: dateStr,
        time: time,
        city: city,
        
        // YENİ METRİKLER (Ma'nın Promp'una gidecek)
        zodiacSign: zodiacSign,
        shadowArchetype: zodiacShadow.shadowArchetype,
        shadowConflict: zodiacShadow.shadowConflict,
        systemPressureReport: systemPressure 
    };

    birthModal.classList.add('hidden');
    step = 2; // Chat moduna geç
    
    showTyping();
    setTimeout(() => {
        addMessage(`Veri işlendi. Yolcu: ${name}. Zodiac Kodu: ${zodiacSign}. Gölge Kodun: ${zodiacShadow.shadowArchetype}.`, 'ai');
        addMessage("Harika. Beyninde en çok zorlanma yaşanan alanı biliyorum. Şimdi Jungyen teste başlıyoruz. Bana rüyalarından veya en büyük utancından bahset. Unutma, 'utanç sistemin en büyük virüsüdür.'", 'ai');
    }, 1000);
});

// --- AVATAR VE MESAJ FONKSİYONLARI ---
function showTyping() {
    let typingElement = document.getElementById('typing-indicator');
    
    if (!typingElement) {
        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.classList.add('message', 'ai-msg');
        
        div.innerHTML = `
            <div id="response-animation" style="display:block;"></div>
            <p style="margin: 0;">Ma düşünüyor...</p>
        `;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        typingElement = div;
    }
    
    const animationElement = document.getElementById('response-animation');
    if (animationElement) animationElement.style.display = 'block'; 
}

function removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
}

function addMessage(text, sender) {
    if (sender === 'ai') {
        removeTyping();
    }
    
    const div = document.createElement('div');
    div.classList.add('message', sender === 'ai' ? 'ai-msg' : 'user-msg');
    div.innerHTML = `<p>${text}</p>`; 
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// BERAT RAPORU (Tüm Metrikler Entegre Edildi)
function showBerat(beratData) {
    document.getElementById('berat-title').innerText = beratData.title || "KADER BERATI";
    document.getElementById('res-name').innerText = userData.name;
    document.getElementById('res-archetype').innerText = beratData.archetype;
    document.getElementById('res-almuten').innerText = `${userData.zodiacSign} (${userData.shadowArchetype})`; 
    document.getElementById('res-destiny').innerText = beratData.destiny;
    
    // SİSTEM BASKISI KODLARI
    if (document.getElementById('res-focus')) {
        document.getElementById('res-focus').innerText = userData.systemPressureReport.mainFocus;
    }
    if (document.getElementById('res-tension')) {
        document.getElementById('res-tension').innerText = userData.systemPressureReport.tensionLevel;
    }
    if (document.getElementById('res-weakness')) {
        document.getElementById('res-weakness').innerText = userData.systemPressureReport.weakness;
    }
    
    document.getElementById('doc-id').innerText = Math.floor(Math.random() * 99999);

    beratModal.classList.remove('hidden');
}

// Enter tuşu ile gönder
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") sendMessage();
});