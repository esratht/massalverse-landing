"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Demo şifre - gerçek projede environment variable kullanın
  const ADMIN_PASSWORD = "massalverse2024";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError("YANLIŞ ŞİFRE - ERİŞİM REDDEDİLDİ");
      setTimeout(() => setError(''), 3000);
    }
  };

  const stats = {
    totalVisitors: 1247,
    activeSimulations: 23,
    completedStories: 892,
    tarotReadings: 456,
    shadowScans: 334,
    marsContracts: 78
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-red-500 font-['Orbitron'] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-black text-red-500 mb-2">GOD MODE</h1>
            <p className="text-red-800 text-sm tracking-widest">YETKİLİ ERİŞİM GEREKLİ</p>
          </div>

          <div className="border border-red-900 bg-red-950/20 p-6">
            <label className="text-[10px] text-red-700 mb-2 block tracking-widest">
              SİSTEM ŞİFRESİ
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full bg-black border border-red-800 text-red-400 p-3 outline-none focus:border-red-500 font-['Fira_Code'] mb-4"
              placeholder="••••••••••"
            />
            
            {error && (
              <div className="text-red-500 text-xs mb-4 animate-pulse text-center border border-red-500 p-2 bg-red-950/50">
                ⚠️ {error}
              </div>
            )}

            <button 
              onClick={handleLogin}
              className="w-full border border-red-500 text-red-500 py-3 hover:bg-red-500 hover:text-black transition font-bold tracking-widest"
            >
              [ ERİŞİM İSTE ]
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-600 text-sm hover:text-gray-400 transition">
              ← Ana Sunucuya Dön
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['Orbitron'] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-red-900 pb-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔓</span>
            <div>
              <h1 className="text-2xl font-black text-red-500">GOD MODE</h1>
              <p className="text-red-800 text-xs tracking-widest">ADMİN PANELİ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-green-500 text-xs animate-pulse">● AUTHENTICATED</span>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="border border-red-800 text-red-600 px-4 py-2 text-xs hover:bg-red-900 transition"
            >
              ÇIKIŞ
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="border border-cyan-900 bg-cyan-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-cyan-400">{stats.totalVisitors}</p>
            <p className="text-[10px] text-cyan-700 tracking-widest mt-1">ZİYARETÇİ</p>
          </div>
          <div className="border border-green-900 bg-green-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{stats.activeSimulations}</p>
            <p className="text-[10px] text-green-700 tracking-widest mt-1">AKTİF SİM</p>
          </div>
          <div className="border border-purple-900 bg-purple-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">{stats.completedStories}</p>
            <p className="text-[10px] text-purple-700 tracking-widest mt-1">HİKAYE</p>
          </div>
          <div className="border border-pink-900 bg-pink-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-pink-400">{stats.tarotReadings}</p>
            <p className="text-[10px] text-pink-700 tracking-widest mt-1">TAROT</p>
          </div>
          <div className="border border-yellow-900 bg-yellow-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{stats.shadowScans}</p>
            <p className="text-[10px] text-yellow-700 tracking-widest mt-1">GÖLGE</p>
          </div>
          <div className="border border-orange-900 bg-orange-950/20 p-4 text-center">
            <p className="text-3xl font-bold text-orange-400">{stats.marsContracts}</p>
            <p className="text-[10px] text-orange-700 tracking-widest mt-1">MARS</p>
          </div>
        </div>

        {/* Main Panels */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* System Status */}
          <div className="border border-cyan-900 bg-cyan-950/10 p-6">
            <h2 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
              <span>⚡</span> SİSTEM DURUMU
            </h2>
            <div className="space-y-3 font-['Fira_Code'] text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">API Durumu</span>
                <span className="text-green-400">● ONLINE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Anthropic API</span>
                <span className="text-green-400">● BAĞLI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Veritabanı</span>
                <span className="text-yellow-400">● DEMO MOD</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">TTS Servisi</span>
                <span className="text-gray-600">● KAPALI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Son Deploy</span>
                <span className="text-cyan-400">{new Date().toLocaleDateString('tr-TR')}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-purple-900 bg-purple-950/10 p-6">
            <h2 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
              <span>🎮</span> HIZLI ERİŞİM
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/rpg" className="border border-cyan-700 p-3 text-center hover:bg-cyan-900/30 transition text-sm">
                💠 RPG
              </Link>
              <Link href="/manifesto" className="border border-blue-700 p-3 text-center hover:bg-blue-900/30 transition text-sm">
                📜 Manifesto
              </Link>
              <Link href="/shadow" className="border border-purple-700 p-3 text-center hover:bg-purple-900/30 transition text-sm">
                👁️ Gölge Bio
              </Link>
              <Link href="/tarot" className="border border-green-700 p-3 text-center hover:bg-green-900/30 transition text-sm">
                🃏 Tarot
              </Link>
              <Link href="/zodiac" className="border border-yellow-700 p-3 text-center hover:bg-yellow-900/30 transition text-sm">
                ♈ Zodiac
              </Link>
              <Link href="/mars" className="border border-orange-700 p-3 text-center hover:bg-orange-900/30 transition text-sm">
                🔥 Mars
              </Link>
            </div>
          </div>

          {/* Activity Log */}
          <div className="border border-green-900 bg-green-950/10 p-6">
            <h2 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <span>📊</span> AKTİVİTE LOGU
            </h2>
            <div className="space-y-2 font-['Fira_Code'] text-xs max-h-48 overflow-y-auto">
              <div className="flex gap-3 text-gray-400">
                <span className="text-green-600">12:45</span>
                <span>Yeni simülasyon başlatıldı - Koç</span>
              </div>
              <div className="flex gap-3 text-gray-400">
                <span className="text-green-600">12:42</span>
                <span>Tarot okuma tamamlandı</span>
              </div>
              <div className="flex gap-3 text-gray-400">
                <span className="text-green-600">12:38</span>
                <span>Gölge taraması - Akrep</span>
              </div>
              <div className="flex gap-3 text-gray-400">
                <span className="text-green-600">12:35</span>
                <span>Mars sözleşmesi oluşturuldu</span>
              </div>
              <div className="flex gap-3 text-gray-400">
                <span className="text-green-600">12:30</span>
                <span>Simülasyon tamamlandı - 5 tur</span>
              </div>
              <div className="flex gap-3 text-gray-400">
                <span className="text-green-600">12:28</span>
                <span>Yeni kullanıcı girişi</span>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="border border-red-900 bg-red-950/10 p-6">
            <h2 className="text-red-400 font-bold mb-4 flex items-center gap-2">
              <span>⚙️</span> AYARLAR
            </h2>
            <div className="space-y-4 font-['Fira_Code'] text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Demo Modu</span>
                <div className="w-12 h-6 bg-green-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Ses Efektleri</span>
                <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Analytics</span>
                <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <button className="w-full border border-red-700 text-red-500 py-2 mt-4 hover:bg-red-900/30 transition text-xs">
                🔄 CACHE TEMİZLE
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-xs">
          <p>MASSALVERSE ADMIN PANEL v3.2 | © 2024</p>
        </div>

      </div>
    </div>
  );
}
