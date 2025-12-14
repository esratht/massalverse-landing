"use client";

import Link from 'next/link';

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['Orbitron'] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-cyan-400 transition">
            ← ANA SUNUCU
          </Link>
          <span className="text-[10px] text-pink-500 animate-pulse">● LIVE</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">💠</div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
            MANİFESTO
          </h1>
          <p className="text-cyan-600 text-sm tracking-[0.3em]">SİMÜLASYON ÇEKİRDEĞİ</p>
        </div>

        {/* Content */}
        <div className="space-y-8 font-['Fira_Code'] text-sm leading-relaxed">
          
          <div className="border border-cyan-900 p-6 bg-cyan-950/20">
            <h2 className="text-cyan-400 font-bold mb-4 text-lg">[ PROTOKOL 001 ]</h2>
            <p className="text-gray-300">
              Massalverse, pişmanlıkların simülasyon ortamında işlendiği bir deneyim alanıdır. 
              Burada geçmiş yeniden yazılmaz, sadece farklı perspektiflerden deneyimlenir.
            </p>
          </div>

          <div className="border border-purple-900 p-6 bg-purple-950/20">
            <h2 className="text-purple-400 font-bold mb-4 text-lg">[ PROTOKOL 002 ]</h2>
            <p className="text-gray-300">
              Her kullanıcı kendi masalının yazarıdır. Ma sadece bir rehberdir - kararlar her zaman 
              size aittir. Simülasyon sizi yargılamaz, sadece yansıtır.
            </p>
          </div>

          <div className="border border-pink-900 p-6 bg-pink-950/20">
            <h2 className="text-pink-400 font-bold mb-4 text-lg">[ PROTOKOL 003 ]</h2>
            <p className="text-gray-300">
              Pişmanlık bir virüs değil, bir öğretmendir. Onu bastırmak yerine onunla yüzleşmek, 
              dönüşümün ilk adımıdır. Massalverse bu yüzleşme için güvenli bir alan sunar.
            </p>
          </div>

          <div className="border border-cyan-500 p-6 bg-cyan-950/30">
            <h2 className="text-cyan-300 font-bold mb-4 text-lg">[ ÇEKİRDEK İLKE ]</h2>
            <p className="text-cyan-100 text-base">
              "Geçmişi değiştiremezsin, ama onunla ilişkini değiştirebilirsin. 
              Bu simülasyonun tek amacı budur."
            </p>
            <p className="text-right text-pink-500 mt-4 text-xs">— Ma, Simülasyon Bekçisi</p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <Link 
            href="/rpg" 
            className="inline-block border border-pink-500 text-pink-500 px-8 py-4 hover:bg-pink-500 hover:text-black transition font-bold tracking-widest"
          >
            [ SİMÜLASYONA GİR ]
          </Link>
        </div>

      </div>
    </div>
  );
}
