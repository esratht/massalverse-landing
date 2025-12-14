"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function MarsPage() {
  const [step, setStep] = useState(1);
  const [contract, setContract] = useState({
    goal: '',
    obstacles: '',
    commitment: '',
    reward: '',
    consequence: ''
  });
  const [isGenerated, setIsGenerated] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContract({ ...contract, [e.target.name]: e.target.value });
  };

  const generateContract = () => {
    if (!contract.goal || !contract.commitment) {
      alert("Hedef ve taahhüt alanları zorunlu!");
      return;
    }
    setIsGenerated(true);
  };

  const resetContract = () => {
    setContract({ goal: '', obstacles: '', commitment: '', reward: '', consequence: '' });
    setIsGenerated(false);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['Orbitron'] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-cyan-400 transition">
            ← ANA SUNUCU
          </Link>
          <span className="text-[10px] text-orange-500 animate-pulse">● BURNING</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">🔥</div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-4">
            MARS VURUCU
          </h1>
          <p className="text-orange-600 text-sm tracking-[0.3em]">7 GÜN EYLEM SÖZLEŞMESİ</p>
        </div>

        {!isGenerated ? (
          <div className="space-y-6">
            
            <div className="border border-orange-500/50 bg-orange-950/20 p-6">
              <p className="text-gray-400 font-['Fira_Code'] text-sm mb-4 leading-relaxed">
                Mars enerjisi eylem, cesaret ve irade gücünü temsil eder. 
                Bu sözleşme ile 7 günlük bir taahhüt vererek Mars enerjinizi aktive edeceksiniz.
              </p>
              
              <div className="flex gap-2 text-xs text-orange-400">
                <span className={step >= 1 ? 'text-orange-400' : 'text-gray-600'}>● HEDEF</span>
                <span>→</span>
                <span className={step >= 2 ? 'text-orange-400' : 'text-gray-600'}>● ENGELLER</span>
                <span>→</span>
                <span className={step >= 3 ? 'text-orange-400' : 'text-gray-600'}>● TAAHHÜT</span>
              </div>
            </div>

            {step === 1 && (
              <div className="border border-red-500/50 bg-red-950/20 p-6 animate-in fade-in">
                <h3 className="text-red-400 font-bold mb-4">[ ADIM 1: HEDEF ]</h3>
                <label className="text-[10px] text-red-600 mb-2 block tracking-widest">
                  7 GÜNDE NEYI BAŞARMAK İSTİYORSUN?
                </label>
                <textarea 
                  name="goal"
                  value={contract.goal}
                  onChange={handleInput}
                  rows={3}
                  className="w-full bg-black border border-red-700 text-red-300 p-3 outline-none focus:border-red-400 font-['Fira_Code'] text-sm resize-none"
                  placeholder="Spesifik ve ölçülebilir bir hedef yaz..."
                />
                <button 
                  onClick={() => contract.goal && setStep(2)}
                  className="mt-4 w-full border border-red-500 text-red-400 py-3 hover:bg-red-500 hover:text-black transition"
                >
                  DEVAM →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="border border-orange-500/50 bg-orange-950/20 p-6 animate-in fade-in">
                <h3 className="text-orange-400 font-bold mb-4">[ ADIM 2: ENGELLER ]</h3>
                <label className="text-[10px] text-orange-600 mb-2 block tracking-widest">
                  SENİ DURDURACAK ENGELLER NELERDİR?
                </label>
                <textarea 
                  name="obstacles"
                  value={contract.obstacles}
                  onChange={handleInput}
                  rows={3}
                  className="w-full bg-black border border-orange-700 text-orange-300 p-3 outline-none focus:border-orange-400 font-['Fira_Code'] text-sm resize-none"
                  placeholder="Tembellik, korku, zaman yönetimi..."
                />
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-600 text-gray-400 py-3 hover:border-gray-400 transition"
                  >
                    ← GERİ
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-1 border border-orange-500 text-orange-400 py-3 hover:bg-orange-500 hover:text-black transition"
                  >
                    DEVAM →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="border border-yellow-500/50 bg-yellow-950/20 p-6 animate-in fade-in">
                <h3 className="text-yellow-400 font-bold mb-4">[ ADIM 3: TAAHHÜT ]</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-yellow-600 mb-2 block tracking-widest">
                      HER GÜN NE YAPACAKSIN?
                    </label>
                    <input 
                      type="text"
                      name="commitment"
                      value={contract.commitment}
                      onChange={handleInput}
                      className="w-full bg-black border border-yellow-700 text-yellow-300 p-3 outline-none focus:border-yellow-400 font-['Fira_Code'] text-sm"
                      placeholder="Günlük eylemi tanımla..."
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-green-600 mb-2 block tracking-widest">
                      ÖDÜL (7 GÜN SONUNDA)
                    </label>
                    <input 
                      type="text"
                      name="reward"
                      value={contract.reward}
                      onChange={handleInput}
                      className="w-full bg-black border border-green-700 text-green-300 p-3 outline-none focus:border-green-400 font-['Fira_Code'] text-sm"
                      placeholder="Kendine ne ödül vereceksin?"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-red-600 mb-2 block tracking-widest">
                      SONUÇ (BAŞARAMAZSAN)
                    </label>
                    <input 
                      type="text"
                      name="consequence"
                      value={contract.consequence}
                      onChange={handleInput}
                      className="w-full bg-black border border-red-700 text-red-300 p-3 outline-none focus:border-red-400 font-['Fira_Code'] text-sm"
                      placeholder="Vazgeçersen ne olacak?"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-600 text-gray-400 py-3 hover:border-gray-400 transition"
                  >
                    ← GERİ
                  </button>
                  <button 
                    onClick={generateContract}
                    className="flex-1 border-2 border-orange-500 text-orange-400 py-3 hover:bg-orange-500 hover:text-black transition font-bold"
                  >
                    🔥 SÖZLEŞMEYİ OLUŞTUR
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            
            <div className="border-2 border-orange-500 bg-gradient-to-b from-orange-950/40 to-red-950/40 p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🔥</div>
                <h2 className="text-2xl font-black text-orange-400">MARS SÖZLEŞMESI</h2>
                <p className="text-orange-600 text-xs mt-2">7 GÜNLÜK EYLEM PROTOKOLÜ</p>
              </div>

              <div className="space-y-4 font-['Fira_Code'] text-sm">
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="text-gray-500 text-xs">HEDEF</p>
                  <p className="text-red-300">{contract.goal}</p>
                </div>

                {contract.obstacles && (
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="text-gray-500 text-xs">ENGELLER</p>
                    <p className="text-orange-300">{contract.obstacles}</p>
                  </div>
                )}

                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="text-gray-500 text-xs">GÜNLÜK TAAHHÜT</p>
                  <p className="text-yellow-300">{contract.commitment}</p>
                </div>

                {contract.reward && (
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-gray-500 text-xs">ÖDÜL</p>
                    <p className="text-green-300">{contract.reward}</p>
                  </div>
                )}

                {contract.consequence && (
                  <div className="border-l-4 border-pink-500 pl-4">
                    <p className="text-gray-500 text-xs">SONUÇ</p>
                    <p className="text-pink-300">{contract.consequence}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-orange-800 text-center">
                <p className="text-gray-500 text-xs mb-2">SÖZLEŞME KODU</p>
                <p className="text-orange-400 font-bold text-lg">
                  MARS-{new Date().toISOString().slice(0,10).replace(/-/g,'')}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={resetContract}
                className="flex-1 border border-gray-600 text-gray-400 py-3 hover:border-gray-400 transition"
              >
                YENİ SÖZLEŞME
              </button>
              <Link 
                href="/rpg"
                className="flex-1 border border-cyan-500 text-cyan-400 py-3 hover:bg-cyan-500 hover:text-black transition text-center"
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
