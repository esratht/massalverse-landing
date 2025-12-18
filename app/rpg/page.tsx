"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type GameTurn = {
  role: 'user' | 'assistant';
  content: string; 
  options?: string[]; 
};

export default function RpgPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', sign: '', regret: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
   
  const [gameHistory, setGameHistory] = useState<GameTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- GÜÇLENDİRİLMİŞ AVATAR DİNLEYİCİSİ ---
  useEffect(() => {
    const receiveMessage = (event: any) => {
        // Güvenlik: Sadece Ready Player Me'den gelenleri dinle
        // Bazen string gelir, bazen obje. Garantiye alalım:
        let data = event.data;
        try {
            if (typeof data === 'string') data = JSON.parse(data);
        } catch (e) {
            // JSON değilse boşver
        }

        const source = data?.source;
        
        if (source === 'readyplayerme') {
            // Avatar Export edildiğinde
            if (data.eventName === 'v1.avatar.exported') {
                console.log("OTONOM GEÇİŞ TETİKLENDİ:", data.data.url);
                setAvatarUrl(data.data.url);
                triggerGameStart(data.data.url); // Oyunu başlat
            }
        }
    };

    if (step === 2) {
        window.addEventListener('message', receiveMessage);
    }

    return () => {
        window.removeEventListener('message', receiveMessage);
    };
  }, [step]);

  // Oyunu başlatan yardımcı fonksiyon
  const triggerGameStart = (url: string) => {
      setAvatarUrl(url); // URL'i kaydet
      setStep(3); // Adım atla
      // State güncellenmesi asenkron olduğu için gecikmeli başlatıyoruz
      setTimeout(() => {
          startGame(url); 
      }, 100);
  };

  // OTOMATİK SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameHistory.length, loading]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // OYUN MOTORU
  const startGame = async (currentAvatarUrl?: string) => {
    setLoading(true);
    // Simülasyon: Chatbot Analizi Başlıyor
    setTimeout(() => {
        setGameHistory([{ 
            role: 'assistant', 
            content: `Sisteme hoş geldin ${formData.name}. Görüyorum ki ${formData.sign} burcunun yıldız haritasındaki o karanlık noktadasın.\n\n"${formData.regret}" diyorsun...\n\nAvatarın (${currentAvatarUrl ? 'Yüklendi' : 'Gizli'}) ve verilerin analiz edildi. Bu pişmanlık, sistemde bir 'Bug' değil, bir 'Feature' (Özellik) olarak görünüyor. Şimdi seçim senin:`, 
            options: ["Eskiye dön ve savaş (Mars)", "Her şeyi yak ve git (Plüton)"]
        }]);
        setLoading(false);
    }, 2000);
  };

  const makeChoice = async (choice: string) => {
    const newHistory = [...gameHistory, { role: 'user', content: choice } as GameTurn];
    setGameHistory(newHistory);
    setLoading(true);

    setTimeout(() => {
        setGameHistory(prev => [...prev, { 
            role: 'assistant', 
            content: `"${choice}"... İlginç. Bu seçim, bilinçaltındaki KAD Yengeç döngüsünü tetikledi. Massalverse'de pişmanlık yoktur, sadece versiyon güncellemeleri vardır. Devam ediyoruz.`, 
            options: ["Sistemi Hackle", "Teslim Ol", "Baştan Başla"] 
        }]);
        setLoading(false);
    }, 1500);
  };

  const resetGame = () => {
     if (confirm("Simülasyonu sonlandırmak istediğine emin misin?")) {
        setStep(1);
        setGameHistory([]);
        setAvatarUrl('');
        setFormData({ name: '', sign: '', regret: '' });
     }
  };

  return (
    <div className="h-screen w-full text-cyan-400 font-mono flex flex-col items-center bg-black overflow-hidden relative">
       
      {/* HEADER */}
      <div className="w-full h-16 border-b border-cyan-800 flex justify-between items-center px-4 bg-black/90 shrink-0 z-50">
        <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-widest">
          NO_REGRET_MACHINE
        </Link>
        <div className="flex items-center gap-3">
            {avatarUrl && <img src={avatarUrl.replace('.glb', '.png')} className="w-8 h-8 rounded-full border border-pink-500" alt="Avatar"/>}
            {step === 3 && (
                <button onClick={resetGame} className="text-red-500 border border-red-500 px-3 py-1 text-xs font-bold hover:bg-red-500 hover:text-black transition">
                    [ X ] ÇIKIŞ
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

        {/* ADIM 1: GİRİŞ FORMU */}
        {step === 1 && (
          <div className="w-full max-w-md border border-cyan-500/50 bg-black/80 p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-in zoom-in duration-300 relative z-10">
            <h2 className="text-xl text-pink-500 font-bold mb-6 tracking-[0.2em] border-l-4 border-pink-500 pl-4">
              KİMLİK_PROTOKOLÜ
            </h2>
            <div className="space-y-4">
               <div>
                 <label className="text-[10px] text-cyan-600 block mb-1">KOD ADIN</label>
                 <input name="name" value={formData.name} onChange={handleInput} placeholder="Giriş yap..." className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500"/>
               </div>
               <div>
                 <label className="text-[10px] text-cyan-600 block mb-1">YILDIZ KONUMU</label>
                 <select name="sign" value={formData.sign} onChange={handleInput} className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500">
                    <option value="">BURÇ SEÇİNİZ...</option>
                    <option value="Koç">KOÇ</option>
                    <option value="Boğa">BOĞA</option>
                    <option value="İkizler">İKİZLER</option>
                    <option value="Yengeç">YENGEÇ</option>
                    <option value="Aslan">ASLAN</option>
                    <option value="Başak">BAŞAK</option>
                    <option value="Terazi">TERAZİ</option>
                    <option value="Akrep">AKREP</option>
                    <option value="Yay">YAY</option>
                    <option value="Oğlak">OĞLAK</option>
                    <option value="Kova">KOVA</option>
                    <option value="Balık">BALIK</option>
                 </select>
               </div>
               <div>
                 <label className="text-[10px] text-cyan-600 block mb-1">SİSTEM ARIZASI (KEŞKE)</label>
                 <textarea name="regret" value={formData.regret} onChange={handleInput} rows={3} placeholder="Pişmanlığını veriye dönüştür..." className="w-full bg-gray-900/50 text-pink-400 p-3 border border-gray-700 outline-none focus:border-pink-500 resize-none"/>
               </div>
               <button onClick={() => { if(formData.name && formData.sign && formData.regret) setStep(2); else alert("EKSİK VERİ!"); }} className="w-full mt-2 bg-cyan-900/20 border border-cyan-500 text-cyan-400 py-4 font-bold tracking-widest hover:bg-cyan-500 hover:text-black transition">
                 BAĞLANTIYI KUR ►
               </button>
            </div>
          </div>
        )}

        {/* ADIM 2: AVATAR YARATICI (MANUEL BUTONLU) */}
        {step === 2 && (
          <div className="w-full h-full max-w-7xl border-2 border-pink-500 relative shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-black animate-in zoom-in duration-500 flex flex-col">
            
            {/* Üst Bilgi Çubuğu + MANUEL BUTON */}
            <div className="bg-pink-500 text-black px-3 py-2 font-bold flex justify-between items-center shrink-0">
                <span className="text-xs">AVATAR_BUILDER.EXE</span>
                
                {/* İŞTE CAN KURTARAN BUTON */}
                <button 
                    onClick={() => triggerGameStart("https://models.readyplayer.me/64b...glb")} // Varsayılan bir avatar URL ile geçer
                    className="bg-black text-pink-500 px-3 py-1 text-xs border border-black hover:bg-white hover:text-pink-600 transition animate-pulse"
                >
                    AVATAR HAZIRSA TIKLA ►
                </button>
            </div>
            
            <iframe
              src="https://demo.readyplayer.me/avatar?frameApi" 
              className="w-full flex-1 border-0"
              allow="camera *; microphone *"
              title="Avatar Creator"
            />
          </div>
        )}

        {/* ADIM 3: OYUN EKRANI */}
        {step === 3 && (
          <div className="w-full max-w-4xl h-full border border-gray-800 bg-black/90 flex flex-col relative shadow-2xl animate-in slide-in-from-bottom-10">
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-32 custom-scrollbar">
                {gameHistory.map((turn, i) => (
                    <div key={i} className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[85%] p-4 sm:p-5 border relative text-sm sm:text-base leading-relaxed ${
                            turn.role === 'user' 
                            ? 'border-gray-600 bg-gray-900 text-gray-300 rounded-l-xl rounded-br-xl text-right' 
                            : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-100 rounded-r-xl rounded-bl-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        }`}>
                            {turn.role === 'assistant' && <span className="absolute -top-2 -left-2 text-[10px] bg-black border border-cyan-500 text-cyan-500 px-1">SYS</span>}
                            {turn.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-pink-500 text-xs animate-pulse">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>SİMÜLASYON YAZILIYOR...</span>
                    </div>
                )}
             </div>

             {gameHistory.length > 0 && gameHistory[gameHistory.length - 1].role === 'assistant' && !loading && (
                 <div className="absolute bottom-0 left-0 w-full bg-black/95 border-t border-cyan-900 p-4 backdrop-blur-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {gameHistory[gameHistory.length - 1].options?.map((opt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => {
                                    if(opt === "Baştan Başla") resetGame();
                                    else makeChoice(opt);
                                }}
                                className="border border-pink-500/50 text-pink-400 py-3 px-4 hover:bg-pink-500 hover:text-black transition font-bold text-sm text-left truncate relative group"
                            >
                                <span className="absolute left-2 opacity-0 group-hover:opacity-100 transition">►</span>
                                <span className="group-hover:translate-x-4 transition-transform block">{opt}</span>
                            </button>
                        ))}
                    </div>
                 </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
