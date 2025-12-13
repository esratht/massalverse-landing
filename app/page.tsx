"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  // Modal (Pop-up) Yönetimi
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (id: string) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* CSS Dosyalarını ve Fontları Çağırıyoruz */}
      <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Orbitron:wght@500;900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/style.css" />

      {/* Tarama Çizgisi Efekti */}
      <div className="scan-line"></div>

      <div className="container">
        <header>
          <div className="logo-icon"></div>
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
                {/* 1. KATMAN: Arkadaki Bulanık Neon Işık (Glow) */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                
                {/* 2. KATMAN: Ana Buton Gövdesi */}
                <button className="relative px-8 py-6 sm:px-12 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 border border-gray-800 group-hover:border-cyan-500 transition-colors">
                    
                    {/* Sol Dekoratif İkon */}
                    <span className="flex items-center space-x-5">
                        <span className="pr-6 text-gray-100 group-hover:text-cyan-400 transition duration-200">
                             <span className="text-2xl">💠</span>
                        </span>
                    </span>

                    {/* Buton Yazısı */}
                    <span className="pl-6 text-cyan-100 group-hover:text-white transition duration-200 font-mono text-lg sm:text-xl font-bold tracking-widest uppercase group-hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]">
                         [ SİMÜLASYONA GİR ]
                    </span>
                    
                    {/* Hover Efekti: Scanlines (Tarama Çizgileri) */}
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
        {/* ------------------------------------------- */}

        {/* MODÜLLER GRID */}
        <div className="modules-grid">
          
          <a href="/manifesto.html" className="module-card main-module">
            <div className="icon">💠</div>
            <div className="title">MANİFESTO</div>
            <div className="desc">SİMÜLASYON ÇEKİRDEĞİ</div>
          </a>

          <a href="/Massalverse_Shadow/shadow.html" className="module-card">
            <div className="icon">👁️</div>
            <div className="title">GÖLGE BİO</div>
            <div className="desc">YÜZLEŞME PROTOKOLÜ</div>
          </a>

          <a href="/Massalverse_Shadow/tarot.html" className="module-card">
            <div className="icon">🃏</div>
            <div className="title">GLITCH TAROT</div>
            <div className="desc">SİSTEM HATALARI</div>
          </a>

          <a href="/Massalverse_Shadow/zodiac.html" className="module-card">
            <div className="icon">♈</div>
            <div className="title">ZODIAC LOG</div>
            <div className="desc">GÖLGE YANSIMASI</div>
          </a>
          
          <a href="/Massalverse_Shadow/mars.html" className="module-card" style={{borderColor: '#ff4500'}}>
            <div className="icon">🔥</div>
            <div className="title">MARS VURUCU</div>
            <div className="desc">7 GÜN EYLEM SÖZLEŞMESİ</div>
          </a>

        </div>

        <div style={{marginTop: '30px'}}>
          <a href="/Massalverse_Shadow/admin.html" className="text-[#333] no-underline text-[0.7rem] font-['Orbitron'] transition-colors hover:text-[#ff003c]">🔒 GOD MODE</a>
        </div>

        <div className="legal-footer">
          <span className="legal-link cursor-pointer" onClick={() => openModal('modal-disclaimer')}>⚠️ YASAL UYARI & EĞLENCE BİLDİRİMİ</span>
          <span className="legal-link cursor-pointer" onClick={() => openModal('modal-kvkk')}>🛡️ KVKK VE AÇIK RIZA</span>
        </div>

        <div className="footer-status" style={{marginTop: '10px'}}>SYSTEM STATUS: ONLINE // v3.2</div>
      </div>

      {/* MODAL - YASAL UYARI */}
      <div id="modal-disclaimer" className={`legal-overlay ${activeModal === 'modal-disclaimer' ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className="legal-box">
          <span className="close-modal" onClick={closeModal}>×</span>
          <h2>⚠️ SİMÜLASYON UYARISI</h2>
          <p><strong>DİKKAT YOLCU:</strong></p>
          <p>1. Massalverse platformunda sunulan içerikler tamamen <strong>EĞLENCE ve KURGU</strong> amaçlıdır.</p>
          <p>2. Burada sunulan analizler tıbbi veya finansal tavsiye <strong>DEĞİLDİR</strong>.</p>
          <p>3. "Pişmanlık Virüsü" gibi terimler sanatsal metafordur.</p>
        </div>
      </div>

      {/* MODAL - KVKK */}
      <div id="modal-kvkk" className={`legal-overlay ${activeModal === 'modal-kvkk' ? 'active' : ''}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className="legal-box">
          <span className="close-modal" onClick={closeModal}>×</span>
          <h2>🛡️ KVKK & AÇIK RIZA METNİ</h2>
          <p><strong>VERİ GİZLİLİĞİ VE İŞLEME POLİTİKASI:</strong></p>
          <ul>
            <li><strong>1. Veri İşleme:</strong> Verileriniz anlık simülasyon için işlenir.</li>
            <li><strong>2. Veri Saklama:</strong> Sayfa yenilendiğinde <strong>TÜM VERİLER SİLİNİR</strong>.</li>
            <li><strong>3. Üçüncü Taraflar:</strong> Veriler pazarlama amacıyla satılmaz.</li>
          </ul>
        </div>
      </div>
    </>
  );
}