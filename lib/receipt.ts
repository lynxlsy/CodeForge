import { Timestamp } from 'firebase/firestore'

// Unified receipt model that both client and DEV areas will use
export interface ReceiptModel {
  // Order identification
  orderId: string
  createdAt: Date | Timestamp | null
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  
  // Customer information
  customer: {
    name: string
    email: string
    phone?: string
  }
  
  // Service details
  service: {
    title: string
    description: string
    category: string
    platform?: string
  }
  
  // Project specifications
  project: {
    complexity: 'basic' | 'intermediate' | 'advanced'
    timeline: 'urgent' | 'normal' | 'flexible'
    budget?: number
    deadline?: string
  }
  
  // Requirements and features
  requirements: string[]
  
  // Contact preferences
  contactMethod: 'email' | 'whatsapp'
  
  // Raw payload for complete data preservation
  rawPayload: any
  
  // Utility methods
  getFormattedDate(): string
  getBudgetDisplay(): string
  getStatusDisplay(): string
}

// Build receipt model from various data sources
export function buildReceiptModel(data: any): ReceiptModel {
  // Handle both Firebase Timestamp and regular Date
  const createdAt = data.createdAt 
    ? (data.createdAt instanceof Date 
        ? data.createdAt 
        : data.createdAt.toDate?.() || new Date(data.createdAt))
    : null

  // Extract customer info with fallbacks
  const customerName = data.client || data.customer?.name || data.name || 'Não informado'
  const customerEmail = data.email || data.customer?.email || 'Não informado'
  const customerPhone = data.phone || data.customer?.phone || data.contact || undefined

  // Extract service info
  const serviceTitle = data.project || data.service?.title || data.title || 'Serviço não especificado'
  const serviceDescription = data.description || data.service?.description || 'Sem descrição'
  const serviceCategory = data.category || data.service?.category || 'Não categorizado'
  const servicePlatform = data.platform || data.service?.platform || undefined

  // Extract project specs
  const complexity = data.complexity || data.project?.complexity || 'basic'
  const timeline = data.timeline || data.project?.timeline || 'normal'
  const budget = data.price || data.budget || data.project?.budget || undefined
  const deadline = data.deadline || data.project?.deadline || undefined

  // Extract requirements
  const requirements = Array.isArray(data.features || data.requirements) 
    ? (data.features || data.requirements)
    : []

  // Extract contact method
  const contactMethod = data.contactMethod || 'email'

  return {
    orderId: data.id || data.orderId || 'ID não disponível',
    createdAt,
    status: data.status || 'pending',
    
    customer: {
      name: customerName,
      email: customerEmail,
      phone: customerPhone
    },
    
    service: {
      title: serviceTitle,
      description: serviceDescription,
      category: serviceCategory,
      platform: servicePlatform
    },
    
    project: {
      complexity: complexity as 'basic' | 'intermediate' | 'advanced',
      timeline: timeline as 'urgent' | 'normal' | 'flexible',
      budget,
      deadline
    },
    
    requirements,
    contactMethod: contactMethod as 'email' | 'whatsapp',
    rawPayload: data,

    // Utility methods
    getFormattedDate(): string {
      if (!this.createdAt) return 'Data não disponível'
      // Handle Firebase Timestamp
      const timestampDate = this.createdAt instanceof Date 
        ? this.createdAt 
        : ('toDate' in this.createdAt ? this.createdAt.toDate() : new Date(this.createdAt))
      return timestampDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    getBudgetDisplay(): string {
      if (!this.project.budget) return 'Não informado'
      return `R$ ${this.project.budget.toLocaleString('pt-BR')}`
    },

    getStatusDisplay(): string {
      const statusMap: Record<string, string> = {
        'pending': 'Pendente',
        'approved': 'Aprovado',
        'in_progress': 'Em Progresso',
        'completed': 'Concluído',
        'cancelled': 'Cancelado'
      }
      return statusMap[this.status] || this.status
    }
  }
}

// Type guard to check if data is a valid receipt model
export function isValidReceiptModel(data: any): data is ReceiptModel {
  return data && 
         typeof data.orderId === 'string' &&
         typeof data.customer === 'object' &&
         typeof data.service === 'object' &&
         typeof data.project === 'object'
}