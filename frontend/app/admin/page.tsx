"use client"

import EventCard from "@/components/items/EventCard"
import { useEvents } from "../../hooks/useEvents"

export default function AdminPage() {
  const { events, loading, error } = useEvents()

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
        <h1 className="text-3xl font-bold text-[#fafafa] mb-8">
          Esdeveniments Actuals
        </h1>

        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
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
