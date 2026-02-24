"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const API_BASE_URL = "http://localhost:8000/api"

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    seats_count: 50,
  })

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
      const response = await fetch(`${API_BASE_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Error en crear l'esdeveniment")
      }

      router.push("/admin")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperat")
    } finally {
      setLoading(false)
    }
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
          Crear Esdeveniment
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
              placeholder="Nom de l'esdeveniment"
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
              placeholder="Descripció de l'esdeveniment"
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
              placeholder="Lloc on es farà l'esdeveniment"
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
              {loading ? "Creant..." : "Crear Esdeveniment"}
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
