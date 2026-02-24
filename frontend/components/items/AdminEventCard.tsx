"use client"

import Link from "next/link"
import { MapPin, Calendar, Pencil, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"

type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  seats_count: number;
}

type AdminEventCardProps = {
  event: Event;
  onDelete?: (id: number) => void;
}

export default function AdminEventCard({ event, onDelete }: AdminEventCardProps) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const handleDelete = () => {
    if (onDelete) {
      onDelete(event.id)
    }
  }

  return (
    <Card className="bg-[#27272a] border-[#3f3f46] hover:border-[#f59e0b]/50 transition-colors duration-200">
      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-[#fafafa] text-xl font-semibold">
              {event.title}
            </CardTitle>
            <CardDescription className="text-[#a1a1aa] mt-2">
              {event.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6">
            {/* Date & Location */}
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-[#a1a1aa]">
                <Calendar className="w-4 h-4 text-[#f59e0b]" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2 text-[#a1a1aa]">
                <MapPin className="w-4 h-4 text-[#f59e0b]" />
                {event.location}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Link href={`/event/${event.id}`}>
                <Button
                  variant="ghost"
                  className="text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#3f3f46]"
                >
                  Detalls
                </Button>
              </Link>
              <Link href={`/admin/event/${event.id}/edit`}>
                <Button
                  variant="outline"
                  className="border-[#3f3f46] text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#3f3f46] hover:border-[#f59e0b]/50"
                >
                  <Pencil className="w-4 h-4" />
                  Modificar
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Right Side - Tickets */}
        <div className="flex flex-col items-center justify-center px-10 border-l border-[#3f3f46]">
          <span className="text-[#fafafa] text-4xl font-bold">{event.seats_count}</span>
          <span className="text-[#71717a] text-xs mt-1 uppercase tracking-wider">places</span>
        </div>
      </div>
    </Card>
  )
}
