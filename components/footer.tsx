"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Logo } from "./logo"
import { Separator } from "./ui/separator"
import { Code, Download, Monitor, Smartphone, Lock, Instagram } from "lucide-react"
import { DevModalManager } from "./dev/dev-modal-manager"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Alert, AlertDescription } from "./ui/alert"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [isDevModalOpen, setIsDevModalOpen] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isPC, setIsPC] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Detectar se é PC
    const checkIsPC = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      setIsPC(!isMobile)
    }

    checkIsPC()

    // Capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleDownloadClick = async () => {
    if (deferredPrompt) {
      try {
        // Mostrar o prompt de instalação
        deferredPrompt.prompt()
        
        // Aguardar a resposta do usuário
        const { outcome } = await deferredPrompt.userChoice
        
        if (outcome === 'accepted') {
          console.log('CDforge instalado com sucesso!')
        } else {
          console.log('Usuário recusou a instalação')
        }
        
        // Limpar o prompt
        setDeferredPrompt(null)
      } catch (error) {
        console.error('Erro ao instalar:', error)
      }
    } else {
      // Se não há prompt disponível, mostrar instruções
      if (isPC) {
        alert(
          'Para instalar o CDforge no seu PC:\n\n' +
          '1. Clique no ícone de instalação (📥) na barra de endereços\n' +
          '2. Ou pressione Ctrl+Shift+I e clique em "Install"\n' +
          '3. Ou use o menu do navegador: Mais ferramentas > Criar atalho\n\n' +
          'O CDforge será instalado como um app nativo no seu PC!'
        )
      } else {
        alert(
          'Para instalar o CDforge no seu dispositivo:\n\n' +
          '1. Toque no botão Compartilhar (📤)\n' +
          '2. Selecione "Adicionar à Tela Inicial"\n' +
          '3. Confirme a instalação\n\n' +
          'O CDforge aparecerá como um app na sua tela inicial!'
        )
      }
    }
  }

  const footerLinks = {
    Serviços: [
      { href: "/categorias/bots", label: "Bots" },
      { href: "/categorias/sites", label: "Sites" },
      { href: "/categorias/personalizados", label: "Serviços Personalizados" },
    ],
    Empresa: [
      { href: "/sobre", label: "Sobre Nós" },
      { href: "/contato", label: "Contato" },
      { href: "/planos", label: "Planos" },
      { 
        href: "https://www.instagram.com/c0deforge?igsh=aW1ya2djeW9kbzZk&utm_source=qr", 
        label: "Nosso Instagram: c0deforge",
        external: true 
      },
    ],
    Suporte: [
      { href: "/faq", label: "FAQ" },
      { href: "/termos", label: "Termos de Uso" },
      { href: "/privacidade", label: "Política de Privacidade" },
    ],
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "1227") {
      setPasswordError("")
      setIsAuthenticated(true)
    } else {
      setPasswordError("Senha incorreta")
    }
  }

  const handleCopyUrl = async () => {
    const url = "https://wonderful-paprenjak-bad82c.netlify.app/"
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
        alert("URL copiada para a área de transferência!")
      } else {
        // Fallback method for older browsers or insecure contexts
        const textArea = document.createElement("textarea")
        textArea.value = url
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand("copy")
          alert("URL copiada para a área de transferência!")
        } catch (err) {
          // If both methods fail, show the URL in an alert
          alert(`Não foi possível copiar automaticamente. Copie manualmente:\n\n${url}`)
        } finally {
          textArea.remove()
        }
      }
    } catch (err) {
      // Final fallback - show URL in alert
      alert(`Não foi possível copiar automaticamente. Copie manualmente:\n\n${url}`)
    }
  }

  const handleRedirect = () => {
    window.open("https://wonderful-paprenjak-bad82c.netlify.app/", "_blank")
  }

  return (
    <>
      <footer className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <Logo size="md" variant="full" className="mb-4" />
              <p className="text-secondary-foreground/80 text-sm leading-relaxed mb-4">
                Especialistas em soluções digitais personalizadas. Transformamos suas ideias em realidade.
              </p>
              
              {/* Botão de Download PWA */}
              <Button
                onClick={handleDownloadClick}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm"
              >
                {isPC ? (
                  <>
                    <Monitor className="w-4 h-4 mr-2" />
                    <Download className="w-4 h-4 mr-2" />
                    Baixar CDforge para PC
                  </>
                ) : (
                  <>
                    <Smartphone className="w-4 h-4 mr-2" />
                    <Download className="w-4 h-4 mr-2" />
                    Baixar para meu dispositivo
                  </>
                )}
              </Button>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-serif font-bold text-lg mb-4 text-secondary-foreground">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors text-sm flex items-center gap-1"
                        >
                          <Instagram className="h-3 w-3" />
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                  {category === "Suporte" && (
                    <li>
                      <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors text-sm flex items-center gap-1"
                      >
                        <Lock className="h-3 w-3" />
                        Outros
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-secondary-foreground/20" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-foreground/80 text-sm">
              © 2024 CodeForge (CDforge). Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setIsDevModalOpen(true)}
                className="text-secondary-foreground/80 hover:text-accent transition-colors p-2 rounded-full hover:bg-secondary-foreground/10"
                title="Área DEV"
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* DEV Modal */}
      <DevModalManager 
        isOpen={isDevModalOpen} 
        onClose={() => setIsDevModalOpen(false)} 
      />

      {/* Password Modal */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-md bg-background border border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-foreground">Acesso Restrito</DialogTitle>
          </DialogHeader>
          
          {!isAuthenticated ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Digite a senha:</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                  }}
                  placeholder="Senha"
                  className="bg-background border-gray-700 text-foreground"
                />
              </div>
              
              {passwordError && (
                <Alert variant="destructive">
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Acessar
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-foreground">Acesso concedido! O que deseja fazer?</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleCopyUrl}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Copiar URL
                </Button>
                <Button 
                  onClick={handleRedirect}
                  variant="outline"
                  className="flex-1 border-gray-700 text-foreground hover:bg-accent"
                >
                  Abrir Link
                </Button>
              </div>
              <Button 
                onClick={() => {
                  setIsPasswordModalOpen(false)
                  setIsAuthenticated(false)
                  setPassword("")
                  setPasswordError("")
                }}
                variant="ghost"
                className="w-full text-foreground/80 hover:text-foreground"
              >
                Fechar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
