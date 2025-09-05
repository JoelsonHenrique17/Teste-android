"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Componentes UI do shadcn/ui
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Ícones do Lucide React
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  Settings,
  ShoppingBag,
  ImageIcon,
  LogOut,
  BarChart3,
  TrendingUp,
  Package,
  Star,
  Zap,
  Activity,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number // Para sistema de desconto automático
  images: string[]
  category: "novo" | "limitada" | "promocao"
  sizes: string[]
  colors: string[]
  description: string
  featured: boolean // Se aparece na seção destaque
}

interface HeroContent {
  title: string
  subtitle: string
  image: string
  logo: string
}

export default function AdminPanel() {
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginPassword, setLoginPassword] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "AKRON",
    subtitle: "Camisetas Oversized para Treino e Lifestyle",
    image: "/placeholder-nji2c.png",
    logo: "/akron-logo-oficial.png",
  })

  // Estados para edição de produtos
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    originalPrice: undefined,
    images: [""],
    category: "novo",
    sizes: [],
    colors: [""],
    description: "",
    featured: false,
  })

  useEffect(() => {
    const savedProducts = localStorage.getItem("akron_products")
    const savedHero = localStorage.getItem("akron_hero")
    const authStatus = localStorage.getItem("akron_admin_auth")

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    }
    if (savedHero) {
      setHeroContent(JSON.parse(savedHero))
    }
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts)
    localStorage.setItem("akron_products", JSON.stringify(updatedProducts))
  }

  const saveHeroContent = (updatedHero: HeroContent) => {
    setHeroContent(updatedHero)
    localStorage.setItem("akron_hero", JSON.stringify(updatedHero))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginPassword === "akron2024") {
      setIsAuthenticated(true)
      localStorage.setItem("akron_admin_auth", "true")
    } else {
      alert("Senha incorreta!")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("akron_admin_auth")
    router.push("/")
  }

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Nome e preço são obrigatórios!")
      return
    }

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: newProduct.name!,
      price: newProduct.price!,
      originalPrice: newProduct.originalPrice,
      images: newProduct.images?.filter((img) => img.trim()) || [],
      category: newProduct.category as "novo" | "limitada" | "promocao",
      sizes: newProduct.sizes || [],
      colors: newProduct.colors?.filter((color) => color.trim()) || [],
      description: newProduct.description || "",
      featured: newProduct.featured || false,
    }

    let updatedProducts
    if (editingProduct) {
      // Editando produto existente
      updatedProducts = products.map((p) => (p.id === editingProduct.id ? productData : p))
    } else {
      // Adicionando novo produto
      updatedProducts = [...products, productData]
    }

    saveProducts(updatedProducts)
    // Limpar formulário e fechar modal
    setShowProductDialog(false)
    setEditingProduct(null)
    setNewProduct({
      name: "",
      price: 0,
      originalPrice: undefined,
      images: [""],
      category: "novo",
      sizes: [],
      colors: [""],
      description: "",
      featured: false,
    })
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      const updatedProducts = products.filter((p) => p.id !== id)
      saveProducts(updatedProducts)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct({
      ...product,
      images: product.images.length > 0 ? product.images : [""],
    })
    setShowProductDialog(true)
  }

  const addImageField = () => {
    setNewProduct((prev) => ({
      ...prev,
      images: [...(prev.images || []), ""],
    }))
  }

  const removeImageField = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }))
  }

  const addColorField = () => {
    setNewProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), ""],
    }))
  }

  const removeColorField = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index),
    }))
  }

  const toggleSize = (size: string) => {
    setNewProduct((prev) => {
      const sizes = prev.sizes || []
      const newSizes = sizes.includes(size) ? sizes.filter((s) => s !== size) : [...sizes, size]
      return { ...prev, sizes: newSizes }
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-black font-bold">Admin AKRON</CardTitle>
            <p className="text-gray-600">Painel de Gestão</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Senha de administrador"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="shadow-sm"
              />
              <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700">
                <Activity className="h-4 w-4 mr-2" />
                Acessar Sistema
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AKRON Admin</h1>
                <p className="text-white/80 text-sm">Sistema de Gestão</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Produtos</p>
                  <p className="text-3xl font-bold text-black">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Destaque</p>
                  <p className="text-3xl font-bold text-green-600">{products.filter((p) => p.featured).length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Novos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {products.filter((p) => p.category === "novo").length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Promoções</p>
                  <p className="text-3xl font-bold text-red-600">
                    {products.filter((p) => p.category === "promocao").length}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm border">
            <TabsTrigger value="products" className="data-[state=active]:bg-black data-[state=active]:text-white">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="hero" className="data-[state=active]:bg-black data-[state=active]:text-white">
              <ImageIcon className="h-4 w-4 mr-2" />
              Hero Section
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-black data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-black">Gerenciar Produtos</h2>
                <p className="text-gray-600">Controle total do seu catálogo</p>
              </div>
              {/* Modal para adicionar/editar produto */}
              <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingProduct(null)
                      setNewProduct({
                        name: "",
                        price: 0,
                        originalPrice: undefined,
                        images: [""],
                        category: "novo",
                        sizes: [],
                        colors: [""],
                        description: "",
                        featured: false,
                      })
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl text-black">
                      {editingProduct ? "Editar Produto" : "Novo Produto"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Produto</Label>
                        <Input
                          value={newProduct.name || ""}
                          onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Nome do produto"
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct((prev) => ({ ...prev, category: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="novo">Novo</SelectItem>
                            <SelectItem value="limitada">Edição Limitada</SelectItem>
                            <SelectItem value="promocao">Promoção</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Campos de preço */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newProduct.price || ""}
                          onChange={(e) =>
                            setNewProduct((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>Preço Original (R$) - Para Desconto</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={newProduct.originalPrice || ""}
                          onChange={(e) =>
                            setNewProduct((prev) => ({
                              ...prev,
                              originalPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                            }))
                          }
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={newProduct.description || ""}
                        onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição do produto"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Imagens (URLs)</Label>
                      {newProduct.images?.map((image, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={image}
                            onChange={(e) => {
                              const newImages = [...(newProduct.images || [])]
                              newImages[index] = e.target.value
                              setNewProduct((prev) => ({ ...prev, images: newImages }))
                            }}
                            placeholder="URL da imagem"
                          />
                          {newProduct.images!.length > 1 && (
                            <Button type="button" variant="outline" size="icon" onClick={() => removeImageField(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addImageField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Imagem
                      </Button>
                    </div>

                    <div>
                      <Label>Cores</Label>
                      {newProduct.colors?.map((color, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(newProduct.colors || [])]
                              newColors[index] = e.target.value
                              setNewProduct((prev) => ({ ...prev, colors: newColors }))
                            }}
                            placeholder="Nome da cor"
                          />
                          {newProduct.colors!.length > 1 && (
                            <Button type="button" variant="outline" size="icon" onClick={() => removeColorField(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={addColorField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Cor
                      </Button>
                    </div>

                    <div>
                      <Label>Tamanhos</Label>
                      <div className="flex gap-2 mt-2">
                        {["P", "M", "G", "GG", "XG"].map((size) => (
                          <Button
                            key={size}
                            type="button"
                            variant={newProduct.sizes?.includes(size) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSize(size)}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Switch para produto em destaque */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newProduct.featured || false}
                        onCheckedChange={(checked) => setNewProduct((prev) => ({ ...prev, featured: checked }))}
                      />
                      <Label>Produto em destaque</Label>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveProduct} className="flex-1 bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setShowProductDialog(false)} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {products.map((product, index) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Imagem do produto */}
                      <div className="w-24 h-24 relative rounded-lg overflow-auto bg-gray-100 border">
                        {product.images[0] && (
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-semibold">{product.name}</h3>
                              <Badge
                                variant={
                                  product.category === "novo"
                                    ? "default"
                                    : product.category === "limitada"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {product.category.toUpperCase()}
                              </Badge>
                              {product.featured && (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  DESTAQUE
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">{product.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Tamanhos: {product.sizes.join(", ")}</span>
                              <span>Cores: {product.colors.join(", ")}</span>
                            </div>
                          </div>

                          {/* Preços */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-600 line-through">
                                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Botões de ação */}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="hover:bg-black hover:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deletar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hero" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-black">Configurar Hero Section</h2>
              <p className="text-gray-600">Personalize a primeira impressão dos visitantes</p>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  Conteúdo Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título Principal</Label>
                  <Input
                    value={heroContent.title}
                    onChange={(e) => setHeroContent((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="AKRON"
                  />
                </div>

                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={heroContent.subtitle}
                    onChange={(e) => setHeroContent((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Camisetas Oversized para Treino e Lifestyle"
                  />
                </div>

                <div>
                  <Label>URL da Imagem de Fundo</Label>
                  <Input
                    value={heroContent.image}
                    onChange={(e) => setHeroContent((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="URL da imagem"
                  />
                </div>

                <div>
                  <Label>URL do Logo</Label>
                  <Input
                    value={heroContent.logo}
                    onChange={(e) => setHeroContent((prev) => ({ ...prev, logo: e.target.value }))}
                    placeholder="URL do logo"
                  />
                </div>

                <Button onClick={() => saveHeroContent(heroContent)} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-black">Configurações</h2>
              <p className="text-gray-600">Ferramentas de gestão do sistema</p>
            </div>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Ações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const data = {
                      products,
                      heroContent,
                      exportDate: new Date().toISOString(),
                    }
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = "akron-backup.json"
                    a.click()
                  }}
                  className="w-full hover:bg-green-600 hover:text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Exportar Dados
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.")) {
                      localStorage.removeItem("akron_products")
                      localStorage.removeItem("akron_hero")
                      setProducts([])
                      setHeroContent({
                        title: "AKRON",
                        subtitle: "Camisetas Oversized para Treino e Lifestyle",
                        image: "/placeholder-nji2c.png",
                        logo: "/akron-logo-oficial.png",
                      })
                    }
                  }}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Todos os Dados
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
