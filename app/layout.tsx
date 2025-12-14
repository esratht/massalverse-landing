import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Massalverse - Kendi Masalına Uyan!',
  description: 'Massalverse Simülasyonu - Gölge Biyografi, Tarot, Astroloji ve daha fazlası',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Orbitron:wght@500;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
