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

  // IFRAME AVATAR DİNLEYİCİSİ (BEYAZ EKRAN ÇÖZÜMÜ)
  useEffect(() => {
    const receiveMessage = (event: any) => {
        let data = event.data;
        try { if (typeof data === 'string') data = JSON.parse(data); } catch (e) {}
        
        if (data?.source === 'readyplayerme' && data.eventName === 'v1.avatar.exported') {
            console.log("Avatar Geldi:", data.data.url);
            setAvatarUrl(data.data.url);
            setStep(3);
            startApiGame(data.data.url); // API'yi Tetikle
        }
    };
    if (step === 2) window.addEventListener('message', receiveMessage);
    return () => window.removeEventListener('message', receiveMessage);
  }, [step]);

  // SCROLL AYARI
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [gameHistory.length, loading]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- API BAĞLANTISI (GERÇEK CLAUDE) ---
  const startApiGame = async (url: string) => {
    setLoading(true);
    try {
        const res = await fetch('/api/generate-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: [], // İlk mesaj boş
                userName: formData.name,
                sign: formData.sign,
                regret: formData.regret
            })
        });
        
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setGameHistory([{ 
            role: 'assistant', 
            content: data.story, 
            options: data.options 
        }]);

    } catch (err) {
        alert("GÖLGE BAĞLANTISI KURULAMADI (API KEY EKSİK OLABİLİR)");
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const makeChoice = async (choice: string) => {
    // Önce kullanıcının seçimini ekrana bas
    const newHistory = [...gameHistory, { role: 'user', content: choice } as GameTurn];
    setGameHistory(newHistory);
    setLoading(true);

    try {
        // Sonra tüm geçmişi alıp API'ye gönder
        const res = await fetch('/api/generate-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                history: newHistory, // Tüm konuşma geçmişini gönderiyoruz
                userName: formData.name,
                sign: formData.sign,
                regret: formData.regret
            })
        });

        const data = await res.json();
        
        setGameHistory(prev => [...prev, { 
            role: 'assistant', 
            content: data.story, 
            options: data.options 
        }]);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  // BASİT RESET
  const resetGame = () => {
    if (confirm("Gerçeklikten kopuyor musun?")) {
        setStep(1); setGameHistory([]); setAvatarUrl(''); setFormData({ name: '', sign: '', regret: '' });
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
            {avatarUrl && <img src={avatarUrl.replace('.glb', '.png')} className="w-10 h-10 rounded-full border border-pink-500" />}
            {step === 3 && <button onClick={resetGame} className="text-red-500 border border-red-500 px-2 py-1 text-xs">[ X ]</button>}
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

        {/* STEP 1: FORM */}
        {step === 1 && (
          <div className="w-full max-w-md border border-cyan-500/50 bg-black/80 p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-in zoom-in relative z-10">
            <h2 className="text-xl text-pink-500 font-bold mb-6 tracking-[0.2em] border-l-4 border-pink-500 pl-4">KİMLİK_PROTOKOLÜ</h2>
            <div className="space-y-4">
               <input name="name" onChange={handleInput} placeholder="Kod Adın" className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500"/>
               <select name="sign" onChange={handleInput} className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500">
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
               <textarea name="regret" onChange={handleInput} rows={3} placeholder="Sistem Hatası (Keşke)..." className="w-full bg-gray-900/50 text-pink-400 p-3 border border-gray-700 outline-none focus:border-pink-500 resize-none"/>
               <button onClick={() => { if(formData.name && formData.sign && formData.regret) setStep(2); else alert("EKSİK VERİ!"); }} className="w-full mt-2 bg-cyan-900/20 border border-cyan-500 text-cyan-400 py-4 font-bold tracking-widest hover:bg-cyan-500 hover:text-black transition">MA'YI ÇAĞIR ►</button>
            </div>
          </div>
        )}

        {/* STEP 2: IFRAME AVATAR (GÜVENLİ) */}
        {step === 2 && (
          <div className="w-full h-full max-w-7xl border-2 border-pink-500 relative bg-black flex flex-col animate-in zoom-in">
             <div className="bg-pink-500 text-black px-3 py-2 font-bold flex justify-between items-center shrink-0">
                <span className="text-xs">AVATAR_BUILDER.IFRAME</span>
                <button onClick={() => { setAvatarUrl("https://models.readyplayer.me/64b73e89694d5d4d3c631742.glb"); setStep(3); startApiGame("mock"); }} className="bg-black text-pink-500 px-2 py-1 text-[10px] animate-pulse">GEÇ (MANUEL) ►</button>
             </div>
             <iframe src="https://demo.readyplayer.me/avatar?frameApi" className="w-full flex-1 border-0" allow="camera *; microphone *" title="Ready Player Me" />
          </div>
        )}

        {/* STEP 3: API SOHBETİ */}
        {step === 3 && (
          <div className="w-full max-w-4xl h-full border border-gray-800 bg-black/90 flex flex-col relative shadow-2xl animate-in slide-in-from-bottom-10">
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 custom-scrollbar">
                {gameHistory.map((turn, i) => (
                    <div key={i} className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in`}>
                        <div className={`max-w-[85%] p-5 border relative text-sm leading-relaxed ${
                            turn.role === 'user' ? 'border-gray-600 bg-gray-900 text-gray-300 rounded-l-xl rounded-br-xl text-right' : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-100 rounded-r-xl rounded-bl-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        }`}>
                            {turn.role === 'assistant' && <span className="absolute -top-2 -left-2 text-[10px] bg-black border border-cyan-500 text-cyan-500 px-1 font-bold">MA (GÖLGE)</span>}
                            {turn.content}
                        </div>
                    </div>
                ))}
                {loading && <div className="text-pink-500 text-xs p-4 animate-pulse">MA SENİ ANALİZ EDİYOR...</div>}
             </div>

             {/* SEÇENEKLER (STATİK, CLAUDE İÇERİKTEN YÖNETİRSE DAHA İYİ OLUR) */}
             {gameHistory.length > 0 && gameHistory[gameHistory.length - 1].role === 'assistant' && !loading && (
                 <div className="absolute bottom-0 left-0 w-full bg-black/95 border-t border-cyan-900 p-4">
                    <div className="grid grid-cols-2 gap-3">
                        {gameHistory[gameHistory.length - 1].options?.map((opt, idx) => (
                            <button key={idx} onClick={() => makeChoice(opt)} className="border border-pink-500/50 text-pink-400 py-3 px-4 hover:bg-pink-500 hover:text-black transition font-bold text-sm text-left truncate relative group">
                                <span className="absolute left-2 opacity-0 group-hover:opacity-100 transition">►</span><span className="group-hover:translate-x-4 transition-transform block">{opt}</span>
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
