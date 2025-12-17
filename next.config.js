/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Eğer statik bir site/oyun yapıyorsan bu satır ŞART:
  output: 'export', 
  // Resim optimizasyonunu kapat (Vercel export modunda hata verebilir):
  images: {
    unoptimized: true,
  },
  // Sayfa yollarını düzelt (/rpg -> /rpg.html yerine /rpg/index.html yapar):
  trailingSlash: true,
}

module.exports = nextConfig
