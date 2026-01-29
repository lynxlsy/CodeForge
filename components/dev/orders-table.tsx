'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { buildReceiptModel, type ReceiptModel } from '@/lib/receipt'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function OrdersTable() {
  const [orders, setOrders] = useState<ReceiptModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!db) {
          throw new Error('Firebase não está disponível')
        }
        
        const ordersRef = collection(db, 'orders')
        const q = query(ordersRef, orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        
        const ordersData: ReceiptModel[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          const receipt = buildReceiptModel({
            ...data,
            id: doc.id,
            createdAt: data.createdAt
          })
          ordersData.push(receipt)
        })
        
        setOrders(ordersData)
      } catch (err) {
        console.error('Erro ao buscar pedidos:', err)
        setError('Erro ao carregar pedidos')
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-purple-100 text-purple-800'
    }
    
    const displayStatus = {
      'approved': 'Aprovado',
      'pending': 'Pendente',
      'cancelled': 'Cancelado',
      'in_progress': 'Em Progresso',
      'completed': 'Concluído'
    }[status] || status
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {displayStatus}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityColors: Record<string, string> = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    }
    
    const displayPriority = {
      'high': 'Alta',
      'medium': 'Média',
      'low': 'Baixa'
    }[priority] || priority
    
    return (
      <Badge className={priorityColors[priority] || 'bg-gray-100 text-gray-800'}>
        {displayPriority}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando pedidos...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erro: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                {/* Header com informações básicas */}
                <div className="bg-muted/50 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">ID do Pedido</p>
                    <p className="font-mono font-medium">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data/Hora</p>
                    <p className="font-medium">
                      {order.createdAt 
                        ? (typeof order.createdAt === 'object' && 'seconds' in order.createdAt
                            ? format(new Date((order.createdAt as any).seconds * 1000), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
                            : order.getFormattedDate())
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(order.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Categoria</p>
                    <p className="font-medium">{order.service.category || '—'}</p>
                  </div>
                </div>

                {/* Conteúdo detalhado */}
                <div className="p-6 space-y-6">
                  {/* Cliente e Projeto */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Cliente</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Nome</p>
                          <p className="font-medium">{order.customer.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{order.customer.email}</p>
                        </div>
                        {order.customer.phone && (
                          <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="font-medium">{order.customer.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Projeto</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Serviço</p>
                          <p className="font-medium">{order.service.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Categoria</p>
                          <p className="font-medium">{order.service.category}</p>
                        </div>
                        {order.service.description && (
                          <div>
                            <p className="text-sm text-muted-foreground">Descrição</p>
                            <p className="whitespace-pre-wrap">{order.service.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Valor e Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Financeiro</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Orçamento</p>
                          <p className="font-medium text-lg">{order.getBudgetDisplay()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Datas</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Prazo</p>
                          <p>{order.project.deadline || '—'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Complexidade</p>
                          <p className="capitalize">{order.project.complexity || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requisitos */}
                  {order.requirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Requisitos</h3>
                      <div className="flex flex-wrap gap-2">
                        {order.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Dados completos (raw) */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Dados Completos</h3>
                    <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto max-h-40 overflow-y-auto">
                      {JSON.stringify(order.rawPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}