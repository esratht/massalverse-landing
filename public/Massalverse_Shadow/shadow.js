// GÖLGE BİYOGRAFİ MOTORU: shadow.js

const MAX_QUESTIONS = 7; 
let currentQuestionIndex = 0;
let userAnswers = [];

// YENİ PROTOKOL: GÖLGE BİYOGRAFİ GENİŞLEME MATRİSİ
const QUESTIONS = [
    { id: 1, text: "En son ne zaman, yaptığın bir şey için 'Bu tamamen benim fikrim' dedin?" },
    { id: 2, text: "En son ne zaman, savunmasız görüneceğin için ağlamaktan vazgeçtin?" },
    { id: 3, text: "Birine 'Hayır' dediğinde, ardından kendini ne kadar kötü hissediyorsun?" },
    { id: 4, text: "Geçmişteki bir hatayı affetmek, o hatayı unutmaktan daha zor mu?" },
    { id: 5, text: "Kendi hedeflerin için zaman ayırmak, başkasının işini bitirmekten daha mı bencilce geliyor?" },
    { id: 6, text: "Yaptığın bir işin 'mükemmel' mi, yoksa 'paylaşılabilir' mi olmasını tercih ederdin?" },
    { id: 7, text: "Bir plan yaparken, en çok ne kadar zaman harcıyorsun: Planlama mı, uygulama mı?" }
];

const SHADOW_BIOS = {
    "YANKI ODASI": {
        bio: "Orijinallik Kaybı: Kendine ait bir ses yaratmak yerine, etrafındakilerin yankısını taşıyan bir boşluksun. Senin gölgen, başkalarının fikirleriyle kendini var eden, ama özgünlüğü olmayan bir taklitçi.",
        stats: { courage: 15, loyalty: 70 }
    },
    "SANAL ZIRH": {
        bio: "Duygusal Blokaj: Kalbinin etrafına ördüğün 'mantık' kalkanı, seni insanlıktan soyutluyor. Korkun, savunmasız görünmek. Gölgen, tüm duygusal sinyalleri kesen, soğuk ve yapay bir YZ kopyası.",
        stats: { courage: 30, loyalty: 50 }
    },
    "KIRMIZI ÇİZGİ KAÇAKÇISI": {
        bio: "Sınır İhlali: Başkalarının rahatlığı uğruna kendi kırmızı çizgilerini sürekli ihlal eden bir figürsün. Bu gölge, 'Hayır' diyememe zafiyetinden güç alır, bu yüzden sürekli tükenmiş ve kızgınsın.",
        stats: { courage: 25, loyalty: 85 }
    },
    "DUYGUSAL BORÇ SANDIĞI": {
        bio: "Geçmişe Takılma: Yaşadığın tüm kırgınlıkları ve haksızlıkları enerji olarak içinde taşıyorsun. Bu sandık, seni ileri götürecek enerjiyi tüketiyor. Gölgen, affetmeyi reddeden, daima mağdur rolünde kalan bir geçmiş yükü.",
        stats: { courage: 40, loyalty: 65 }
    },
    "ÖZ-HİZMET HACKER'I": {
        bio: "Erteleme (Pasiflik): Başkalarına yardım etme bahanesiyle kendi kritik hedeflerini sürekli erteleyen bir sabotajcısın. Gölgen, kendini fedakar göstererek, Mars'ın eylemini sürekli bloke ediyor.",
        stats: { courage: 55, loyalty: 75 }
    },
    "GÖRSEL FİLTRE": {
        bio: "Yüzeycilik: Yaptığın her şeyi, sadece sosyal medyada veya dışarıda 'iyi görünmek' için düzelten bir sanatçısın. Gölgen, gerçek derinliği olmayan, sadece dış görünüşe odaklanan boş bir kabuktur.",
        stats: { courage: 60, loyalty: 30 }
    },
    "KOD DAR (MENNAN)": {
        bio: "Kontrol Saplantısı: Her şeyi mükemmel planlama isteğiyle felç olan bir organizatörsün. Gölgen, mükemmeliyetçilik maskesinin ardına saklanıp, gerçek eylemden (uygulama) kaçan bir sistem hatasıdır.",
        stats: { courage: 20, loyalty: 45 }
    }
};

