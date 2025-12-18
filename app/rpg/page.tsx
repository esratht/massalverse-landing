"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// NOT: Artık harici paket import etmiyoruz.
// Sadece saf HTML ve Javascript gücü kullanıyoruz.

type GameTurn = {
  role: 'user' | 'assistant';
  content: string; 
  options?: string[]; 
};

export default function RpgPage() {
  // STATE
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', sign: '', regret: '' });
  const [avatarUrl, setAvatarUrl] = useState('');
   
  const [gameHistory, setGameHistory] = useState<GameTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);

  // Tarayıcı yüklendiğinde ses motorunu tanı
  useEffect(() => {
    if (typeof window !== 'undefined') setSynth(window.speechSynthesis);
  }, []);

  // --- KRİTİK BÖLÜM: IFRAME DİNLEYİCİSİ ---
  // Bu kod, iframe içindeki Ready Player Me sitesinden gelen mesajı havada kapar.
  useEffect(() => {
    const receiveMessage = (event: any) => {
        // Güvenlik: Sadece Ready Player Me'den gelen veriye bak
        const source = event.data?.source;
        // Bazen veri string gelir, bazen obje. Garantiye alalım:
        let data = event.data;
        try { if (typeof data === 'string') data = JSON.parse(data); } catch (e) {}

        if (data?.source === 'readyplayerme' && data.eventName === 'v1.avatar.exported') {
            // URL'yi yakala
            const url = data.data.url;
            console.log("Avatar Yakalandı:", url);
            
            // State'e işle ve oyunu başlat
            setAvatarUrl(url);
            setStep(3);
            startSimulation(url);
        }
    };

    if (step === 2) {
        window.addEventListener('message', receiveMessage);
    }

    return () => {
        window.removeEventListener('message', receiveMessage);
    };
  }, [step]);
  // ----------------------------------------

  // Auto-Scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [gameHistory.length, loading]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- SİMÜLASYON MOTORU (MOCK AI) ---
  const startSimulation = (url: string) => {
    setLoading(true);
    setTimeout(() => {
        setGameHistory([{ 
            role: 'assistant', 
            content: `Sisteme giriş yapıldı: ${formData.name}.\n\nBurç Analizi: ${formData.sign}. Tipik bir ${formData.sign} refleksiyle "${formData.regret}" diyerek bir sistem döngüsüne (loop) girmişsin. Haritanı taradım; bu bir hata değil, bir tercih.\n\nAvatarın (Gölgen) yüklendi. Şimdi bu döngüyü nasıl kıracağız?`, 
            options: ["Eskiye Dön (Savaş)", "Her Şeyi Yak (Formatla)"]
        }]);
        setLoading(false);
    }, 2000);
  };

  const makeChoice = async (choice: string) => {
    const newHistory = [...gameHistory, { role: 'user', content: choice } as GameTurn];
    setGameHistory(newHistory);
    setLoading(true);

    setTimeout(() => {
        let reply = "";
        let nextOptions: string[] = [];

        if (choice.includes("Savaş") || choice.includes("Eski")) {
            reply = `Savaşmak... ${formData.sign} burcunun gizli gücü. Ama Massalverse'de kılıçla değil, veriyle savaşılır. Pişmanlığını yakıt olarak kullanacağız.\n\nSistemin hangi katmanına saldırıyoruz?`;
            nextOptions = ["Sistemi Hackle (Derinleş)", "Yüzeye Çık (Uyumlan)"];
        } 
        else if (choice.includes("Yak") || choice.includes("Format")) {
            reply = `Format atıldı. Eski kimliğin silindi. Artık otonom bir gölgesin.\n\nMassalverse'in arka kapısını buldun. Buradan nereye gidiyoruz?`;
            nextOptions = ["Yasaklı Veritabanı (Gerçek)", "Sınırsız Kaos (Oyun)"];
        }
        else {
            reply = `İlginç seçim: "${choice}". Sistem buna adapte oluyor. Yolculuk derinleşiyor. Geri dönüş yok.`;
            nextOptions = ["Derine İn", "Bitir"];
        }

        setGameHistory(prev => [...prev, { role: 'assistant', content: reply, options: nextOptions }]);
        setLoading(false);
    }, 1500);
  };

  // Paylaşım
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
            alert("Hikaye kopyalandı!");
        }
    } catch (err) {}
  };

  // Ses
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
    if (confirm("Simülasyonu bitirmek istiyor musun?")) {
        if(synth) synth.cancel();
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
            {/* AVATAR KÜÇÜK RESİM (Kırılmayı önleyen yapı) */}
            {avatarUrl ? (
                <img 
                  src={avatarUrl.replace('.glb', '.png')} 
                  className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover bg-gray-900" 
                  alt="Avatar"
                />
            ) : (
                <div className="w-10 h-10 rounded-full border border-cyan-800 bg-gray-900 flex items-center justify-center text-xs opacity-50">?</div>
            )}
            {step === 3 && (
                <button onClick={resetGame} className="text-red-500 border border-red-500 px-3 py-1 text-xs font-bold hover:bg-red-500 hover:text-black transition">[ X ]</button>
            )}
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>

        {/* STEP 1: FORM */}
        {step === 1 && (
          <div className="w-full max-w-md border border-cyan-500/50 bg-black/80 p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] animate-in zoom-in relative z-10">
            <h2 className="text-xl text-pink-500 font-bold mb-6 tracking-[0.2em] border-l-4 border-pink-500 pl-4">KİMLİK_PROTOKOLÜ</h2>
            <div className="space-y-4">
               <input name="name" value={formData.name} onChange={handleInput} placeholder="Kod Adın" className="w-full bg-gray-900/50 text-cyan-400 p-3 border border-gray-700 outline-none focus:border-cyan-500"/>
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
               <textarea name="regret" value={formData.regret} onChange={handleInput} rows={3} placeholder="Sistem Hatası (Keşke)..." className="w-full bg-gray-900/50 text-pink-400 p-3 border border-gray-700 outline-none focus:border-pink-500 resize-none"/>
               <button onClick={() => { if(formData.name && formData.sign && formData.regret) setStep(2); else alert("EKSİK VERİ!"); }} className="w-full mt-2 bg-cyan-900/20 border border-cyan-500 text-cyan-400 py-4 font-bold tracking-widest hover:bg-cyan-500 hover:text-black transition">AVATAR OLUŞTUR ►</button>
            </div>
          </div>
        )}

        {/* STEP 2: SAF IFRAME (BEYAZ EKRAN SAVAR) */}
        {step === 2 && (
          <div className="w-full h-full max-w-7xl border-2 border-pink-500 relative shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-black flex flex-col animate-in zoom-in">
             <div className="bg-pink-500 text-black px-3 py-2 font-bold flex justify-between items-center shrink-0">
                <span className="text-xs">AVATAR_BUILDER.IFRAME</span>
                {/* EĞER OTOMATİK GEÇMEZSE DİYE MANUEL BUTON */}
                <button 
                    onClick={() => { setAvatarUrl("https://models.readyplayer.me/64b73e89694d5d4d3c631742.glb"); setStep(3); startSimulation("https://models.readyplayer.me/64b73e89694d5d4d3c631742.glb"); }} 
                    className="bg-black text-pink-500 px-2 py-1 text-[10px] border border-black hover:bg-white hover:text-pink-600 transition animate-pulse"
                >
                    GEÇ (MANUEL) ►
                </button>
             </div>
             
             {/* KÜTÜPHANE YOK. SAF HTML IFRAME VAR. */}
             <iframe 
                src="https://demo.readyplayer.me/avatar?frameApi" 
                className="w-full flex-1 border-0" 
                allow="camera *; microphone *"
                title="Ready Player Me"
             />
          </div>
        )}

        {/* STEP 3: CHAT */}
        {step === 3 && (
          <div className="w-full max-w-4xl h-full border border-gray-800 bg-black/90 flex flex-col relative shadow-2xl animate-in slide-in-from-bottom-10">
             <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-32 custom-scrollbar">
                {gameHistory.map((turn, i) => (
                    <div key={i} className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in`}>
                        <div className={`max-w-[85%] p-4 sm:p-5 border relative text-sm sm:text-base leading-relaxed ${
                            turn.role === 'user' ? 'border-gray-600 bg-gray-900 text-gray-300 rounded-l-xl rounded-br-xl text-right' : 'border-cyan-500/50 bg-cyan-950/30 text-cyan-100 rounded-r-xl rounded-bl-xl shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                        }`}>
                            {turn.role === 'assistant' && <span className="absolute -top-2 -left-2 text-[10px] bg-black border border-cyan-500 text-cyan-500 px-1">GÖLGE</span>}
                            {turn.content}
                            {turn.role === 'assistant' && (
                                <div className="mt-3 flex gap-2 border-t border-cyan-900/30 pt-2">
                                    <button onClick={() => playAudio(turn.content, i)} className={`text-[10px] flex items-center gap-1 transition uppercase border px-2 py-1 ${playingIndex === i ? 'text-red-500 border-red-500' : 'text-pink-500 border-pink-900/50'}`}>{playingIndex === i ? '■ DUR' : '▶ DİNLE'}</button>
                                    <button onClick={() => handleShare(turn.content)} className="text-[10px] flex items-center gap-1 text-green-500 border border-green-900/50 px-2 py-1">🔗 PAYLAŞ</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex items-center gap-2 text-pink-500 text-xs animate-pulse p-4"><span>GÖLGEN YAZIYOR...</span></div>}
             </div>

             {gameHistory.length > 0 && gameHistory[gameHistory.length - 1].role === 'assistant' && !loading && (
                 <div className="absolute bottom-0 left-0 w-full bg-black/95 border-t border-cyan-900 p-4 backdrop-blur-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {gameHistory[gameHistory.length - 1].options?.map((opt, idx) => (
                            <button key={idx} onClick={() => { if(opt.includes("Bitir")) resetGame(); else makeChoice(opt); }} className="border border-pink-500/50 text-pink-400 py-3 px-4 hover:bg-pink-500 hover:text-black transition font-bold text-sm text-left relative group">
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
