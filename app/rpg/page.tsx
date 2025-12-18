"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// TİP TANIMLAMALARI
type GameTurn = {
  role: 'user' | 'assistant';
  content: string; 
  options?: string[]; 
};

export default function RpgPage() {
  // STATE YÖNETİMİ
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', sign: '', regret: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
   
  const [gameHistory, setGameHistory] = useState<GameTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
   
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- AVATAR DİNLEYİCİSİ (MANUEL IFRAME) ---
  useEffect(() => {
    const receiveMessage = (event: any) => {
        // Güvenlik: Sadece Ready Player Me kaynaklı mesajlara bak
        const source = event.data?.source;
        if (source !== 'readyplayerme') return;

        // Avatar bittiğinde (v1.avatar.exported)
        if (event.data?.eventName === 'v1.avatar.exported') {
            console.log("AVATAR YAKALANDI:", event.data.data.url);
            setAvatarUrl(event.data.data.url);
            setStep(3); // Oyuna fırlat
            startGame();
        }
    };

    if (step === 2) {
        window.addEventListener('message', receiveMessage);
    }

    return () => {
        window.removeEventListener('message', receiveMessage);
    };
  }, [step]);
  // ------------------------------------------

  // OTOMATİK SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameHistory.length, loading]);

  // FORM GİRİŞİ
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // OYUN MOTORU (SİMÜLASYON)
  const startGame = async () => {
    setLoading(true);
    // Burası Backend API'ye bağlanacak yer. Şimdilik simülasyon:
    setTimeout(() => {
        setGameHistory([{ 
            role: 'assistant', 
            content: `Sisteme hoş geldin ${formData.name}. Demek ${formData.sign} burcunun lanetiyle başın dertte ve "${formData.regret}" diyerek pişmanlık duyuyorsun.\n\nAnaliz tamamlandı. Kaderini yeniden yazmak için sana iki kapı açıyorum:`, 
            options: ["Eskiye dön ve savaş (Mars)", "Her şeyi yak ve git (Plüton)"]
        }]);
        setLoading(false);
    }, 2000);
  };

  const makeChoice = async (choice: string) => {
    const newHistory = [...gameHistory, { role: 'user', content: choice } as GameTurn];
    setGameHistory(newHistory);
    setLoading(true);

    // Seçim Simülasyonu
    setTimeout(() => {
        setGameHistory(prev => [...prev, { 
            role: 'assistant', 
            content: `Cesurca bir hamle: "${choice}". Ama unutma, Massalverse'de her seçimin bir bedeli vardır. Şimdi önünde yeni bir yol ayrımı belirdi.`, 
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

  // --- RENDER ---
  return (
    // EKRAN YAPISI: h-screen (Tam Boy), flex-col (Dikey Dizilim)
    <div className="h-screen w-full text-cyan-400 font-mono flex flex-col items-center bg-black overflow-hidden relative">
       
      {/* HEADER (ÜST KISIM) - Sabit Yükseklik */}
      <div className="w-full h-16 border-b border-cyan-800 flex justify-between items-center px-4 bg-black/90 shrink-0 z-50">
        <Link href="/" className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-widest hover:opacity-80">
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

      {/* ANA İÇERİK ALANI - flex-1 ile kalan tüm alanı kaplar */}
      <div className="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* ARKA PLAN EFEKTLERİ */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

        {/* --- ADIM 1: GİRİŞ FORMU --- */}
        {step === 1 && (
          <div className="w-full max-w-md border border-cyan-500/50 bg-black/80 p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-in zoom-in duration-300 relative z-10">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-500"></div>

            <h2 className="text-xl text-pink-500 font-bold mb-6 tracking-[0.2em] border-l-4 border-pink-500 pl-4">
              KİMLİK_PROTOKOLÜ
            </h2>
            
            <div className="space-y-4">
               {/* İsim */}
               <div>
                 <label className="text-[10px] text-cyan-600 block mb-1">KOD ADIN</label>
                 <input 
                   name="name" 
                   value={formData.name}
                   onChange={handleInput} 
                   placeholder="Giriş yap..." 
                   className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500 transition"
                 />
               </div>

               {/* Burçlar - TAM LİSTE */}
               <div>
                 <label className="text-[10px] text-cyan-600 block mb-1">YILDIZ KONUMU</label>
                 <select 
                   name="sign" 
                   value={formData.sign}
                   onChange={handleInput} 
                   className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500 cursor-pointer"
                 >
                    <option value="">BURÇ SEÇİNİZ...</option>
                    <option value="Koç">KOÇ (Aries)</option>
                    <option value="Boğa">BOĞA (Taurus)</option>
                    <option value="İkizler">İKİZLER (Gemini)</option>
                    <option value="Yengeç">YENGEÇ (Cancer)</option>
                    <option value="Aslan">ASLAN (Leo)</option>
                    <option value="Başak">BAŞAK (Virgo)</option>
                    <option value="Terazi">TERAZİ (Libra)</option>
                    <option value="Akrep">AKREP (Scorpio)</option>
                    <option value="Yay">YAY (Sagittarius)</option>
                    <option value="Oğlak">OĞLAK (Capricorn)</option>
                    <option value="Kova">KOVA (Aquarius)</option>
                    <option value="Balık">BALIK (Pisces)</option>
                 </select>
               </div>

               {/* Keşke */}
               <div>
                 <label className="text-[10px] text-cyan-600 block mb-1">SİSTEM ARIZASI (KEŞKE)</label>
                 <textarea 
                   name="regret" 
                   value={formData.regret}
                   onChange={handleInput} 
                   rows={3}
                   placeholder="Pişmanlığını veriye dönüştür..." 
                   className="w-full bg-gray-900/50 text-pink-400 p-3 border border-gray-700 outline-none focus:border-pink-500 resize-none"
                 />
               </div>

               <button 
                 onClick={() => { 
                   if(formData.name && formData.sign && formData.regret) setStep(2); 
                   else alert("EKSİK VERİ: Lütfen tüm alanları doldurun.");
                 }} 
                 className="w-full mt-2 bg-cyan-900/20 border border-cyan-500 text-cyan-400 py-4 font-bold tracking-widest hover:bg-cyan-500 hover:text-black transition group relative overflow-hidden"
               >
                 <span className="relative z-10">BAĞLANTIYI KUR ►</span>
                 <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
               </button>
            </div>
          </div>
        )}

        {/* --- ADIM 2: AVATAR YARATICI (DÜZELTİLDİ: TAM EKRAN KAPLAMA) --- */}
        {step === 2 && (
          // flex-1 ve w-full ile container tüm boşluğu doldurur. h-full ile yükseklik garantilenir.
          <div className="w-full h-full max-w-7xl border-2 border-pink-500 relative shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-black animate-in zoom-in duration-500 flex flex-col">
            
            {/* Üst Bilgi Çubuğu */}
            <div className="bg-pink-500 text-black text-xs px-3 py-1 font-bold flex justify-between items-center shrink-0">
                <span>AVATAR_BUILDER.EXE</span>
                <span className="animate-pulse">● CANLI BAĞLANTI</span>
            </div>
            
            {/* IFRAME: flex-1 ile kalan tüm yeri alır */}
            <iframe
              src="https://demo.readyplayer.me/avatar?frameApi" 
              className="w-full flex-1 border-0"
              allow="camera *; microphone *"
              title="Avatar Creator"
            />
          </div>
        )}

        {/* --- ADIM 3: OYUN EKRANI --- */}
        {step === 3 && (
          <div className="w-full max-w-4xl h-full border border-gray-800 bg-black/90 flex flex-col relative shadow-2xl animate-in slide-in-from-bottom-10">
             
             {/* Mesaj Alanı */}
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

             {/* Seçenekler Alanı (Sabit Alt) */}
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
