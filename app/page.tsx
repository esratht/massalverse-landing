"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* Tarama Çizgisi Efekti */}
      <div className="scan-line"></div>

      <div className="container">
        <header>
          <h1 className="main-title">MASSALVERSE</h1>
          <p className="subtitle">Kendi Masalına Uyan!</p>
          <div className="divider">
            <span className="dot"></span>
          </div>
        </header>

        {/* TERMİNAL KUTUSU */}
        <div className="terminal-box">
          <div className="terminal-header">
            <span className="circle red"></span>
            <span className="circle yellow"></span>
            <span className="circle green"></span>
            <span className="terminal-title">&gt; SYSTEM_ROOT</span>
          </div>
          <div className="terminal-content">
            <p>&gt; Sistem başlatılıyor...</p>
            <p>&gt; Bağlantı: Ana Sunucu <span className="status-active">[ONLINE]</span></p>
            <p>&gt; Gizlilik Protokolleri <span className="status-ready">[AKTİF]</span></p>
            <br />
            <p className="blink">&gt; Lütfen giriş protokolünü seçin_</p>
          </div>
        </div>

        {/* --- CYBERPUNK "SİMÜLASYONA GİR" BUTONU --- */}
        <div className="flex flex-col items-center justify-center my-12 relative z-10">
            
            {/* Üstteki Uyarı Yazısı */}
            <p className="text-[10px] text-pink-500 font-mono mb-2 animate-pulse tracking-[0.3em]">
              ⚠️ WARNING: REALITY GLITCH DETECTED
            </p>

            <Link href="/rpg" className="relative group">
                {/* Arkadaki Neon Işık */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                
                {/* Ana Buton */}
                <button className="relative px-8 py-6 sm:px-12 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 border border-gray-800 group-hover:border-cyan-500 transition-colors">
                    
                    <span className="flex items-center space-x-5">
                        <span className="pr-6 text-gray-100 group-hover:text-cyan-400 transition duration-200">
                             <span className="text-2xl">💠</span>
                        </span>
                    </span>

                    <span className="pl-6 text-cyan-100 group-hover:text-white transition duration-200 font-mono text-lg sm:text-xl font-bold tracking-widest uppercase">
                         [ SİMÜLASYONA GİR ]
                    </span>
                    
                    {/* Hover Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,255,247,0.1)_1px,transparent_1px)] bg-[size:4px_4px] opacity-0 group-hover:opacity-100 pointer-events-none rounded-lg"></div>
                </button>
            </Link>

            {/* Alttaki Sistem Bilgisi */}
            <div className="mt-4 flex gap-4 text-[10px] text-gray-600 font-mono">
                <span>CPU: %98</span>
                <span>MEM: OVERLOAD</span>
                <span className="text-green-500">● SERVER: READY</span>
            </div>
        </div>

        {/* MODÜLLER GRID */}
        <div className="modules-grid">
          
          <Link href="/manifesto" className="module-card main-module">
            <div className="icon">💠</div>
            <div className="title">MANİFESTO</div>
            <div className="desc">SİMÜLASYON ÇEKİRDEĞİ</div>
          </Link>

          <Link href="/shadow" className="module-card">
            <div className="icon">👁️</div>
            <div className="title">GÖLGE BİO</div>
            <div className="desc">YÜZLEŞME PROTOKOLÜ</div>
          </Link>

          <Link href="/tarot" className="module-card">
            <div className="icon">🃏</div>
            <div className="title">GLITCH TAROT</div>
            <div className="desc">SİSTEM HATALARI</div>
          </Link>

          <Link href="/zodiac" className="module-card">
            <div className="icon">♈</div>
            <div className="title">ZODIAC LOG</div>
            <div className="desc">GÖLGE YANSIMASI</div>
          </Link>
          
          <Link href="/mars" className="module-card" style={{borderColor: '#ff4500'}}>
            <div className="icon">🔥</div>
            <div className="title">MARS VURUCU</div>
            <div className="desc">7 GÜN EYLEM SÖZLEŞMESİ</div>
          </Link>

        </div>

        <div style={{marginTop: '30px'}}>
          <Link href="/admin" className="text-[#333] no-underline text-[0.7rem] font-['Orbitron'] transition-colors hover:text-[#ff003c]">
            🔒 GOD MODE
          </Link>
        </div>

        <div className="legal-footer">
          <span className="legal-link" onClick={() => openModal('modal-disclaimer')}>⚠️ YASAL UYARI & EĞLENCE BİLDİRİMİ</span>
          <span className="legal-link" onClick={() => openModal('modal-kvkk')}>🛡️ KVKK VE AÇIK RIZA</span>
        </div>

        <div className="footer-status" style={{marginTop: '10px'}}>SYSTEM STATUS: ONLINE // v3.2</div>
      </div>

      {/* MODAL - YASAL UYARI */}
      <div 
        className={`legal-overlay ${activeModal === 'modal-disclaimer' ? 'active' : ''}`} 
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="legal-box">
          <span className="close-modal" onClick={closeModal}>×</span>
          <h2>⚠️ SİMÜLASYON UYARISI</h2>
          <p><strong>DİKKAT YOLCU:</strong></p>
          <p>1. Massalverse platformunda sunulan içerikler (Gölge Biyografi, Tarot, Astrolojik Analizler ve Ma Simülasyonu) tamamen <strong>EĞLENCE ve KURGU</strong> amaçlıdır.</p>
          <p>2. Burada sunulan "Berat"lar, analizler veya tavsiyeler; tıbbi, psikolojik, hukuki veya finansal yatırım tavsiyesi <strong>DEĞİLDİR</strong>.</p>
          <p>3. "Pişmanlık Virüsü", "Altın Onarım" gibi terimler sanatsal metafordur. Gerçek bir tıbbi durumu yansıtmaz.</p>
          <p>4. Psikolojik rahatsızlık hissettiğiniz durumlarda lütfen profesyonel bir uzmana başvurunuz.</p>
        </div>
      </div>

      {/* MODAL - KVKK */}
      <div 
        className={`legal-overlay ${activeModal === 'modal-kvkk' ? 'active' : ''}`} 
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        <div className="legal-box">
          <span className="close-modal" onClick={closeModal}>×</span>
          <h2>🛡️ KVKK & AÇIK RIZA METNİ</h2>
          <p><strong>VERİ GİZLİLİĞİ VE İŞLEME POLİTİKASI:</strong></p>
          <p>Massalverse Simülasyonu'na giriş yaparak aşağıdaki şartları kabul etmiş sayılırsınız:</p>
          <ul>
            <li><strong>1. Veri İşleme:</strong> Simülasyon dahilinde paylaştığınız veriler, sadece anlık olarak işlenir.</li>
            <li><strong>2. Veri Saklama:</strong> Sayfa yenilendiğinde veya simülasyon sonlandığında <strong>TÜM VERİLER SİLİNİR</strong>.</li>
            <li><strong>3. Üçüncü Taraflar:</strong> Verileriniz pazarlama amacıyla üçüncü şahıslara satılmaz.</li>
            <li><strong>4. Açık Rıza:</strong> "Simülasyona Gir" butonuna tıklayarak, bu verilerin işlenmesine <strong>AÇIK RIZA</strong> verdiğinizi beyan edersiniz.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
