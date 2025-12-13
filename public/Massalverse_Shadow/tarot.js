// --- GLITCH TAROT v4.0 ---

const DECK = [
    {
        id: 1, name: "SİNYAL YOK", image: "assets/no-signal.jpg",
        symbol: "📺", planet: "☉", error: "ERROR 404: WILLPOWER NOT FOUND",
        desc: "Dışarıdan kurtarıcı bekleme. Anteni kendin tamir etmedikçe ekran hep karlı kalacak.",
        costs: { courage: "+15", rep: "-5" }
    },
    {
        id: 2, name: "KABUK", image: "assets/shell.jpg",
        symbol: "⚱️", planet: "♄", error: "WARNING: STORAGE EMPTY",
        desc: "Vitrin mükemmel ama depo boş. Utanç, sistemin en büyük virüsüdür. Sil onu.",
        costs: { courage: "+10", rep: "-20" }
    },
    {
        id: 3, name: "LİMAN", image: "assets/port.jpg",
        symbol: "⚓", planet: "♆", error: "SYSTEM OVERLOAD: TOXIC LOYALTY",
        desc: "O koku kaderin değil, alışkanlığın. Vefa sandığın şey zehirli gazdır. Limanı terk et.",
        costs: { courage: "+25", rep: "-15" }
    },
    {
        id: 4, name: "KIRIK KADEH", image: "assets/broken-glass.jpg",
        symbol: "🍷", planet: "♂", error: "ERROR 500: EMOTIONAL SPILL",
        desc: "Kendini avutamamanın sebebi, başkasını beklemen. Kadeh kırıldı, yenisini yap.",
        costs: { courage: "+20", rep: "-5" }
    },
    {
        id: 5, name: "DÜŞÜŞ İZNİ", image: "assets/grounded-angel.jpg",
        symbol: "🪽", planet: "♅", error: "ERROR 403: FLIGHT DENIED",
        desc: "Kanadın kırık değil, yükün ağır. Safraları atmadan havalanamazsın.",
        costs: { courage: "+30", rep: "-10" }
    },
    {
        id: 6, name: "RÜYASIZLAR KULÜBÜ", image: "assets/dreamless-club.jpg",
        symbol: "🕶️", planet: "☿", error: "ERROR 401: VISION UNAUTHORIZED",
        desc: "Rüya görmüyorsan sadece veri işliyorsundur. Üyeliği iptal et.",
        costs: { courage: "+35", rep: "-30" }
    },
    {
        id: 7, name: "SIFIR NOKTASI", image: "assets/zero-point.jpg",
        symbol: "⚫", planet: "♇", error: "STATUS: WAITING FOR INPUT",
        desc: "Şu an sadece bir ihtimalsin. İmleç yanıp sönüyor. Yazgını gir.",
        costs: { courage: "∞", rep: "?" }
    }
];

// Desteyi Karıştır
const FULL_DECK = [...DECK, ...DECK].sort(() => Math.random() - 0.5);

const grid = document.getElementById('card-grid');
let hasSelected = false;

function initTarot() {
    grid.innerHTML = '';
    
    FULL_DECK.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('tarot-card');
        
        const bgStyle = card.image ? `background-image: url('${card.image}');` : '';
        const cardClass = card.image ? 'card-front has-image' : 'card-front';

        cardElement.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face ${cardClass}" style="${bgStyle}">
                <div class="planet-sign">${card.planet}</div>
                ${!card.image ? `<div class="card-symbol">${card.symbol}</div>` : ''}
                <div class="card-name-overlay">${card.name}</div>
            </div>
        `;

        cardElement.addEventListener('click', () => revealCard(cardElement, card));
        grid.appendChild(cardElement);
    });
}

function revealCard(element, cardData) {
    if (hasSelected) return;
    hasSelected = true;

    element.classList.add('flipped');

    // Diğerlerini soluklaştır
    document.querySelectorAll('.tarot-card').forEach(c => {
        if (c !== element) c.classList.add('disabled');
    });

    // Paneli aç
    setTimeout(() => showReading(cardData), 800);
}

function showReading(data) {
    const panel = document.getElementById('reading-panel');
    const visual = document.getElementById('card-visual');
    
    document.getElementById('card-title').innerHTML = `${data.name}<br><span style="font-size:0.6rem; color:#ff4444;">${data.error}</span>`;
    document.getElementById('card-desc').innerText = data.desc;
    document.getElementById('cost-courage').innerText = data.costs.courage;
    document.getElementById('cost-rep').innerText = data.costs.rep;

    if (data.image) {
        visual.innerHTML = `<img src="${data.image}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
        visual.innerHTML = `<span style="font-size:3rem;">${data.symbol}</span>`;
    }

    panel.classList.remove('hidden');
}

initTarot();