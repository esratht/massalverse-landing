"use client";

import { AvatarCreator } from '@readyplayerme/react-avatar-creator';
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
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameHistory.length, loading]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnAvatarExported = (event: any) => {
    setAvatarUrl(event.data.url);
    setStep(3);
    startGame(); 
  };

  const resetGame = () => {
    if (confirm("Simülasyonu sonlandırmak istediğine emin misin?")) {
        setStep(1);
        setGameHistory([]);
        setAvatarUrl('');
        setFormData({ name: '', sign: '', regret: '' });
        if (audioRef.current) audioRef.current.pause();
    }
  };

  const handleShare = async (text: string) => {
    const shareData = {
        title: 'Massalverse: No Regret Machine',
        text: `"${text}" \n\n>> Massalverse Simülasyonunda Kendi Masalını Yaz:`,
        url: window.location.origin
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert("HİKAYE KOPYALANDI! [CTRL+V] ile istediğin yere yapıştır.");
        }
    } catch (err) {
        console.log("Paylaşım iptal edildi.");
    }
  };

  const playAudio = async (text: string, index: number) => {
    if (playingIndex === index) {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlayingIndex(null);
      }
      return;
    }
    try {
      setPlayingIndex(index);
      const response = await fetch('/api/read-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setPlayingIndex(null);
    } catch (err) {
      alert("SES HATASI");
      setPlayingIndex(null);
    }
  };

  const startGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: [], 
          userName: formData.name, 
          sign: formData.sign, 
          regret: formData.regret 
        }),
      });
      const data = await response.json();
      setGameHistory([{ 
        role: 'assistant', 
        content: data.story, 
        options: data.options 
      }]);
    } catch (err) { 
      alert("BAĞLANTI KOPTU"); 
    } finally { 
      setLoading(false); 
    }
  };

  const makeChoice = async (choice: string) => {
    const newHistory = [...gameHistory, { role: 'user', content: choice } as GameTurn];
    setGameHistory(newHistory);
    setLoading(true);
    try {
      const apiHistory = newHistory.map(h => ({ role: h.role, content: h.content }));
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: apiHistory, 
          userName: formData.name, 
          sign: formData.sign, 
          regret: formData.regret 
        }),
      });
      const data = await response.json();
      setGameHistory(prev => [...prev, { 
        role: 'assistant', 
        content: data.story, 
        options: data.options 
      }]);
    } catch (err) { 
      alert("SİMÜLASYON HATASI"); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen text-cyan-400 font-['Fira_Code'] flex flex-col items-center p-2 sm:p-4 cyber-grid relative overflow-hidden">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl border-b border-cyan-800 pb-2 mb-4 flex justify-between items-center sticky top-0 bg-black/95 z-50 pt-2 backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
        <Link href="/" className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 truncate mr-2 tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.5)] hover:opacity-80 transition">
          NO_REGRET_MACHINE
        </Link>
        
        <div className="flex items-center gap-3">
            {step === 3 && (
                <button 
                    onClick={resetGame}
                    className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-black px-3 py-1 text-[10px] sm:text-xs font-bold transition uppercase whitespace-nowrap active:scale-95 shadow-[0_0_10px_rgba(255,0,0,0.3)]"
                >
                    <span className="sm:hidden">[X]</span>
                    <span className="hidden sm:inline">[ X ] SIFIRLA</span>
                </button>
            )}
            
            <div className="flex items-center gap-2">
                {avatarUrl && (
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75"></div>
                    <img 
                      src={avatarUrl.replace('.glb', '.png')} 
                      className="relative w-10 h-10 rounded-full border-2 border-cyan-500 object-cover bg-gray-900" 
                      alt="Avatar"
                    />
                  </div>
                )}
                <p className="text-[10px] text-pink-500 animate-pulse hidden sm:block font-bold ml-1">● ON-AIR</p>
            </div>
        </div>
      </div>

      {/* ADIM 1: GİRİŞ FORMU */}
      {step === 1 && (
        <div className="w-full max-w-lg border border-cyan-500/50 bg-black/80 p-6 sm:p-8 mt-10 shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-in fade-in zoom-in duration-500 relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-pink-500"></div>

          <h2 className="text-lg sm:text-xl mb-6 text-pink-500 font-bold border-l-4 border-pink-500 pl-3 uppercase tracking-widest">
            KİMLİK PROTOKOLÜ
          </h2>
          
          <div className="space-y-5">
            <div>
               <label className="text-[10px] text-cyan-600 mb-1 block uppercase tracking-widest">Kod Adın</label>
               <input 
                 name="name" 
                 value={formData.name} 
                 onChange={handleInput} 
                 className="w-full bg-gray-900/50 border border-gray-700 text-cyan-300 p-3 outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all" 
                 placeholder="Giriş yap..." 
               />
            </div>
            
            <div>
               <label className="text-[10px] text-cyan-600 mb-1 block uppercase tracking-widest">Yıldız Konumu</label>
               <select 
                 name="sign" 
                 value={formData.sign} 
                 onChange={handleInput} 
                 className="w-full bg-gray-900/50 border border-gray-700 text-cyan-300 p-3 outline-none focus:border-cyan-400"
               >
                <option value="">SEÇİNİZ...</option>
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
               <label className="text-[10px] text-cyan-600 mb-1 block uppercase tracking-widest">Sistem Arızası (Keşke)</label>
               <textarea 
                 name="regret" 
                 value={formData.regret} 
                 onChange={handleInput} 
                 rows={3} 
                 className="w-full bg-gray-900/50 border border-gray-700 text-pink-300 p-3 outline-none focus:border-pink-500 focus:shadow-[0_0_10px_rgba(236,72,153,0.3)] resize-none" 
                 placeholder="Veri giriniz..." 
               />
            </div>

            <button 
              onClick={() => {
                if(formData.name && formData.sign && formData.regret) setStep(2);
                else alert("EKSİK VERİ GİRİŞİ!");
              }}
              className="w-full mt-4 bg-cyan-900/20 border border-cyan-500 text-cyan-400 py-4 hover:bg-cyan-500 hover:text-black transition uppercase font-bold tracking-[0.2em] relative overflow-hidden group"
            >
              <span className="relative z-10">[ BAĞLANTIYI BAŞLAT ]</span>
              <div className="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 z-0"></div>
            </button>
          </div>
        </div>
      )}

      {/* ADIM 2: AVATAR YARATICI */}
      {step === 2 && (
        <div className="w-full h-[75vh] sm:h-[80vh] border-2 border-pink-500 relative shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-in zoom-in duration-500">
          <div className="absolute top-0 left-0 bg-pink-500 text-black text-[10px] sm:text-xs px-2 py-1 z-10 font-bold uppercase tracking-widest">
            AVATAR_BUILDER.EXE
          </div>
          <AvatarCreator 
            subdomain="demo" 
            config={{ clearCache: true, bodyType: 'fullbody', language: 'tr' }} 
            style={{ width: '100%', height: '100%', border: 'none', background: '#000' }} 
            onAvatarExported={handleOnAvatarExported} 
          />
        </div>
      )}

      {/* ADIM 3: OYUN EKRANI */}
      {step === 3 && (
        <div className="flex flex-col w-full max-w-3xl h-[80vh] border border-gray-800 bg-black/90 shadow-2xl relative animate-in slide-in-from-bottom-5 duration-500">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scrollbar-hide pb-32">
             {gameHistory.map((turn, index) => (
               <div key={index} className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                 
                 <div className={`max-w-[95%] sm:max-w-[85%] p-5 border relative text-sm sm:text-base leading-relaxed ${
                   turn.role === 'user' 
                   ? 'border-gray-600 bg-gray-900 text-gray-300 text-right rounded-tl-xl rounded-bl-xl rounded-br-xl' 
                   : 'border-cyan-500/50 bg-cyan-900/10 text-cyan-100 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                 }`}>
                   {turn.role === 'assistant' && (
                     <div className="absolute -top-3 -left-3 bg-black border border-cyan-500 text-cyan-500 text-[10px] px-1 font-bold">SYS</div>
                   )}

                   <p className="whitespace-pre-wrap">{turn.content}</p>
                   
                   {turn.role === 'assistant' && (
                     <div className="flex gap-2 mt-4">
                        <button 
                            onClick={() => playAudio(turn.content, index)} 
                            className="text-[10px] flex items-center gap-2 text-pink-500 border border-pink-900/50 px-3 py-1 bg-black/50 hover:bg-pink-900/50 hover:border-pink-500 transition uppercase tracking-widest"
                        >
                            {playingIndex === index ? <span className="animate-pulse">⏹ STOP</span> : <span>🔊 DİNLE</span>}
                        </button>
                        
                        <button 
                            onClick={() => handleShare(turn.content)} 
                            className="text-[10px] flex items-center gap-2 text-green-500 border border-green-900/50 px-3 py-1 bg-black/50 hover:bg-green-900/50 hover:border-green-500 transition uppercase tracking-widest"
                        >
                            🔗 PAYLAŞ
                        </button>
                     </div>
                   )}
                 </div>

                 {turn.role === 'assistant' && index === gameHistory.length - 1 && turn.options && turn.options.length > 0 && (
                   <div className="mt-6 w-full flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     {turn.options.map((option, i) => (
                       <button
                         key={i}
                         onClick={() => !loading && makeChoice(option)}
                         disabled={loading}
                         className="flex-1 border border-pink-500 text-pink-500 py-4 px-4 hover:bg-pink-500 hover:text-black transition-all text-xs sm:text-sm font-bold uppercase disabled:opacity-50 text-left relative group active:scale-95 shadow-[0_0_10px_rgba(236,72,153,0.1)]"
                       >
                         <span className="hidden sm:inline absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition text-lg">►</span>
                         <span className="sm:ml-6">{option}</span>
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             ))}

             {loading && (
                <div className="flex items-center gap-2 text-pink-500 text-xs p-2 animate-pulse font-bold tracking-widest">
                    <span className="w-2 h-2 bg-pink-500"></span>
                    <span>SİMÜLASYON HESAPLANIYOR...</span>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