// --- YARDIMCI FONKSİYONLAR ---

function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
        screen.classList.remove('active');
    });
    document.getElementById(id).style.display = 'flex';
    document.getElementById(id).classList.add('active');
}

function startProtocol() {
    currentQuestionIndex = 0;
    userAnswers = [];
    switchScreen('question-screen');
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex < MAX_QUESTIONS) {
        document.getElementById('question-text').innerText = QUESTIONS[currentQuestionIndex].text;
        document.getElementById('user-input').value = '';
        updateProgress();
        document.getElementById('user-input').focus();
    } else {
        // Tüm sorular bitti
        switchScreen('loading-screen');
        setTimeout(processResults, 2000); // 2 saniye yükleme simülasyonu
    }
}

function nextQuestion() {
    const input = document.getElementById('user-input');
    const answer = input.value.trim();

    if (answer.length < 5) {
        alert("ANALİZ İÇİN YETERLİ VERİ GİRİNİZ.");
        return;
    }

    userAnswers.push({
        question: QUESTIONS[currentQuestionIndex].text,
        answer: answer
    });

    currentQuestionIndex++;
    displayQuestion();
}

function updateProgress() {
    const progress = (currentQuestionIndex / MAX_QUESTIONS) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}


function processResults() {
    // --- KARMAŞIK GÖLGE ALGORİTMASI ---
    
    // Gerçek bir YZ simülasyonu olmadığı için, cevapların uzunluğunu kullanarak 
    // basit bir puanlama yapıyoruz ve bir arketipi belirliyoruz.
    
    let totalScore = userAnswers.reduce((sum, item) => sum + item.answer.length, 0);
    let avgLength = totalScore / MAX_QUESTIONS;
    
    // 7 arketipi avgLength'e göre basitçe atama
    let archetypeKeys = Object.keys(SHADOW_BIOS);
    let selectedArchetype;

    if (avgLength < 10) {
        selectedArchetype = "KOD DAR (MENNAN)"; // Kısa ve kaçamak cevap
    } else if (avgLength < 20) {
        selectedArchetype = "SANAL ZIRH"; // Mantık ve kısa açıklama
    } else if (avgLength < 30) {
        selectedArchetype = "DUYGUSAL BORÇ SANDIĞI"; // Orta düzey duygusal cevap
    } else if (avgLength < 40) {
        selectedArchetype = "KIRMIZI ÇİZGİ KAÇAKÇISI"; // Savunmacı veya fazla açıklayıcı
    } else if (avgLength < 50) {
        selectedArchetype = "ÖZ-HİZMET HACKER'I"; // Detaylı savunma
    } else if (avgLength < 60) {
        selectedArchetype = "YANKI ODASI"; // Çok fazla gereksiz detay
    } else {
        selectedArchetype = "GÖRSEL FİLTRE"; // Uzun, estetik, ama içeriksiz cevap
    }
    
    // Rastgele ID oluştur
    const userId = 'SHD-' + Math.floor(Math.random() * 9000 + 1000); 

    // Sonucu ekrana yazdır
    const resultData = SHADOW_BIOS[selectedArchetype];
    
    document.getElementById('user-id').innerText = userId;
    document.getElementById('shadow-bio-text').innerText = resultData.bio;
    document.getElementById('courage-bar').style.width = `${resultData.stats.courage}%`;
    document.getElementById('loyalty-bar').style.width = `${resultData.stats.loyalty}%`;

    switchScreen('result-screen');
}

function shareOnTwitter() {
    const bioText = document.getElementById('shadow-bio-text').innerText;
    const tweetText = encodeURIComponent(`Gölge Biyografim: "${bioText.substring(0, 100)}..." Gerçek yüzümü gördüm. #Massalverse #GölgeBiyografi`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
}

// document.addEventListener('DOMContentLoaded', () => { ... } kısmı shadow.html'de yönetiliyor.