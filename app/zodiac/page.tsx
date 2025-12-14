"use client";

import Link from 'next/link';
import { useState } from 'react';

const zodiacData = [
  { sign: "Koç", icon: "♈", shadow: "Sabırsızlık ve öfke patlamaları", light: "Cesaret ve öncü ruh", element: "Ateş" },
  { sign: "Boğa", icon: "♉", shadow: "İnatçılık ve değişime direnç", light: "Sadakat ve dayanıklılık", element: "Toprak" },
  { sign: "İkizler", icon: "♊", shadow: "Tutarsızlık ve yüzeysellik", light: "Uyum ve iletişim", element: "Hava" },
  { sign: "Yengeç", icon: "♋", shadow: "Aşırı duygusallık ve manipülasyon", light: "Şefkat ve koruyuculuk", element: "Su" },
  { sign: "Aslan", icon: "♌", shadow: "Ego ve onay bağımlılığı", light: "Yaratıcılık ve liderlik", element: "Ateş" },
  { sign: "Başak", icon: "♍", shadow: "Mükemmeliyetçilik ve eleştiri", light: "Analitik zeka ve hizmet", element: "Toprak" },
  { sign: "Terazi", icon: "♎", shadow: "Kararsızlık ve çatışmadan kaçış", light: "Denge ve diplomasi", element: "Hava" },
  { sign: "Akrep", icon: "♏", shadow: "Kıskançlık ve intikam", light: "Dönüşüm ve derinlik", element: "Su" },
  { sign: "Yay", icon: "♐", shadow: "Sorumsuzluk ve aşırı iyimserlik", light: "Özgürlük ve felsefe", element: "Ateş" },
  { sign: "Oğlak", icon: "♑", shadow: "İş bağımlılığı ve duygusal mesafe", light: "Disiplin ve başarı", element: "Toprak" },
  { sign: "Kova", icon: "♒", shadow: "Duygusal kopukluk ve isyankarlık", light: "Yenilik ve insancıllık", element: "Hava" },
  { sign: "Balık", icon: "♓", shadow: "Kaçış ve kurban mentalitesi", light: "Sezgi ve empati", element: "Su" },
];

export default function ZodiacPage() {
  const [selectedSign, setSelectedSign] = useState<typeof zodiacData[0] | null>(null);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['Orbitron'] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="text-sm text-gray-500 hover:text-cyan-400 transition">
            ← ANA SUNUCU
          </Link>
          <span className="text-[10px] text-yellow-500 animate-pulse">● MAPPING</span>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">♈</div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 mb-4">
            ZODIAC LOG
          </h1>
          <p className="text-yellow-600 text-sm tracking-[0.3em]">GÖLGE YANSIMASI</p>
        </div>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-8">
          {zodiacData.map((zodiac) => (
            <button
              key={zodiac.sign}
              onClick={() => setSelectedSign(zodiac)}
              className={`border p-4 text-center transition-all hover:scale-105 ${
                selectedSign?.sign === zodiac.sign 
                  ? 'border-yellow-500 bg-yellow-950/30' 
                  : 'border-gray-700 hover:border-yellow-500/50'
              }`}
            >
              <div className="text-3xl mb-2">{zodiac.icon}</div>
              <p className="text-xs text-gray-400">{zodiac.sign}</p>
            </button>
          ))}
        </div>

        {/* Selected Sign Details */}
        {selectedSign && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            <div className="border-2 border-yellow-500 bg-yellow-950/20 p-8 text-center">
              <div className="text-6xl mb-4">{selectedSign.icon}</div>
              <h2 className="text-3xl font-black text-yellow-400 mb-2">{selectedSign.sign}</h2>
              <p className="text-yellow-600 text-sm">{selectedSign.element} Elementi</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-red-500/50 bg-red-950/20 p-6">
                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                  <span>👁️</span> GÖLGE YÖNÜ
                </h3>
                <p className="text-gray-300 font-['Fira_Code'] text-sm">
                  {selectedSign.shadow}
                </p>
              </div>

              <div className="border border-green-500/50 bg-green-950/20 p-6">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                  <span>✨</span> IŞIK YÖNÜ
                </h3>
                <p className="text-gray-300 font-['Fira_Code'] text-sm">
                  {selectedSign.light}
                </p>
              </div>
            </div>

            <div className="border border-cyan-500/50 bg-cyan-950/20 p-6">
              <h3 className="text-cyan-400 font-bold mb-4">[ SİSTEM ANALİZİ ]</h3>
              <p className="text-gray-300 font-['Fira_Code'] text-sm leading-relaxed">
                {selectedSign.sign} enerjisi taşıyanlar, <span className="text-red-400">{selectedSign.shadow.toLowerCase()}</span> gölgesiyle 
                yüzleşerek <span className="text-green-400">{selectedSign.light.toLowerCase()}</span> potansiyellerini 
                açığa çıkarabilirler. Simülasyonda bu denge sürekli test edilir.
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/rpg"
                className="inline-block border border-pink-500 text-pink-400 px-8 py-4 hover:bg-pink-500 hover:text-black transition font-bold tracking-widest"
              >
                [ BU ENERJİYLE SİMÜLASYONA GİR ]
              </Link>
            </div>
          </div>
        )}

        {!selectedSign && (
          <p className="text-center text-gray-600 font-['Fira_Code'] text-sm">
            Burcunu seçerek gölge haritanı görüntüle
          </p>
        )}

      </div>
    </div>
  );
}
