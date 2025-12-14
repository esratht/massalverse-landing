"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function ShadowPage() {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateShadow = () => {
    if (!birthDate) {
      alert("Doğum tarihi gerekli!");
      return;
    }
    
    setLoading(true);
    
    // Basit gölge hesaplama simülasyonu
    setTimeout(() => {
      const date = new Date(birthDate);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      
      const shadows = [
        { name: "Terk Edilme Gölgesi", desc: "Bağlanma korkusu ve güvensizlik örüntüleri taşıyorsun." },
        { name: "Mükemmeliyetçi Gölge", desc: "Yeterince iyi olmama korkusu seni esir alıyor." },
        { name: "Kontrol Gölgesi", desc: "Belirsizlik karşısında aşırı kontrol ihtiyacı duyuyorsun." },
        { name: "Görünmezlik Gölgesi", desc: "Fark edilmeme ve değersizlik hissi taşıyorsun." },
        { name: "Öfke Gölgesi", desc: "Bastırılmış öfke ve ifade edilmemiş duygular birikiyor." },
        { name: "Kurban Gölgesi", desc: "Hayatın kontrolünün dışında olduğu inancı hakim." },
        { name: "İmpostor Gölgesi", desc: "Başarılarının hak edilmediği düşüncesi seni takip ediyor." },
        { name: "Bağımlılık Gölgesi", desc: "Onay ve kabul için dışarıya bağımlısın." },
      ];
      
      const index = (day + month) % shadows.length;
      
      setResult({
        shadow: shadows[index],
        code: `SHD-${day}${month}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        intensity: Math.floor(Math.random() * 40) + 60
      });
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['Orbitron'] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-cyan-400 transition">
            ← ANA SUNUCU
          </Link>
          <span className="text-[10px] text-pink-500 animate-pulse">● SCANNING</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">👁️</div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            GÖLGE BİO
          </h1>
          <p className="text-purple-600 text-sm tracking-[0.3em]">YÜZLEŞME PROTOKOLÜ</p>
        </div>

        {!result ? (
          <div className="border border-purple-500/50 bg-purple-950/20 p-8">
            <h2 className="text-purple-400 font-bold mb-6 text-center">[ VERİ GİRİŞİ ]</h2>
            
            <div className="space-y-6 font-['Fira_Code']">
              <div>
                <label className="text-[10px] text-purple-600 mb-2 block tracking-widest">DOĞUM TARİHİ</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-black border border-purple-700 text-purple-300 p-3 outline-none focus:border-purple-400"
                />
              </div>
              
              <div>
                <label className="text-[10px] text-purple-600 mb-2 block tracking-widest">DOĞUM SAATİ (OPSİYONEL)</label>
                <input 
                  type="time" 
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full bg-black border border-purple-700 text-purple-300 p-3 outline-none focus:border-purple-400"
                />
              </div>

              <button 
                onClick={calculateShadow}
                disabled={loading}
                className="w-full border border-purple-500 text-purple-400 py-4 hover:bg-purple-500 hover:text-black transition font-bold tracking-widest disabled:opacity-50"
              >
                {loading ? "TARAMA YAPILIYOR..." : "[ GÖLGEYİ TARA ]"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            <div className="border border-pink-500 bg-pink-950/20 p-6 text-center">
              <p className="text-[10px] text-pink-600 mb-2">GÖLGE KODU</p>
              <p className="text-2xl font-bold text-pink-400 font-['Fira_Code']">{result.code}</p>
            </div>

            <div className="border border-purple-500 bg-purple-950/20 p-8">
              <h3 className="text-xl font-bold text-purple-300 mb-4 text-center">{result.shadow.name}</h3>
              <p className="text-gray-400 font-['Fira_Code'] text-sm text-center leading-relaxed">
                {result.shadow.desc}
              </p>
              
              <div className="mt-6">
                <p className="text-[10px] text-purple-600 mb-2">GÖLGE YOĞUNLUğU</p>
                <div className="w-full bg-gray-800 h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000"
                    style={{ width: `${result.intensity}%` }}
                  ></div>
                </div>
                <p className="text-right text-pink-400 text-sm mt-1">{result.intensity}%</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setResult(null)}
                className="flex-1 border border-gray-600 text-gray-400 py-3 hover:border-gray-400 transition text-sm"
              >
                YENİDEN TARA
              </button>
              <Link 
                href="/rpg"
                className="flex-1 border border-cyan-500 text-cyan-400 py-3 hover:bg-cyan-500 hover:text-black transition text-sm text-center"
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
