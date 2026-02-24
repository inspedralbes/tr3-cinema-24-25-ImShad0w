"use client"

import Link from "next/link"
import AdminEventCard from "@/components/items/AdminEventCard"
import { useEvents } from "../../hooks/useEvents"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminPage() {
  const { events, loading, error, deleteEvent } = useEvents()

  const handleDelete = async (id: number) => {
    if (!confirm("Segur que vols eliminar aquest esdeveniment?")) return
    
    const success = await deleteEvent(id)
    if (!success) {
      alert("Error en eliminar l'esdeveniment")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Carregant esdeveniments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#ef4444]">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#18181b]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#fafafa]">
            Esdeveniments Actuals
          </h1>
          <Link href="/admin/event/new">
            <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-[#18181b] font-semibold">
              <Plus className="w-4 h-4" />
              Crear Esdeveniment
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <AdminEventCard 
              key={event.id} 
              event={event} 
              onDelete={handleDelete}
            />
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#71717a]">No s'han trobat esdeveniments</div>
          </div>
        )}
      </div>
    </div>
  )
}
