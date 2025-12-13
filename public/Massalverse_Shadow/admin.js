// ŞİFRE BELİRLEME
const PASSWORD = "KAOS"; // Admin Şifresi

const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const input = document.getElementById('admin-pass');
const errorMsg = document.getElementById('error-msg');

// GİRİŞ KONTROLÜ
function checkAccess() {
    if (input.value.trim() === PASSWORD) {
        // Başarılı
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        startLogStream(); // Logları akıtmaya başla
    } else {
        // Hatalı
        errorMsg.classList.remove('hidden');
        input.value = "";
        input.focus();
        // Titreme efekti
        loginScreen.style.animation = "shake 0.5s";
        setTimeout(() => loginScreen.style.animation = "", 500);
    }
}

// Enter tuşu desteği
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") checkAccess();
});

// LOG SİMÜLATÖRÜ (Matrix gibi veri akışı)
const logs = [
    "ID: #9281 - Gölge ile yüzleşti. Sonuç: BAŞARISIZ.",
    "ID: #3321 - Tarot kartı seçildi: Kırık Kadeh.",
    "UYARI: Zodiac modülünde aşırı ısınma (Aslan Burcu).",
    "ID: #1102 - Berat verildi: YARALI ŞİFACI.",
    "SİSTEM: Pişmanlık virüsü karantinaya alındı.",
    "BAĞLANTI: Yeni yolcu girişi (İstanbul/TR).",
    "HATA: Duygusal bariyer aşılamadı.",
    "ID: #5591 - Sistemden çıkış yaptı."
];

const logStream = document.getElementById('log-stream');

function startLogStream() {
    setInterval(() => {
        // Rastgele bir log seç
        const randomLog = logs[Math.floor(Math.random() * logs.length)];
        
        // Zaman damgası
        const now = new Date();
        const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

        // HTML ekle
        const p = document.createElement('p');
        p.className = 'log-entry';
        p.innerHTML = `<span class="log-time">[${time}]</span> ${randomLog}`;
        
        // En üste ekle
        logStream.prepend(p);

        // Çok birikirse temizle
        if (logStream.children.length > 15) {
            logStream.lastChild.remove();
        }
    }, 1500); // Her 1.5 saniyede bir yeni veri
}