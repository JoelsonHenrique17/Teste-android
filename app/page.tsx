"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Componentes UI do shadcn/ui
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Ícones do Lucide React
import {
  ShoppingCart,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Menu,
  X,
  MessageCircle,
  Instagram,
  Facebook,
  Clock,
  Phone,
  Mail,
} from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number // Preço original para cálculo de desconto
  images: string[]
  category: "novo" | "limitada" | "promocao"
  sizes: string[]
  colors: string[]
  description: string
  featured: boolean // Se o produto aparece na seção destaque
}

interface HeroContent {
  title: string
  subtitle: string
  image: string
  logo: string
}

export default function AkronStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "AKRON",
    subtitle: "Camisetas Oversized para Treino e Lifestyle",
    image: "/placeholder-nji2c.png",
    logo: "/akron-logo-oficial.png?v=2", // Cache busting para logo
  })

  // Estados para filtros e busca
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para modal de produto
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Estados para interface
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [newsletterEmail, setNewsletterEmail] = useState("")

  // Estados para seleção de produto (cor e tamanho)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedSize, setSelectedSize] = useState<string>("")

  const calculateDiscount = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round((1 - price / originalPrice) * 100)
  }

  const isBusinessHours = () => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay() // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

    // Segunda a Sexta: 8h às 18h
    if (currentDay >= 1 && currentDay <= 5) {
      return currentHour >= 8 && currentHour < 18
    }
    // Sábado: 8h às 14h
    if (currentDay === 6) {
      return currentHour >= 8 && currentHour < 14
    }
    // Domingo: Fechado
    return false
  }

  const getBusinessHoursMessage = () => {
    if (isBusinessHours()) {
      return "🟢 Atendimento Online - Resposta Imediata"
    } else {
      return "🟡 Fora do Horário - Responderemos em Breve"
    }
  }

  useEffect(() => {
    // Tentar carregar produtos do localStorage primeiro
    const savedProducts = localStorage.getItem("akron_products")
    const savedHero = localStorage.getItem("akron_hero")

    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
        setFilteredProducts(parsedProducts)
      } catch (error) {
        console.error("Erro ao carregar produtos salvos:", error)
        loadMockProducts() // Fallback para dados mockados
      }
    } else {
      loadMockProducts() // Se não há produtos salvos, usar dados mockados
    }

    if (savedHero) {
      try {
        const parsedHero = JSON.parse(savedHero)
        setHeroContent(parsedHero)
      } catch (error) {
        console.error("Erro ao carregar hero content salvo:", error)
      }
    }

    function loadMockProducts() {
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Oversized Essential Black",
          price: 89.9,
          originalPrice: 119.9, // Para mostrar desconto
          images: ["/black-oversized-t-shirt-gym-fitness.png", "/black-oversized-t-shirt-back.png"],
          category: "promocao",
          sizes: ["P", "M", "G", "GG"],
          colors: ["Preto"],
          description: "Camiseta oversized essencial em algodão premium, perfeita para treinos e uso casual.",
          featured: true,
        },
        {
          id: "2",
          name: "Urban Fit White",
          price: 79.9,
          images: ["/white-oversized-tee-urban.png", "/white-oversized-tee-side.png"],
          category: "novo",
          sizes: ["P", "M", "G", "GG", "XG"],
          colors: ["Branco"],
          description: "Design urbano com corte oversized, ideal para compor looks streetwear.",
          featured: true,
        },
        {
          id: "3",
          name: "Limited Edition Gray",
          price: 99.9,
          images: ["/gray-oversized-limited-edition-tee.png", "/gray-oversized-t-shirt-detail.png"],
          category: "limitada",
          sizes: ["M", "G", "GG"],
          colors: ["Cinza"],
          description: "Edição limitada com estampa exclusiva e tecido premium.",
          featured: true,
        },
        {
          id: "4",
          name: "Performance Navy",
          price: 94.9,
          images: ["/navy-blue-oversized-performance-tee.png", "/navy-blue-oversized-t-shirt-fabric.png"],
          category: "novo",
          sizes: ["P", "M", "G", "GG"],
          colors: ["Azul Marinho"],
          description: "Tecnologia dry-fit para máxima performance nos treinos.",
          featured: false,
        },
        {
          id: "5",
          name: "Vintage Olive",
          price: 84.9,
          originalPrice: 109.9, // Para mostrar desconto
          images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
          category: "promocao",
          sizes: ["M", "G", "GG", "XG"],
          colors: ["Verde Oliva"],
          description: "Estilo vintage com lavagem especial e corte confortável.",
          featured: false,
        },
        {
          id: "6",
          name: "Exclusive Red",
          price: 109.9,
          images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
          category: "limitada",
          sizes: ["P", "M", "G"],
          colors: ["Vermelho"],
          description: "Peça exclusiva com design diferenciado e acabamento premium.",
          featured: false,
        },
      ]
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
    }
  }, [])

  useEffect(() => {
    let filtered = products

    // Filtrar por categoria
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchTerm])

  const featuredProducts = products.filter((product) => product.featured)

  const getCategoryBadge = (category: string) => {
    const badges = {
      novo: { text: "NOVO", variant: "default" as const },
      limitada: { text: "LIMITADA", variant: "destructive" as const },
      promocao: { text: "PROMOÇÃO", variant: "secondary" as const },
    }
    return badges[category as keyof typeof badges] || { text: category.toUpperCase(), variant: "outline" as const }
  }

  const handleWhatsAppContact = (product?: Product, color?: string, size?: string) => {
    const businessHoursInfo = isBusinessHours()
      ? "Estamos online agora! 🟢"
      : "Estamos fora do horário de atendimento, mas responderemos em breve! 🟡\n\nHorário de Atendimento:\n📅 Segunda a Sexta: 8h às 18h\n📅 Sábado: 8h às 14h\n📅 Domingo: Fechado\n\n"

    let baseMessage = ""

    if (product) {
      // Mensagem específica do produto com informações de desconto
      const discountInfo = product.originalPrice
        ? ` (${calculateDiscount(product.price, product.originalPrice)}% OFF - De R$ ${product.originalPrice.toFixed(2).replace(".", ",")} por R$ ${product.price.toFixed(2).replace(".", ",")})`
        : ` (R$ ${product.price.toFixed(2).replace(".", ",")})`

      const colorInfo = color ? `\n🎨 Cor: ${color}` : ""
      const sizeInfo = size ? `\n📏 Tamanho: ${size}` : ""

      baseMessage = `${businessHoursInfo}\n\nOlá! Tenho interesse na camiseta ${product.name}${discountInfo}.${colorInfo}${sizeInfo}\n\nGostaria de mais informações sobre disponibilidade e formas de pagamento.`
    } else {
      // Mensagem geral
      baseMessage = `${businessHoursInfo}\n\nOlá! Gostaria de conhecer mais sobre os produtos AKRON.`
    }

    const whatsappUrl = `https://wa.me/5581991103194?text=${encodeURIComponent(baseMessage)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleBuyProduct = (product: Product) => {
    // Se o produto tem múltiplas cores ou tamanhos, abrir modal para seleção
    if (product.colors.length > 1 || product.sizes.length > 1) {
      setSelectedProduct(product)
      setSelectedImageIndex(0)
      setZoomLevel(1)
      setSelectedColor(product.colors[0] || "")
      setSelectedSize(product.sizes[0] || "")
    } else {
      // Se só tem uma opção, comprar diretamente
      handleWhatsAppContact(product, product.colors[0], product.sizes[0])
    }
  }

  const handleFinalizePurchase = () => {
    if (selectedProduct && selectedColor && selectedSize) {
      handleWhatsAppContact(selectedProduct, selectedColor, selectedSize)
      // Limpar estados do modal
      setSelectedProduct(null)
      setSelectedColor("")
      setSelectedSize("")
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const businessHoursInfo = isBusinessHours()
      ? "Estamos online agora! 🟢"
      : "Estamos fora do horário de atendimento, mas responderemos em breve! 🟡"

    const message = `${businessHoursInfo}\n\nContato via site AKRON:\nNome: ${contactForm.name}\nEmail: ${contactForm.email}\nMensagem: ${contactForm.message}`
    const whatsappUrl = `https://wa.me/5581991103194?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setContactForm({ name: "", email: "", message: "" }) // Limpar formulário
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const businessHoursInfo = isBusinessHours()
      ? "Estamos online agora! 🟢"
      : "Estamos fora do horário de atendimento, mas responderemos em breve! 🟡"

    const message = `${businessHoursInfo}\n\nNewsletter AKRON - Novo cadastro:\nEmail: ${newsletterEmail}`
    const whatsappUrl = `https://wa.me/5581991103194?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setNewsletterEmail("") // Limpar campo
  }

  const resetZoom = () => setZoomLevel(1)
  const zoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  const zoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))

  return (
    <div className="min-min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between tracking-normal border-0">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Image
                src="/akron-logo-oficial.png?v=2"
                alt="AKRON Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-gray-600 font-medium text-slate-300">
                Início
              </a>
              <a href="#collection" className="hover:text-gray-600 font-medium text-slate-300">
                Coleção
              </a>
              <a href="#catalog" className="hover:text-gray-600 font-medium text-slate-300">
                Catálogo
              </a>
              <a href="#contact" className="hover:text-gray-600 font-medium text-slate-300">
                Contato
              </a>
            </nav>

            {/* Botões de ação */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <Button onClick={() => handleWhatsAppContact()} className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <span className="text-xs text-slate-400 mt-1 hidden md:block">{getBusinessHoursMessage()}</span>
              </div>
              {/* Menu Mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {showMobileMenu && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-900 hover:text-gray-600 font-medium">
                  Início
                </a>
                <a href="#collection" className="text-gray-900 hover:text-gray-600 font-medium">
                  Coleção
                </a>
                <a href="#catalog" className="text-gray-900 hover:text-gray-600 font-medium">
                  Catálogo
                </a>
                <a href="#contact" className="text-gray-900 hover:text-gray-600 font-medium">
                  Contato
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-auto">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroContent.image || "/placeholder.svg"}
            alt="AKRON Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-wider">{heroContent.title}</h1>
          <p className="text-xl md:text-2xl mb-8 font-light">{heroContent.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Modelos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 bg-transparent"
              onClick={() => handleWhatsAppContact()}
            >
              Falar Conosco
            </Button>
          </div>
        </div>
      </section>

      <section id="collection" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Coleção Destaque</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
              Nossas peças mais populares, desenvolvidas especialmente para quem busca conforto e estilo
            </p>
          </div>

          {/* Grid de produtos em destaque */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-auto hover:shadow-xl transition-all duration-300 my-0 py-4"
              >
                <CardContent className="p-0 px-0">
                  <div className="relative overflow-auto mx-3.5 px-0">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Badge da categoria */}
                    <div className="absolute top-4 left-4 px-0 mx-0">
                      <Badge className="mx-0" variant={getCategoryBadge(product.category).variant}>
                        {getCategoryBadge(product.category).text}
                      </Badge>
                    </div>
                    {/* Badge de desconto */}
                    {product.originalPrice && calculateDiscount(product.price, product.originalPrice) > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="animate-pulse">
                          -{calculateDiscount(product.price, product.originalPrice)}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 leading-7 font-sans">{product.description}</p>

                    {/* Preços */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 mb-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product)
                              setSelectedImageIndex(0)
                              setZoomLevel(1)
                              setSelectedColor(product.colors[0] || "")
                              setSelectedSize(product.sizes[0] || "")
                            }}
                          >
                            Ver Imagens
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button className="flex-1 bg-black hover:bg-gray-800" onClick={() => handleBuyProduct(product)}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar
                      </Button>
                    </div>

                    {/* Informações do produto */}
                    <div className="text-sm text-gray-500 font-sans">
                      Tamanhos: {product.sizes.join(", ")} | Cores: {product.colors.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Catálogo Completo</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-sans">
              Explore toda nossa coleção de camisetas oversized
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-sans"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="novo">Novos</SelectItem>
                <SelectItem value="limitada">Edição Limitada</SelectItem>
                <SelectItem value="promocao">Promoção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group overflow-auto hover:shadow-lg transition-all duration-300 py-4">
                <CardContent className="p-0">
                  <div className="relative overflow-auto mx-3.5">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant={getCategoryBadge(product.category).variant} className="text-xs">
                        {getCategoryBadge(product.category).text}
                      </Badge>
                    </div>
                    {product.originalPrice && calculateDiscount(product.price, product.originalPrice) > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          -{calculateDiscount(product.price, product.originalPrice)}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-green-600">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => {
                              setSelectedProduct(product)
                              setSelectedImageIndex(0)
                              setZoomLevel(1)
                              setSelectedColor(product.colors[0] || "")
                              setSelectedSize(product.sizes[0] || "")
                            }}
                          >
                            Ver
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      <Button
                        size="sm"
                        className="flex-1 bg-black hover:bg-gray-800"
                        onClick={() => handleBuyProduct(product)}
                      >
                        Comprar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Nenhum produto encontrado</p>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">Entre em Contato</h2>
              <p className="text-xl text-gray-600 font-sans">
                Dúvidas, sugestões ou quer saber mais sobre nossos produtos?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-6">Envie uma Mensagem</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <Input
                      className="font-sans shadow-sm"
                      placeholder="Seu nome"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      className="font-sans shadow-sm"
                      type="email"
                      placeholder="Seu e-mail"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    <Textarea
                      className="font-sans shadow-sm"
                      placeholder="Sua mensagem"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                      required
                    />
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Enviar via WhatsApp
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                {/* Horário de atendimento */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Horário de Atendimento
                    </h3>
                    <div className="space-y-3 font-sans">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Segunda a Sexta:</span>
                        <span className="font-semibold">8h às 18h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Sábado:</span>
                        <span className="font-semibold">8h às 14h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Domingo:</span>
                        <span className="font-semibold text-red-600">Fechado</span>
                      </div>
                      {/* Status atual do atendimento */}
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${isBusinessHours() ? "bg-green-500" : "bg-yellow-500"}`}
                          ></div>
                          <span className="text-sm font-medium">
                            {isBusinessHours() ? "Atendimento Online Agora" : "Fora do Horário de Atendimento"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {isBusinessHours()
                            ? "Resposta imediata via WhatsApp"
                            : "Envie sua mensagem que responderemos em breve"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">Newsletter</h3>
                    <p className="text-gray-600 mb-6 font-sans">Receba novidades, lançamentos e ofertas exclusivas</p>
                    <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                      <Input
                        className="font-sans shadow-sm"
                        type="email"
                        placeholder="Seu e-mail"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full">
                        Cadastrar
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Redes sociais */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">Redes Sociais</h3>
                    <div className="flex space-x-4">
                      <Button className="shadow-sm bg-transparent" variant="outline" size="icon">
                        <Instagram className="h-5 w-5" />
                      </Button>
                      <Button className="shadow-sm bg-transparent" variant="outline" size="icon">
                        <Facebook className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-green-600 text-white border-green-600 hover:bg-green-700 shadow-sm"
                        onClick={() => handleWhatsAppContact()}
                      >
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/akron-logo-oficial.png?v=2"
                alt="AKRON Logo"
                width={120}
                height={40}
                className="h-8 w-auto mb-4"
              />
              <p className="text-gray-400 font-sans">
                Camisetas oversized de qualidade para treino e lifestyle urbano.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li>
                  <a href="#home" className="hover:text-white">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#collection" className="hover:text-white">
                    Coleção
                  </a>
                </li>
                <li>
                  <a href="#catalog" className="hover:text-white">
                    Catálogo
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horário de Atendimento</h4>
              <ul className="space-y-2 text-gray-400 font-sans text-sm">
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Seg-Sex: 8h às 18h
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Sábado: 8h às 14h
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Domingo: Fechado
                </li>
                <li className="flex items-center mt-3">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${isBusinessHours() ? "bg-green-500" : "bg-yellow-500"}`}
                  ></div>
                  <span className="text-xs">{isBusinessHours() ? "Online Agora" : "Fora do Horário"}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400 font-sans">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  (81) 9110-3194
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  contato@akron.com.br
                </li>
                <li className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2" />
                  @akron_oficial
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p className="font-sans">&copy; 2024 AKRON. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Área da imagem com controles de zoom */}
              <div className="relative">
                <div className="relative overflow-auto rounded-lg bg-gray-100">
                  <Image
                    src={selectedProduct.images[selectedImageIndex] || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    width={600}
                    height={600}
                    className="w-full h-96 object-cover transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />
                </div>

                {/* Controles de zoom */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="icon" variant="secondary" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={resetZoom}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {/* Miniaturas das imagens */}
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-16 h-16 rounded border-2 overflow-auto ${
                          selectedImageIndex === index ? "border-black" : "border-gray-300"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do produto e seleção */}
              <div className="space-y-4">
                <div>
                  <Badge variant={getCategoryBadge(selectedProduct.category).variant} className="mb-2">
                    {getCategoryBadge(selectedProduct.category).text}
                  </Badge>
                  {selectedProduct.originalPrice &&
                    calculateDiscount(selectedProduct.price, selectedProduct.originalPrice) > 0 && (
                      <Badge variant="destructive" className="mb-2 ml-2 animate-pulse">
                        -{calculateDiscount(selectedProduct.price, selectedProduct.originalPrice)}% OFF
                      </Badge>
                    )}
                  <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">
                    R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      R$ {selectedProduct.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>

                <p className="text-gray-600">{selectedProduct.description}</p>

                {/* Seleção de tamanho */}
                {selectedProduct.sizes.length > 1 && (
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Escolha o Tamanho:</Label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.sizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Seleção de cor */}
                {selectedProduct.colors.length > 1 && (
                  <div>
                    <Label className="text-base font-semibold mb-2 block">Escolha a Cor:</Label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a cor" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Mostrar seleções quando há apenas uma opção */}
                {selectedProduct.sizes.length === 1 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tamanho:</h4>
                    <Badge variant="outline">{selectedProduct.sizes[0]}</Badge>
                  </div>
                )}

                {selectedProduct.colors.length === 1 && (
                  <div>
                    <h4 className="font-semibold mb-2">Cor:</h4>
                    <Badge variant="outline">{selectedProduct.colors[0]}</Badge>
                  </div>
                )}

                {/* Informações de horário comercial */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${isBusinessHours() ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-sm font-medium">
                      {isBusinessHours() ? "Atendimento Online Agora" : "Fora do Horário de Atendimento"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {isBusinessHours()
                      ? "Resposta imediata via WhatsApp"
                      : "Seg-Sex: 8h-18h | Sáb: 8h-14h | Dom: Fechado"}
                  </p>
                </div>

                {/* Botão de compra */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  onClick={handleFinalizePurchase}
                  disabled={!selectedColor || !selectedSize}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {!selectedColor || !selectedSize ? "Selecione Cor e Tamanho" : "Comprar via WhatsApp"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
