"use client"

import { useState, useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { 
  signInWithGoogle, 
  signOutUser
} from "@/lib/auth"
import { addReview, listReviews, type Review } from "@/lib/reviews"
import { StarRating } from "@/components/ui/star-rating"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { 
  Mail, 
  Lock, 
  Star, 
  Send, 
  LogOut, 
  User, 
  Calendar,
  Loader2
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function CriticasPage() {
  const [user, loading] = useAuthState(auth)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Auth form state
  const [authError, setAuthError] = useState("")
  
  // Review form state
  const [service, setService] = useState("")
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [reviewError, setReviewError] = useState("")
  
  const { toast } = useToast()

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true)
      const fetchedReviews = await listReviews(20)
      setReviews(fetchedReviews)
      setIsLoading(false)
    }
    
    loadReviews()
  }, [])

  const handleGoogleSignIn = async () => {
    setAuthError("")
    const result = await signInWithGoogle()
    if (!result.success) {
      setAuthError(result.error || "Erro ao fazer login com Google")
    } else {
      console.log('✅ Google login completed, user:', result.user);
      toast({
        title: "Sucesso!",
        description: "Login realizado com Google",
      })
    }
  }

  const handleSubmitReview = async () => {
    setReviewError("")
    
    if (!service.trim()) {
      setReviewError("Informe o serviço")
      return
    }
    
    if (rating === 0) {
      setReviewError("Selecione uma avaliação")
      return
    }
    
    if (!message.trim()) {
      setReviewError("Escreva sua crítica")
      return
    }
    
    if (!user?.uid) {
      setReviewError("Faça login para enviar")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await addReview({
        service: service.trim(),
        rating,
        message: message.trim(),
        user: {
          uid: user.uid,
          email: user.email ?? '',
          name: user.displayName ?? (user.email ? user.email.split('@')[0] : 'Usuário'),
          photoURL: user.photoURL ?? undefined
        }
      })
      
      if (result.success) {
        toast({
          title: "Crítica enviada!",
          description: "Sua avaliação foi registrada com sucesso",
        })
        
        // Reset form
        setService("")
        setRating(0)
        setMessage("")
        
        // Refresh reviews
        const updatedReviews = await listReviews(20)
        setReviews(updatedReviews)
      } else {
        setReviewError(result.error || "Erro ao enviar crítica")
      }
    } catch (error: any) {
      console.error('Erro ao enviar crítica:', error)
      setReviewError(error.message || "Erro desconhecido ao enviar crítica")
      toast({
        title: "Erro",
        description: error.message || "Falha ao enviar crítica",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    const result = await signOutUser()
    if (result.success) {
      toast({
        title: "Desconectado",
        description: "Você saiu da sua conta",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            Críticas e Avaliações
          </h1>
          <p className="text-lg text-muted-foreground">
            Compartilhe sua experiência com nossos serviços
          </p>
        </div>

        {!user ? (
          // Login Section
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Entrar para avaliar
              </CardTitle>
              <CardDescription>
                Faça login para enviar sua crítica e avaliação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-6">
                  Faça login com Google para enviar sua crítica
                </p>
                <Button 
                  onClick={handleGoogleSignIn}
                  className="mx-auto"
                  variant="outline"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Entrar com Google
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Review Form Section
          <Card className="mb-12">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={authUser?.photoURL || undefined} />
                    <AvatarFallback>
                      {authUser?.displayName?.charAt(0) || authUser?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {authUser?.displayName || authUser?.email}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{authUser?.email}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium">
                    Serviço *
                  </label>
                  <Input
                    id="service"
                    placeholder="Qual serviço você utilizou?"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Avaliação *
                  </label>
                  <StarRating 
                    value={rating} 
                    onChange={setRating} 
                    size="lg" 
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Crítica *
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Compartilhe sua experiência..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                {reviewError && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {reviewError}
                  </div>
                )}

                <Button 
                  onClick={handleSubmitReview}
                  className="w-full"
                  disabled={isSubmitting || !service.trim() || rating === 0 || !message.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Crítica
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Últimas Avaliações
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma avaliação cadastrada ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.user.photoURL || undefined} />
                          <AvatarFallback>
                            {review.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{review.user.name}</h3>
                          <p className="text-sm text-muted-foreground">{review.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <StarRating value={review.rating} readonly size="sm" />
                          <span className="text-sm font-medium">{review.rating}/5</span>
                        </div>
                        {review.createdAt && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(review.createdAt.toDate()), "dd/MM/yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-primary">{review.service}</h4>
                      <p className="text-muted-foreground">{review.message}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}