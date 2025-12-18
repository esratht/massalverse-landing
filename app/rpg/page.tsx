"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// NOT: Dynamic import falan yok. Direkt Iframe gücü.

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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
   
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // --- MANUEL AVATAR DİNLEYİCİSİ (IFRAME İÇİN) ---
  useEffect(() => {
    const receiveMessage = (event: any) => {
        // Sadece Ready Player Me'den gelen mesajları dinle
        const source = event.data?.source;
        if (source !== 'readyplayerme') return;

        // Avatar oluşturulduğunda (v1 olayları)
        if (event.data?.eventName === 'v1.avatar.exported') {
            console.log("Avatar Yakalandı:", event.data.data.url);
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
  // ------------------------------------------------

  // Scroll efekti
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameHistory.length, loading]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hikaye ve Oyun Fonksiyonları (AYNI KALIYOR)
  const getStoryExcerpt = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };
  
  const openShareModal = (text: string) => {
    setShareContent(text);
    setShowShareModal(true);
  };
  
  // (Buradaki share ve start game fonksiyonları önceki kodundaki gibi kalabilir, yer darlığından kısaltıyorum)
  // ... (handleShare, shareToTwitter, shareToWhatsApp, playAudio, makeChoice, resetGame fonksiyonlarını aynen koru) ...

  const resetGame = () => {
     if (confirm("Simülasyonu sonlandırmak istediğine emin misin?")) {
        setStep(1);
        setGameHistory([]);
        setAvatarUrl('');
        setFormData({ name: '', sign: '', regret: '' });
     }
  };

  const startGame = async () => {
    setLoading(true);
    setTimeout(() => {
        setGameHistory([{ 
            role: 'assistant', 
            content: `Merhaba ${formData.name}. ${formData.sign} burcunun o meşhur inadıyla yine bir kriz yaratmışsın. "${formData.regret}" diyorsun... Hımm. Haritanı tarıyorum. Satürn 5. evinde sıkışmış. Sana iki yol sunuyorum:`, 
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
            content: `İlginç bir seçim. ${choice}... Bu seni KAD Yengeç yoluna sokar.`, 
            options: ["Devam et", "Vazgeç"] 
        }]);
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-cyan-400 font-mono flex flex-col items-center p-2 sm:p-4 cyber-grid relative overflow-hidden bg-black">
       
      {/* HEADER (AYNI) */}
      <div className="w-full max-w-4xl border-b border-cyan-800 pb-2 mb-4 flex justify-between items-center sticky top-0 bg-black/95 z-50 pt-2 backdrop-blur-md">
        <Link href="/" className="text-lg font-black text-cyan-400">NO_REGRET_MACHINE</Link>
        {step === 3 && <button onClick={resetGame} className="text-red-500 text-xs border border-red-500 px-2 py-1">ÇIKIŞ</button>}
      </div>

      {/* ADIM 1: GİRİŞ FORMU (AYNI - KISALTILDI, SEN ESKİSİNİ KULLANABİLİRSİN) */}
      {step === 1 && (
        <div className="w-full max-w-lg border border-cyan-500 bg-black p-6 mt-10">
          <h2 className="text-xl text-pink-500 font-bold mb-4">KİMLİK PROTOKOLÜ</h2>
          <div className="space-y-4">
             <input name="name" onChange={handleInput} placeholder="Kod Adın" className="w-full bg-gray-900 text-cyan-400 p-2 border border-gray-700"/>
             <select name="sign" onChange={handleInput} className="w-full bg-gray-900 text-cyan-400 p-2 border border-gray-700">
                <option value="">Burç Seç...</option>
                <option value="Koç">Koç</option>
                <option value="Boğa">Boğa</option>
                {/* Diğer burçlar... */}
             </select>
             <textarea name="regret" onChange={handleInput} placeholder="Keşken nedir?" className="w-full bg-gray-900 text-pink-400 p-2 border border-gray-700"/>
             <button onClick={() => { if(formData.name) setStep(2); }} className="w-full bg-cyan-900 text-white p-3 font-bold">BAŞLAT</button>
          </div>
        </div>
      )}

      {/* --- ADIM 2: MANUEL IFRAME (KESİN ÇÖZÜM) --- */}
      {step === 2 && (
        <div className="w-full h-[75vh] sm:h-[80vh] border-2 border-pink-500 relative shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-black">
          <div className="absolute top-0 left-0 bg-pink-500 text-black text-[10px] px-2 py-1 z-10 font-bold">
            AVATAR_BUILDER.IFRAME
          </div>
          
          {/* İŞTE SİHİRLİ IFRAME - HİÇBİR EKLENTİYE MUHTAÇ DEĞİL */}
          <iframe
            src="https://demo.readyplayer.me/avatar?frameApi" // 'demo' yerine kendi subdomainini yazabilirsin
            className="w-full h-full border-0"
            allow="camera *; microphone *" // Kamera izni
            title="Avatar Creator"
          />
        </div>
      )}

      {/* ADIM 3: OYUN EKRANI (AYNI - KISALTILDI) */}
      {step === 3 && (
        <div className="flex flex-col w-full max-w-3xl h-[80vh] border border-gray-800 bg-black/90">
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {gameHistory.map((turn, i) => (
                    <div key={i} className={`p-4 border ${turn.role === 'user' ? 'text-right border-gray-600' : 'text-left border-cyan-500'}`}>
                        {turn.content}
                    </div>
                ))}
             </div>
             {/* Seçenekler vs... */}
             <div className="p-4 border-t border-gray-800">
                {/* Butonlar... */}
             </div>
        </div>
      )}
      
      {/* Share Modal (AYNI) */}
      {showShareModal && <div>...</div>}
    </div>
  );
}
