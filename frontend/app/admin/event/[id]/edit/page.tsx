"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const API_BASE_URL = "http://localhost:8000/api"

type Event = {
  id: number
  title: string
  description: string
  location: string
  date: string
  seats_count: number
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [eventId, setEventId] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    seats_count: 50,
  })

  useEffect(() => {
    params.then((resolvedParams) => {
      setEventId(resolvedParams.id)
      fetchEvent(resolvedParams.id)
    })
  }, [params])

  const fetchEvent = async (id: string) => {
    setFetching(true)
    try {
      const response = await fetch(`${API_BASE_URL}/event/${id}`)
      if (!response.ok) {
        throw new Error("Error en carregar l'esdeveniment")
      }
      const data = await response.json()
      const event = data.data || data
      
      const formattedDate = event.date 
        ? new Date(event.date).toISOString().slice(0, 16)
        : ""

      setFormData({
        title: event.title || "",
        description: event.description || "",
        location: event.location || "",
        date: formattedDate,
        seats_count: event.seats_count || 50,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperat")
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "seats_count" ? parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error en actualitzar l'esdeveniment")
      }

      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperat")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Carregant esdeveniment...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <Link 
          href="/admin"
          className="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-[#fafafa] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tornar
        </Link>

        <h1 className="text-3xl font-bold text-[#fafafa] mb-8">
          Modificar Esdeveniment
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444] text-[#ef4444] px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-[#fafafa] font-medium mb-2">
              Titol
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg px-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-[#fafafa] font-medium mb-2">
              Descripció
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg px-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b] resize-none"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-[#fafafa] font-medium mb-2">
              Ubicació
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg px-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-[#fafafa] font-medium mb-2">
              Data
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg px-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div>
            <label htmlFor="seats_count" className="block text-[#fafafa] font-medium mb-2">
              Nombre de places
            </label>
            <input
              type="number"
              id="seats_count"
              name="seats_count"
              value={formData.seats_count}
              onChange={handleChange}
              min={1}
              className="w-full bg-[#27272a] border border-[#3f3f46] rounded-lg px-4 py-3 text-[#fafafa] focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-[#18181b] font-semibold"
            >
              {loading ? "Guardant..." : "Guardar Canvis"}
            </Button>
            <Link href="/admin">
              <Button
                type="button"
                variant="ghost"
                className="text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#3f3f46]"
              >
                Cancel·lar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
