import Link from "next/link"
import { MapPin, Calendar, Ticket } from "lucide-react"
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

export default function EventCard({ event }: { event: Event }) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

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
                  Details
                </Button>
              </Link>
              <Link href={`/event/${event.id}/reserve`}
                className="bg-[#f59e0b] hover:bg-[#d97706] text-[#18181b] font-semibold"
              >
                Get Tickets
              </Link>
            </div>
          </CardContent>
        </div>

        {/* Right Side - Tickets */}
        <div className="flex flex-col items-center justify-center px-10 border-l border-[#3f3f46]">
          <Ticket className="w-5 h-5 text-[#f59e0b] mb-2" />
          <span className="text-[#fafafa] text-4xl font-bold">{event.seats_count}</span>
          <span className="text-[#71717a] text-xs mt-1 uppercase tracking-wider">left</span>
        </div>
      </div>
    </Card>
  )
}
