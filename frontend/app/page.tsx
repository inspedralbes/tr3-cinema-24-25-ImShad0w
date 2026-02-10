import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          Pass<span className="text-[#026CDF]">Master</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-xl">
          Your ticket to the best live events
        </p>
        <Link href="/events">
          <Button
            size="lg"
            className="bg-[#026CDF] hover:bg-[#0258b8] text-white font-bold text-lg px-10 py-6 rounded-full"
          >
            Find Events
          </Button>
        </Link>
      </div>
    </main>
  );
}
