"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, AlertTriangle, FileText, Send, Check } from "lucide-react"
import { ParticlesBackground } from "@/components/particles-background"
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function FormsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
    requirements: [] as string[],
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const serviceCategories = [
    { value: 'bots', label: 'Bots (Discord, Telegram, etc)' },
    { value: 'websites', label: 'Websites e Landing Pages' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'mobile', label: 'Aplicativos Mobile' },
    { value: 'api', label: 'APIs e Integrações' },
    { value: 'consulting', label: 'Consultoria Técnica' },
    { value: 'other', label: 'Outro' }
  ]
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create complete order data
      const orderData = {
        status: 'pending',
        source: 'service_request',
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        summary: {
          title: formData.service,
          description: formData.description,
          category: formData.category,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          deadline: formData.deadline
        },
        requirements: formData.requirements,
        rawPayload: formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'orders'), orderData)
      console.log('Pedido criado com ID:', docRef.id)
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      alert('Erro ao enviar o pedido. Por favor, tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        <ParticlesBackground particleCount={40} />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-green-600/10" />
        
        <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                  Pedido Enviado!
                </h1>
                <p className="text-xs text-green-400 hidden sm:block">Recebemos sua solicitação</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
            <Card className="bg-[#141414]/95 backdrop-blur-xl border border-[#262626] shadow-2xl max-w-2xl w-full animate-in slide-in-from-bottom-6 duration-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5 rounded-lg" />
              
              <CardHeader className="text-center relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent mb-3 font-serif">
                  Pedido Recebido com Sucesso!
                </CardTitle>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Sua solicitação foi registrada em nosso sistema. Entraremos em contato em breve.
                </p>
              </CardHeader>
              
              <CardContent className="text-center space-y-6 relative z-10">
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm">
                  <p className="text-green-300 font-medium text-lg">
                    ID do Pedido: <span className="font-mono font-bold">{Date.now()}</span>
                  </p>
                </div>
                
                <div className="pt-4 border-t border-[#333]">
                  <Button
                    onClick={() => window.history.back()}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-8 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticlesBackground particleCount={40} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-600/10" />
      
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Solicitar Serviço
              </h1>
              <p className="text-xs text-blue-400 hidden sm:block">Preencha o formulário abaixo</p>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="bg-[#141414]/95 backdrop-blur-xl border border-[#262626] shadow-2xl animate-in slide-in-from-bottom-6 duration-1000">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 rounded-lg" />
          
          <CardHeader className="relative z-10 text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-2 font-serif">
              Detalhe seu Projeto
            </CardTitle>
            <p className="text-gray-400">Preencha todas as informações para que possamos entender melhor suas necessidades</p>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-300">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Telefone (opcional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="service" className="text-gray-300">Serviço Desejado *</Label>
                  <Input
                    id="service"
                    value={formData.service}
                    onChange={(e) => handleInputChange('service', e.target.value)}
                    placeholder="Ex: Desenvolvimento de bot para Discord"
                    required
                    className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-300">Categoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="bg-[#1f1f1f] border-[#333] text-white focus:border-blue-500">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">Descrição Detalhada *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva detalhadamente o que você precisa. Quanto mais informações, melhor poderemos atender sua demanda."
                  rows={5}
                  required
                  className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-gray-300">Orçamento Estimado (R$) (opcional)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="Ex: 5000"
                    className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-gray-300">Prazo Desejado (opcional)</Label>
                  <Input
                    id="deadline"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    placeholder="Ex: 30 dias, urgente, flexível"
                    className="bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t border-[#333]">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 rounded-xl hover:scale-[1.02] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Solicitação
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

