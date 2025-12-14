"use client";

import Link from 'next/link';
import { useState } from 'react';

const tarotCards = [
  { name: "GLITCH FOOL", meaning: "Yeni başlangıçlar, beklenmedik yollar, sistemden çıkış", icon: "🃏" },
  { name: "CORRUPTED MAGICIAN", meaning: "Gizli yetenekler, manipüle edilmiş gerçeklik, güç", icon: "🎭" },
  { name: "SHADOW PRIESTESS", meaning: "Bilinçaltı mesajlar, gizli bilgi, iç ses", icon: "🌙" },
  { name: "VIRUS EMPRESS", meaning: "Yaratıcılık, bereket, yayılan etki", icon: "👑" },
  { name: "FIREWALL EMPEROR", meaning: "Otorite, yapı, koruma mekanizmaları", icon: "🛡️" },
  { name: "BROKEN HIEROPHANT", meaning: "Sorgulanması gereken inançlar, eski sistemler", icon: "⚡" },
  { name: "ERROR LOVERS", meaning: "Seçimler, bağlantı hataları, ikili ilişkiler", icon: "💔" },
  { name: "RUNAWAY CHARIOT", meaning: "Kontrol kaybı, hızlı ilerleme, yön arayışı", icon: "🏎️" },
  { name: "DEBUGGING STRENGTH", meaning: "İç güç, hataları kabul, sabır", icon: "🔧" },
  { name: "ISOLATED HERMIT", meaning: "İçe dönüş, yalnızlık, arayış", icon: "🏔️" },
  { name: "LOADING WHEEL", meaning: "Döngüler, kader, beklenmedik değişimler", icon: "🎡" },
  { name: "JUSTICE.EXE", meaning: "Denge, sonuçlar, sistem dengesi", icon: "⚖️" },
  { name: "HANGED PROCESS", meaning: "Askıya alınmış kararlar, farklı bakış açısı", icon: "🔄" },
  { name: "DEATH REBOOT", meaning: "Dönüşüm, sonlanış, yeniden başlatma", icon: "💀" },
  { name: "TEMP ANGEL", meaning: "Denge, ılımlılık, geçici çözümler", icon: "👼" },
  { name: "DAEMON DEVIL", meaning: "Bağımlılıklar, gölge, arka plan süreçleri", icon: "😈" },
  { name: "CRASHED TOWER", meaning: "Ani yıkım, sistem çöküşü, özgürleşme", icon: "🗼" },
  { name: "STAR.LOG", meaning: "Umut, ilham, yol gösterici işaretler", icon: "⭐" },
  { name: "MOON BUG", meaning: "Yanılsamalar, korku, görünmeyen hatalar", icon: "🌑" },
  { name: "SUN PATCH", meaning: "Başarı, aydınlanma, düzeltilmiş hatalar", icon: "☀️" },
  { name: "JUDGEMENT DAY", meaning: "Uyanış, değerlendirme, son karar", icon: "📯" },
  { name: "WORLD COMPLETE", meaning: "Tamamlanma, döngü sonu, bütünlük", icon: "🌍" },
];

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState<typeof tarotCards>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawCards = () => {
    setIsDrawing(true);
    setIsRevealed(false);
    
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
      setSelectedCards(shuffled.slice(0, 3));
      setIsDrawing(false);
      
      setTimeout(() => setIsRevealed(true), 500);
    }, 2000);
  };

  const reset = () => {
    setSelectedCards([]);
    setIsRevealed(false);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['Orbitron'] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-cyan-400 transition">
            ← ANA SUNUCU
          </Link>
          <span className="text-[10px] text-green-500 animate-pulse">● SHUFFLING</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🃏</div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-600 mb-4">
            GLITCH TAROT
          </h1>
          <p className="text-green-600 text-sm tracking-[0.3em]">SİSTEM HATALARI</p>
        </div>

        {selectedCards.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-500 font-['Fira_Code'] mb-8 max-w-md mx-auto">
              Simülasyonun kartları senin için karıştırıldı. 
              3 kart çekerek sistemdeki glitch'leri oku.
            </p>
            
            <button 
              onClick={drawCards}
              disabled={isDrawing}
              className="border-2 border-green-500 text-green-400 px-12 py-6 hover:bg-green-500 hover:text-black transition font-bold tracking-widest text-lg disabled:opacity-50"
            >
              {isDrawing ? "KARISTIRILIYOR..." : "[ KART ÇEK ]"}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {selectedCards.map((card, index) => (
                <div 
                  key={index}
                  className={`border-2 border-green-500/50 bg-green-950/20 p-6 text-center transition-all duration-500 ${
                    isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <p className="text-[10px] text-gray-600 mb-2">
                    {index === 0 ? "GEÇMİŞ" : index === 1 ? "ŞİMDİ" : "GELECEK"}
                  </p>
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <h3 className="text-green-400 font-bold mb-3">{card.name}</h3>
                  <p className="text-gray-400 font-['Fira_Code'] text-xs leading-relaxed">
                    {card.meaning}
                  </p>
                </div>
              ))}
            </div>

            {/* Interpretation */}
            {isRevealed && (
              <div className="border border-cyan-500/50 bg-cyan-950/20 p-6 animate-in fade-in duration-500">
                <h3 className="text-cyan-400 font-bold mb-4 text-center">[ SİSTEM YORUMU ]</h3>
                <p className="text-gray-300 font-['Fira_Code'] text-sm text-center leading-relaxed">
                  Geçmişindeki <span className="text-green-400">{selectedCards[0]?.name}</span> enerjisi, 
                  şu an <span className="text-green-400">{selectedCards[1]?.name}</span> ile yüzleşmeni sağlıyor. 
                  Gelecekte <span className="text-green-400">{selectedCards[2]?.name}</span> seni bekliyor. 
                  Simülasyon bu glitch'leri senin için işaretledi.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={reset}
                className="border border-gray-600 text-gray-400 px-8 py-3 hover:border-gray-400 transition"
              >
                YENİDEN ÇEK
              </button>
              <Link 
                href="/rpg"
                className="border border-pink-500 text-pink-400 px-8 py-3 hover:bg-pink-500 hover:text-black transition"
              >
                SİMÜLASYONA GİT
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
