import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Tailwind burada devreye giriyor

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Massalverse",
  description: "No Regret Machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        {/* TÜM SİTE İÇİN GEÇERLİ FONT VE EFEKTLER */}
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Orbitron:wght@500;900&display=swap" rel="stylesheet" />
        {/* Eski CSS dosyanı da burada çağırıyoruz ki her yerde çalışsın */}
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body className={inter.className}>
        {/* Her sayfada görünen Scan-line (Tarama Çizgisi) efekti */}
        <div className="scan-line"></div> 
        {children}
      </body>
    </html>
  );
}