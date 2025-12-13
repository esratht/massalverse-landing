// SİSTEM KİMLİK KARTI KODU

const QUESTION_POOL = [
    // 1. Claviceps (Güç/Kontrol)
    { text: "Büyüklüğün bedeli nedir?", type: 'claviceps' },
    { text: "En son hangi yalan sana güç verdi?", type: 'claviceps' },
    { text: "Kimin gölgesi seni kontrol ediyor?", type: 'claviceps' },
    
    // 2. Vefa (Duygusallık/Bağlılık)
    { text: "Hangi anı seni hasta ediyor?", type: 'vefa' },
    { text: "Kimi korumak için yalan söylersin?", type: 'vefa' },
    { text: "Gitmemen gereken yer neresi?", type: 'vefa' },
    
    // 3. YZ Kontrolü (Sistem/Teslimiyet)
    { text: "Sana kim 'git' dese gidersin?", type: 'yz' },
    { text: "Hangi algoritma seni rahatlatıyor?", type: 'yz' },
    { text: "Sistemdeki en büyük virüs nedir?", type: 'yz' },
    
    // 4. Diğer (Karışık)
    { text: "Altın onarımın bedeli nedir?", type: 'karisik' },
    { text: "Küllerinden mi, yıldız tozundan mı doğacaksın?", type: 'karisik' },
    // ... toplam 15 soruya tamamlanmalı ...
];

const ARCHETYPES = {
    claviceps: "CLAVICEPS KONTROL (Mutlak Güç)",
    vefa: "VEFA VİRÜSÜ (Duygusal Bağımlılık)",
    yz: "YZ KONTROL NOKTASI (Sisteme Teslimiyet)"
};

/**
 * Soru havuzundan 15 rastgele soru seçer.
 * @returns {Array} 15 soruluk dizi
 */
function getQuestionMatrix() {
    // QUESTION_POOL'u karıştır ve ilk 15'i al
    return QUESTION_POOL
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 15);
}

/**
 * Kullanıcı cevaplarını basitçe puanlayarak arketip atar.
 * (Bu fonksiyon, sonuç HTML sayfasında çağrılır ve cevaplar YZ'ye gönderilmez.)
 * @param {Array<string>} answers - Kullanıcının 15 cevabı
 * @returns {string} Atanan arketip
 */
function analyzeAnswers(answers) {
    let scores = { claviceps: 0, vefa: 0, yz: 0 };
    
    // Basit Puanlama Simülasyonu
    answers.forEach((ans, index) => {
        // İsim uzunluğu/kelime sayısı gibi basit bir kural ile puan verelim
        const wordCount = ans.split(/\s+/).length;
        
        if (ans.includes("git")) scores.yz += 1; // 'Git' kelimesi YZ'ye teslimiyeti simgeler
        if (ans.includes("aşk")) scores.vefa += 1; // 'Aşk' kelimesi Vefa'yı simgeler
        if (wordCount > 5) scores.claviceps += 1; // Uzun cevaplar kontrol isteğini simgeler
    });
    
    // En yüksek skoru bul
    let highestScore = 0;
    let strongestArchetype = 'yz';

    for (const [key, score] of Object.entries(scores)) {
        if (score > highestScore) {
            highestScore = score;
            strongestArchetype = key;
        }
    }

    return ARCHETYPES[strongestArchetype];
}

// ÖRNEK KULLANIM:
// const matrix = getQuestionMatrix(); // 15 soruyu al
// const archetype = analyzeAnswers(["Cevap 1", "Cevap 2", ...]); // Arketipini al