import './globals.css'
import './theme.css'
import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'

const nunito = Nunito_Sans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Window — Social Media for Real Lives',
  description: 'Share real life stories with warmth and privacy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen bg-bg text-text antialiased">{children}</body>
    </html>
  )
}
