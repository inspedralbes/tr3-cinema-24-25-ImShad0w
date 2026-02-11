"use client"

import { useEffect, useState } from "react"
import EventCard from "@/components/items/EventCard"

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("http://localhost:8000/api/event")
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Loading events...</div>
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
        {/* Page Header */}
        <h1 className="text-3xl font-bold text-[#fafafa] mb-8">
          Current Events
        </h1>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#71717a]">No events found</div>
          </div>
        )}
      </div>
    </div>
  )
}
