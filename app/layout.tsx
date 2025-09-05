import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AKRON - Camisetas Oversized para Treino e Lifestyle",
  description:
    "Camisetas oversized de alta qualidade para treino e uso casual. Conforto, durabilidade e estilo urbano.",
  keywords: "camisetas oversized, fitness, treino, streetwear, academia, lifestyle",
  openGraph: {
    title: "AKRON - Camisetas Oversized",
    description: "Camisetas oversized de alta qualidade para treino e uso casual",
    type: "website",
    locale: "pt_BR",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
