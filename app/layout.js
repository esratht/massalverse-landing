export const metadata = {
  title: 'Massalverse',
  description: 'Kişisel Kader Simülasyonu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, padding: 0, background: 'black' }}>
        {children}
      </body>
    </html>
  )
}