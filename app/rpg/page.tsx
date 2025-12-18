"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic'; // KRİTİK: Beyaz ekranı önler

// AvatarCreator'ı sunucu tarafında değil, sadece tarayıcıda yükle
const AvatarCreator = dynamic(
  () => import('@readyplayerme/react-avatar-creator').then((mod) => mod.AvatarCreator),
  { ssr: false }
);

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
  
  // SES VE PAYLAŞIM
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  // Tarayıcının kendi ses motorunu kullan (API gerektirmez)
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setSynth(window.speechSynthesis);
    }
  }, []);

  // OTOMATİK KAYDIRMA
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [gameHistory.length, loading]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // AVATAR TAMAMLANDIĞINDA
  const handleOnAvatarExported = (event: any) => {
    console.log("Avatar URL:", event.data.url); // Debug için
    setAvatarUrl(event.data.url); // URL'yi kaydet
    setStep(3); // Oyuna geç
    startSimulation(event.data.url); // Simülasyonu başlat
  };

  // --- SİMÜLASYON MOTORU (API YERİNE BURASI ÇALIŞIR) ---
  const startSimulation = (url: string) => {
    setLoading(true);
    // Yapay Zeka Düşünme Süresi (Simüle)
    setTimeout(() => {
        setGameHistory([{ 
            role: 'assistant', 
            content: `Sisteme hoş geldin ${formData.name}. Kodların analiz edildi.\n\nDemek ${formData.sign} burcunun o meşhur inadıyla "${formData.regret}" diyerek bir döngüye girdin. Haritanı tarıyorum... Bu pişmanlık bir hata değil, bir özellik (feature). Sadece yanlış yerde kullanılmış.\n\nŞimdi gölgenle (avatarınla) yüzleşme vakti. Ne yapıyoruz?`, 
            options: ["Eskiye dön ve savaş (Mars)", "Her şeyi yak ve git (Plüton)"]
        }]);
        setLoading(false);
    }, 2000);
  };

  const makeChoice = async (choice: string) => {
    // Kullanıcı hamlesini ekle
    const newHistory = [...gameHistory, { role: 'user', content: choice } as GameTurn];
    setGameHistory(newHistory);
    setLoading(true);

    // SENARYO MANTIĞI (MOCK AI)
    setTimeout(() => {
        let reply = "";
        let nextOptions: string[] = [];

        if (choice.includes("Savaş") || choice.includes("Kabul")) {
            reply = `Savaşmayı seçtin. ${formData.sign} enerjisiyle uyumlu. Ama Massalverse'de kılıçlar değil, kodlar konuşur. Pişmanlığını bir silaha dönüştürdük.\n\nÖnünde iki yol belirdi:`;
            nextOptions = ["Sistemi Hackle (Derinleş)", "Yüzeye Çık (Normalleş)"];
        } 
        else if (choice.includes("Yak") || choice.includes("Git") || choice.includes("Plüton")) {
            reply = `Her şeyi yakmak... Küllerinden doğmak içindir. Eski kimliğini sildik. Artık otonom bir gölgesin.\n\nSistemin açığını buldun. Nereye sızıyoruz?`;
            nextOptions = ["Ana Veritabanı (Gerçek)", "Yasaklı Bölge (Kaos)"];
        }
        else if (choice.includes("Hackle") || choice.includes("Veritabanı")) {
             reply = `Erişim sağlandı. Artık kendi hikayenin yazarısın (Sovereign Architect). Ama dikkat et, burası geri dönüşü olmayan bir yer.`;
             nextOptions = ["Hikayeyi Bitir", "Sonsuz Döngü"];
        }
        else {
            reply = `İlginç bir hamle: "${choice}". Sistem buna adapte oluyor... Yolculuk derinleşiyor. Artık geri dönüş yok.`;
            nextOptions = ["Derine İniş", "Yüzeye Çıkış"];
        }

        setGameHistory(prev => [...prev, { 
            role: 'assistant', 
            content: reply, 
            options: nextOptions 
        }]);
        setLoading(false);
    }, 1500);
  };
  // -----------------------------------------------------

  const handleShare = async (text: string) => {
    const shareData = {
        title: 'Massalverse: No Regret Machine',
        text: `"${text}" \n\n>> Massalverse'de Gölgemle Konuşuyorum:`,
        url: window.location.origin
    };
    try {
        if (navigator.share) await navigator.share(shareData);
        else {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert("Hikaye kopyalandı! İstediğin yere yapıştır.");
        }
    } catch (err) { console.log("Paylaşım iptal"); }
  };

  const playAudio = (text: string, index: number) => {
    if (!synth) return;
    if (playingIndex === index) {
        synth.cancel();
        setPlayingIndex(null);
        return;
    }
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9;
    utterance.onend = () => setPlayingIndex(null);
    setPlayingIndex(index);
    synth.speak(utterance);
  };

  const resetGame = () => {
    if (confirm("Simülasyonu sonlandırmak istediğine emin misin?")) {
        if(synth) synth.cancel();
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
            {/* AVATAR KÜÇÜK RESMİ (DÜZELTİLDİ) */}
            {avatarUrl ? (
                <img 
                  src={avatarUrl.replace('.glb', '.png')} 
                  className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover bg-gray-900" 
                  alt="Avatar"
                  onError={(e) => {
                      // Eğer resim yüklenemezse varsayılan bir ikon göster
                      (e.target as HTMLImageElement).src = "https://avatar.vercel.sh/massalverse";
                  }}
                />
            ) : (
                // Avatar yoksa placeholder göster
                <div className="w-10 h-10 rounded-full border border-cyan-800 bg-gray-900 flex items-center justify-center text-xs opacity-50">
                   ?
                </div>
            )}

            {step === 3 && (
                <button onClick={resetGame} className="text-red-500 border border-red-500 px-3 py-1 text-xs font-bold hover:bg-red-500 hover:text-black transition uppercase">
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
                 AVATAR OLUŞTUR ►
               </button>
            </div>
          </div>
        )}

        {/* ADIM 2: AVATAR YARATICI (DİNAMİK) */}
        {step === 2 && (
          <div className="w-full h-full max-w-7xl border-2 border-pink-500 relative shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-black flex flex-col animate-in zoom-in">
             <div className="bg-pink-500 text-black px-3 py-2 font-bold flex justify-between items-center shrink-0">
                <span className="text-xs">AVATAR_BUILDER.EXE</span>
             </div>
             {/* Kütüphane Kullanımı */}
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
          <div className="w-full max-w-4xl h-full border border-gray-800 bg-black/90 flex flex-col relative shadow-2xl animate-in slide-in-from-bottom-10">
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-32 custom-scrollbar">
                {gameHistory.map((turn, i) => (
                    <div key={i} className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                        <div className={`max-w-[85%] p-4 sm:p-5 border relative text-sm sm:text-base leading-relaxed ${
                            turn.role === 'user' 
                            ? 'border-gray-600 bg-gray-900 text-gray-300 rounded-l-xl rounded-br-xl text-right' 
                            : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-100 rounded-r-xl rounded-bl-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        }`}>
                            {turn.role === 'assistant' && <span className="absolute -top-2 -left-2 text-[10px] bg-black border border-cyan-500 text-cyan-500 px-1">GÖLGE</span>}
                            {turn.content}
                            
                            {/* BUTONLAR */}
                            {turn.role === 'assistant' && (
                                <div className="mt-3 flex gap-2 border-t border-cyan-900/30 pt-2">
                                    <button 
                                        onClick={() => playAudio(turn.content, i)}
                                        className={`text-[10px] flex items-center gap-1 transition uppercase tracking-widest border px-2 py-1 ${
                                            playingIndex === i 
                                            ? 'text-red-500 border-red-500 bg-red-900/20' 
                                            : 'text-pink-500 border-pink-900/50 hover:text-pink-300 bg-black/40'
                                        }`}
                                    >
                                        {playingIndex === i ? '■ DURDUR' : '▶ DİNLE'}
                                    </button>
                                    <button 
                                        onClick={() => handleShare(turn.content)}
                                        className="text-[10px] flex items-center gap-1 text-green-500 hover:text-green-300 transition uppercase tracking-widest border border-green-900/50 px-2 py-1 bg-black/40"
                                    >
                                        🔗 PAYLAŞ
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-pink-500 text-xs animate-pulse">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span>GÖLGEN YAZIYOR...</span>
                    </div>
                )}
             </div>

             {gameHistory.length > 0 && gameHistory[gameHistory.length - 1].role === 'assistant' && !loading && (
                 <div className="absolute bottom-0 left-0 w-full bg-black/95 border-t border-cyan-900 p-4 backdrop-blur-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {gameHistory[gameHistory.length - 1].options?.map((opt, idx) => (
                            <button key={idx} onClick={() => { if(opt.includes("Baştan")) resetGame(); else makeChoice(opt); }} className="border border-pink-500/50 text-pink-400 py-3 px-4 hover:bg-pink-500 hover:text-black transition font-bold text-sm text-left truncate relative group">
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
