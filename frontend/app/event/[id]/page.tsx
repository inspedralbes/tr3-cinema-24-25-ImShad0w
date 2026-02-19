"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Calendar, Ticket, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEvent } from "../../../hooks/useEvents"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const { event, loading, error } = useEvent(eventId)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#a1a1aa]">Carregant esdeveniment...</div>
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

  if (!event) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
        <div className="text-[#71717a]">Esdeveniment no trobat</div>
      </div>
    )
  }

  const formattedDate = new Date(event.date).toLocaleDateString('ca-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-[#18181b]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/event">
          <Button
            variant="ghost"
            className="mb-8 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#27272a]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tornar a Esdeveniments
          </Button>
        </Link>

        <Card className="bg-[#27272a] border-[#3f3f46]">
          <CardHeader className="pb-6">
            <CardTitle className="text-[#fafafa] text-3xl font-bold">
              {event.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            <CardDescription className="text-[#a1a1aa] text-base leading-relaxed">
              {event.description}
            </CardDescription>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[#a1a1aa]">
                <Calendar className="w-5 h-5 text-[#f59e0b]" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-3 text-[#a1a1aa]">
                <MapPin className="w-5 h-5 text-[#f59e0b]" />
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#18181b] rounded-lg border border-[#3f3f46]">
              <Ticket className="w-5 h-5 text-[#f59e0b]" />
              <div>
                <span className="text-[#fafafa] font-semibold">{event.seats_count}</span>
                <span className="text-[#a1a1aa] ml-2">entrades disponibles</span>
              </div>
            </div>

            <Link href={`/event/${event.id}/reserve`}
              className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#18181b] font-semibold p-3 rounded-lg"
            >
              Obtenir Entrades
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
