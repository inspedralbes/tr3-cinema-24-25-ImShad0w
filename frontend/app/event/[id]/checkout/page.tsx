"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Ticket, User, Mail } from "lucide-react"

const API_BASE_URL = "http://localhost:8000/api"

type Event = {
  id: number
  title: string
  description: string
  location: string
  date: string
}

function CheckoutContent({ eventId }: { eventId: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  const [fetchingEvent, setFetchingEvent] = useState(true)

  const seatIdsParam = searchParams.get("seats")
  const seatIds = seatIdsParam ? seatIdsParam.split(",").map(Number) : []

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  useEffect(() => {
    if (seatIds.length === 0) {
      router.push("/")
      return
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/event/${eventId}`)
        if (!response.ok) throw new Error("Error en carregar l'esdeveniment")
        const data = await response.json()
        setEvent(data.data?.event || data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error inesperat")
      } finally {
        setFetchingEvent(false)
      }
    }

    fetchEvent()
  }, [eventId, seatIds.length, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/seats/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seat_ids: seatIds,
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error en comprar les entrades")
      }

      router.push(`/event/${eventId}/success?seats=${seatIds.length}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperat")
    } finally {
      setLoading(false)
    }
  }

  if (fetchingEvent) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Carregant...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link 
          href={`/event/${eventId}/reserve`}
          className="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-[#fafafa] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tornar
        </Link>

        <h1 className="text-3xl font-bold text-[#fafafa] mb-2">
          Checkout
        </h1>
        
        <p className="text-[#71717a] mb-8">
          Completxa les teves dades per comprar les entrades
        </p>

        {event && (
          <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Ticket className="w-5 h-5 text-[#f59e0b]" />
              <span className="text-[#fafafa] font-medium">{event.title}</span>
            </div>
            <div className="text-[#a1a1aa] text-sm">
              <p>{event.location}</p>
              <p>{new Date(event.date).toLocaleDateString("ca-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}</p>
              <p className="mt-2 text-[#f59e0b]">{seatIds.length} entrades</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-[#fafafa] font-medium mb-2">
              Nom complet
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg pl-12 pr-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b]"
                placeholder="El teu nom"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-[#fafafa] font-medium mb-2">
              Correu electrònic
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#71717a]" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg pl-12 pr-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b]"
                placeholder="el.teu@email.com"
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold py-3"
            >
              {loading ? "Processant..." : "Comprar ara"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const [eventId, setEventId] = useState<string | null>(null)

  useEffect(() => {
    params.then((resolved) => {
      setEventId(resolved.id)
    })
  }, [params])

  if (!eventId) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Carregant...</div>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Carregant...</div>
      </div>
    }>
      <CheckoutContent eventId={eventId} />
    </Suspense>
  )
}
