import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#18181b] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* Main Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#fafafa] mb-4">
          Pass<span className="text-[#f59e0b]">Master</span>
        </h1>
        {/* Tagline */}
        <p className="text-lg text-[#a1a1aa] mb-10">
          Troba i reserva entrades per als millors esdeveniments en directe
        </p>
        <Link href="/event">
          <Button
            size="lg"
            className="bg-[#f59e0b] hover:bg-[#d97706] text-[#18181b] font-semibold px-10 py-6 text-base"
          >
            Veure Esdeveniments
          </Button>
        </Link>
      </div>
    </main>
  );
}
