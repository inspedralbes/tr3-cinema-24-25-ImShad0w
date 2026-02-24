"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const seatsCount = searchParams.get("seats") || "0"

  return (
    <div className="min-h-screen bg-[#18181b] flex items-center justify-center">
      <div className="max-w-md mx-auto px-6 py-12 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-[#22c55e]" />
        </div>

        <h1 className="text-3xl font-bold text-[#fafafa] mb-4">
          Compra realitzada!
        </h1>
        
        <p className="text-[#a1a1aa] mb-2">
          Gràcies per la teva compra.
        </p>
        <p className="text-[#71717a] mb-8">
          S'ha descargat un PDF amb les teves entrades. 
          També pots trobar-les al teu correu electrònic.
        </p>

        <div className="bg-[#27272a] border border-[#3f3f46] rounded-xl p-4 mb-8">
          <p className="text-[#fafafa]">
            <span className="text-[#f59e0b] font-bold">{seatsCount}</span> {parseInt(seatsCount) === 1 ? "entrada" : "entrades"} comprades
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#18181b] font-semibold">
              <Home className="w-4 h-4" />
              Tornar a l'inici
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
