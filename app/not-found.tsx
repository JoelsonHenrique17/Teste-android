"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p className="text-gray-600">Ops! A página que você está procurando não existe ou foi movida.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Página Anterior
          </Button>
        </div>
      </div>
    </div>
  )
}
