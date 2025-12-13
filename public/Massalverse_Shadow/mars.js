// ACIMASIZ MOD: SÖZLEŞME PARAMETRELERİ
const TOTAL_DAYS = 7; // Ardışık Eylem Gerekli Gün Sayısı
const CONTRACT_KEY = 'marsContractStatus';
const UNITS_PER_CONTRACT = 10; // Sözleşme tamamlandığında kazanılacak Eylem Birimi (Koin)

/**
 * Kullanıcı verilerini LocalStorage'dan çeker. Yoksa yeni sözleşme başlatır.
 * @returns {object} Sözleşme durumu
 */
function getContractStatus() {
    const stored = localStorage.getItem(CONTRACT_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    
    // YENİ SÖZLEŞME BAŞLATMA
    return {
        currentDay: 0, // Gün 0'dan başla, ilk eylem 1. gün olur
        lastActionDate: null, // Son eylem tarihi (YYYY-MM-DD formatında saklanacak)
        totalUnits: 0, // Kazanılan toplam Eylem Birimi
        contractActive: true // Sözleşme aktif mi?
    };
}

/**
 * Sözleşme durumunu kaydeder.
 * @param {object} status Güncel sözleşme durumu
 */
function saveContractStatus(status) {
    localStorage.setItem(CONTRACT_KEY, JSON.stringify(status));
}

/**
 * Sözleşme İHLALİ durumunda sayaçları sıfırlar.
 * @param {object} status Güncel sözleşme durumu
 * @returns {object} Sıfırlanmış durum objesi
 */
function resetContract(status) {
    status.currentDay = 0;
    status.lastActionDate = null;
    status.contractActive = true;
    saveContractStatus(status);
    return {
        message: "İHLAL TESPİT EDİLDİ: Eylemsizlik nedeniyle Mars Vurucu Sözleşmesi sıfırlandı. Tekrar Başla.",
        status: 'reset',
        units: status.totalUnits
    };
}

/**
 * Bugünün eyleminin yapılıp yapılmadığını kontrol eder ve sözleşmeyi ilerletir.
 */
function performMarsAction() {
    let status = getContractStatus();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (!status.contractActive && status.currentDay >= TOTAL_DAYS) {
        // Sözleşme zaten bitti. Yeni sözleşme teklif edilmeli.
        return {
            message: `SÖZLEŞME TAMAMLANDI. Toplam Eylem Birimi: ${status.totalUnits}.`,
            status: 'complete',
            units: status.totalUnits
        };
    }

    // 1. GÜN KONTROLÜ: BUGÜN ZATEN YAPILDI MI?
    if (status.lastActionDate === today) {
        return { 
            message: `HATA: ${status.currentDay}. Gün eylemi bugün zaten kaydedildi.`, 
            status: 'error',
            units: status.totalUnits
        };
    }

    // 2. İHLAL KONTROLÜ: ARDIŞIK GELİNMEDİYSE SIFIRLA
    if (status.lastActionDate !== null && status.currentDay > 0) {
        const lastDate = new Date(status.lastActionDate);
        const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Gün farkı

        if (diffDays > 1) {
            // İki günden fazla süre geçtiyse (ardışık değilse)
            return resetContract(status);
        }
    }

    // 3. EYLEM KAYDI VE İLERLEME
    status.currentDay++;
    status.lastActionDate = today;
    
    // SÖZLEŞME BAŞARISI
    if (status.currentDay >= TOTAL_DAYS) {
        status.totalUnits += UNITS_PER_CONTRACT; // Koin ekle
        status.contractActive = false; // Sözleşmeyi kapat
        saveContractStatus(status);

        return { 
            message: `SÖZLEŞME TAMAMLANDI! ${UNITS_PER_CONTRACT} Eylem Birimi kazanıldı.`, 
            status: 'success',
            units: status.totalUnits
        };
    } else {
        // Normal ilerleme
        saveContractStatus(status);
        return { 
            message: `${status.currentDay}. Gün eylemi kaydedildi. Kalan: ${TOTAL_DAYS - status.currentDay} gün.`, 
            status: 'success',
            units: status.totalUnits
        };
    }
}

// ÖRNEK KULLANIM (Bu kısmı index.html'deki butona bağlayacaksın):
// function handleActionClick() {
//     const result = performMarsAction();
//     alert(result.message + " | Toplam Koin: " + result.units);
//     if (result.status === 'reset') {
//         // İhlal durumunda kullanıcıya ceza mesajı göster.
//     }
// }